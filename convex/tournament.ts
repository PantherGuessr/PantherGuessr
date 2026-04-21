import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { haversineDistanceInFeet } from "./game";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PG-${suffix}`;
}

export const createTournamentRoom = mutation({
  args: { name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");
    const roles = user.roles ?? [];
    if (!roles.includes("developer") && !roles.includes("admin")) {
      throw new Error("Insufficient permissions");
    }

    let roomCode: string;
    let attempts = 0;
    do {
      roomCode = generateRoomCode();
      const existing = await ctx.db
        .query("tournamentRooms")
        .withIndex("byRoomCode", (q) => q.eq("roomCode", roomCode))
        .unique();
      if (!existing) break;
      attempts++;
      if (attempts > 20) throw new Error("Failed to generate unique room code");
    } while (true);

    const roomId = await ctx.db.insert("tournamentRooms", {
      roomCode,
      organizerClerkId: identity.subject,
      name: args.name,
      status: "waiting",
      currentRound: 1,
      player1TotalScore: 0,
      player2TotalScore: 0,
    });

    return { roomId, roomCode };
  },
});

export const joinTournamentRoom = mutation({
  args: { roomCode: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const clerkId = identity.subject;

    const room = await ctx.db
      .query("tournamentRooms")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", args.roomCode))
      .unique();

    if (!room) throw new Error("Room not found");
    if (room.status !== "waiting") throw new Error("Room is not accepting players");
    if (room.player1ClerkId === clerkId || room.player2ClerkId === clerkId) {
      return room._id;
    }
    if (room.player1ClerkId && room.player2ClerkId) throw new Error("Room is full");

    if (!room.player1ClerkId) {
      await ctx.db.patch(room._id, { player1ClerkId: clerkId });
    } else {
      await ctx.db.patch(room._id, { player2ClerkId: clerkId });
    }

    return room._id;
  },
});

export const startTournamentGame = mutation({
  args: { roomId: v.id("tournamentRooms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (room.organizerClerkId !== identity.subject) throw new Error("Not the organizer");

    const levels = await ctx.db.query("levels").collect();
    if (levels.length < 5) throw new Error("Not enough levels");

    const randomLevels: typeof levels = [];
    const usedIndices = new Set<number>();
    while (randomLevels.length < 5) {
      const idx = Math.floor(Math.random() * levels.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        randomLevels.push(levels[idx]);
      }
    }

    const gameId = await ctx.db.insert("games", {
      round_1: randomLevels[0]._id,
      round_2: randomLevels[1]._id,
      round_3: randomLevels[2]._id,
      round_4: randomLevels[3]._id,
      round_5: randomLevels[4]._id,
      timeAllowedPerRound: BigInt(0),
      gameType: "multiplayer",
    });

    await ctx.db.patch(args.roomId, {
      currentGameId: gameId,
      status: "round_active",
      currentRound: 1,
      player1TotalScore: 0,
      player2TotalScore: 0,
    });

    return gameId;
  },
});

export const updateLiveMarker = mutation({
  args: {
    roomId: v.id("tournamentRooms"),
    round: v.number(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const clerkId = identity.subject;

    const existing = await ctx.db
      .query("tournamentGuesses")
      .withIndex("byRoomRoundPlayer", (q) =>
        q.eq("roomId", args.roomId).eq("round", args.round).eq("playerClerkId", clerkId)
      )
      .unique();

    if (existing) {
      if (!existing.hasSubmitted) {
        await ctx.db.patch(existing._id, { currentLat: args.lat, currentLng: args.lng });
      }
    } else {
      await ctx.db.insert("tournamentGuesses", {
        roomId: args.roomId,
        playerClerkId: clerkId,
        round: args.round,
        currentLat: args.lat,
        currentLng: args.lng,
        hasSubmitted: false,
      });
    }
  },
});

export const submitTournamentGuess = mutation({
  args: {
    roomId: v.id("tournamentRooms"),
    round: v.number(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const clerkId = identity.subject;

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (!room.currentGameId) throw new Error("Game not started");

    const game = await ctx.db.get(room.currentGameId);
    if (!game) throw new Error("Game not found");

    const roundKey = `round_${args.round}` as "round_1" | "round_2" | "round_3" | "round_4" | "round_5";
    const levelId = game[roundKey];
    const level = await ctx.db
      .query("levels")
      .withIndex("by_id", (q) => q.eq("_id", levelId))
      .unique();
    if (!level) throw new Error("Level not found");

    const correctLat = level.latitude;
    const correctLng = level.longitude;
    const distanceAway = parseInt(
      haversineDistanceInFeet(correctLat, correctLng, args.lat, args.lng).toFixed(0)
    );
    let lenientDistance = distanceAway - 20;
    if (lenientDistance < 0) lenientDistance = 0;
    let score = 250 - lenientDistance;
    if (score < 0) score = 0;

    const existing = await ctx.db
      .query("tournamentGuesses")
      .withIndex("byRoomRoundPlayer", (q) =>
        q.eq("roomId", args.roomId).eq("round", args.round).eq("playerClerkId", clerkId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        currentLat: args.lat,
        currentLng: args.lng,
        hasSubmitted: true,
        score,
        distanceFeet: distanceAway,
        correctLat,
        correctLng,
      });
    } else {
      await ctx.db.insert("tournamentGuesses", {
        roomId: args.roomId,
        playerClerkId: clerkId,
        round: args.round,
        currentLat: args.lat,
        currentLng: args.lng,
        hasSubmitted: true,
        score,
        distanceFeet: distanceAway,
        correctLat,
        correctLng,
      });
    }

    const isPlayer1 = room.player1ClerkId === clerkId;
    if (isPlayer1) {
      await ctx.db.patch(args.roomId, {
        player1TotalScore: room.player1TotalScore + score,
      });
    } else {
      await ctx.db.patch(args.roomId, {
        player2TotalScore: room.player2TotalScore + score,
      });
    }

    return { score, distanceFeet: distanceAway, correctLat, correctLng };
  },
});

export const advanceToNextRound = mutation({
  args: { roomId: v.id("tournamentRooms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (room.organizerClerkId !== identity.subject) throw new Error("Not the organizer");

    if (room.currentRound >= 5 && room.status === "round_summary") {
      await ctx.db.patch(args.roomId, { status: "finished" });
    } else {
      await ctx.db.patch(args.roomId, {
        currentRound: room.currentRound + 1,
        status: "round_active",
      });
    }
  },
});

export const showRoundSummary = mutation({
  args: { roomId: v.id("tournamentRooms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    if (room.organizerClerkId !== identity.subject) throw new Error("Not the organizer");

    await ctx.db.patch(args.roomId, { status: "round_summary" });
  },
});

export const leaveTournamentRoom = mutation({
  args: { roomId: v.id("tournamentRooms") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const clerkId = identity.subject;

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    if (room.player1ClerkId === clerkId) {
      await ctx.db.patch(args.roomId, {
        player1ClerkId: undefined,
        ...(room.status === "waiting" ? {} : {}),
      });
    } else if (room.player2ClerkId === clerkId) {
      await ctx.db.patch(args.roomId, { player2ClerkId: undefined });
    }
  },
});

export const getTournamentRoomByCode = query({
  args: { roomCode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournamentRooms")
      .withIndex("byRoomCode", (q) => q.eq("roomCode", args.roomCode))
      .unique();
  },
});

export const getTournamentRoomById = query({
  args: { roomId: v.id("tournamentRooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getTournamentGuessesForRound = query({
  args: { roomId: v.id("tournamentRooms"), round: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournamentGuesses")
      .withIndex("byRoomAndRound", (q) => q.eq("roomId", args.roomId).eq("round", args.round))
      .collect();
  },
});

export const getUsersByClerkIds = query({
  args: { clerkIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const results = await Promise.all(
      args.clerkIds.map((clerkId) =>
        ctx.db
          .query("users")
          .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
          .unique()
      )
    );
    return results.filter(Boolean);
  },
});

export const getRoomsByOrganizer = query({
  args: { organizerClerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tournamentRooms")
      .withIndex("byOrganizerClerkId", (q) => q.eq("organizerClerkId", args.organizerClerkId))
      .collect();
  },
});
