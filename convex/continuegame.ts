import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Deletes all ongoing games for a user except the one with the matching ID.
 */
export const deleteStaleGames = internalMutation({
  args: {
    userClerkId: v.string(),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
    matchingId: v.id("ongoingGames"),
  },
  handler: async (ctx, args) => {
    const staleGames = await ctx.db
      .query("ongoingGames")
      .withIndex("byUserClerkId", (q) => q.eq("userClerkId", args.userClerkId))
      .collect();
    for (const stale of staleGames) {
      if (stale.gameType === args.gameType && stale._id !== args.matchingId) {
        await ctx.db.delete(stale._id);
      }
    }
  },
});

/**
 * Updates an existing ongoing game entry with new progress.
 * Used to save a user's current game state as they play.
 *
 * @param ongoingGameId - ID of the ongoing game entry to update
 * @param currentRound - The current round number (1-5) the user is on
 * @param timeLeftInRound - Optional time remaining in current round in seconds
 * @param totalTimeTaken - Total time taken across all rounds in seconds
 * @param isWeekly - Boolean indicating if the game is a weekly challenge
 */
export const updateOngoingGame = mutation({
  args: {
    ongoingGameId: v.id("ongoingGames"),
    currentRound: v.int64(),
    timeLeftInRound: v.optional(v.int64()),
    totalTimeTaken: v.int64(),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
  },
  handler: async (ctx, args) => {
    const { ongoingGameId, currentRound, timeLeftInRound, totalTimeTaken, gameType } = args;
    await ctx.db.patch(ongoingGameId, {
      currentRound,
      timeLeftInRound,
      totalTimeTaken,
      gameType,
    });
  },
});

/**
 * Updates an existing ongoing game entry or creates a new one if none exists.
 * Used to save a user's current game state as they play.
 *
 * @param gameId - ID of the game being saved
 * @param userClerkId - Clerk ID of the user saving the game
 * @param currentRound - The current round number (1-5) the user is on
 * @param timeLeftInRound - Optional time remaining in current round in seconds
 * @param totalTimeTaken - Total time taken across all rounds in seconds
 * @param scores - Optional array of scores for each round completed
 * @param distances - Optional array of distances for each round completed
 * @param isWeekly - Boolean indicating if the game is a weekly challenge
 */
export const updateOngoingGameOrCreate = mutation({
  args: {
    gameId: v.id("games"),
    currentRound: v.int64(),
    timeLeftInRound: v.optional(v.int64()),
    totalTimeTaken: v.int64(),
    scores: v.optional(v.array(v.int64())),
    distances: v.optional(v.array(v.int64())),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { gameId, currentRound, timeLeftInRound, totalTimeTaken, scores, distances, gameType } = args;
    const userClerkId = identity.subject;

    const existingGame = await ctx.db
      .query("ongoingGames")
      .withIndex("byUserClerkIdGame", (q) => q.eq("userClerkId", userClerkId).eq("game", gameId))
      .first();
    if (existingGame) {
      await ctx.scheduler.runAfter(0, internal.continuegame.deleteStaleGames, {
        userClerkId,
        gameType,
        matchingId: existingGame._id,
      });
      await ctx.db.patch(existingGame._id, {
        game: gameId,
        userClerkId,
        currentRound,
        timeLeftInRound,
        totalTimeTaken,
        scores,
        distances,
        gameType,
      });
    } else {
      const newId = await ctx.db.insert("ongoingGames", {
        game: gameId,
        userClerkId,
        currentRound,
        timeLeftInRound,
        totalTimeTaken,
        scores,
        distances,
        gameType,
      });
      await ctx.scheduler.runAfter(0, internal.continuegame.deleteStaleGames, {
        userClerkId,
        gameType,
        matchingId: newId,
      });
    }
  },
});

/**
 * Deletes an ongoing game entry.
 * Used when a user completes a game to clean up their save data.
 *
 * @param gameId - ID of the game to delete the ongoing game for
 * @param userClerkId - Clerk ID of the user to delete the ongoing game for
 */
export const deleteOngoingGame = mutation({
  args: {
    gameId: v.id("games"),
    userClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const { gameId, userClerkId } = args;
    // find the ongoing game with the given gameId and userClerkId
    const ongoingGame = await ctx.db
      .query("ongoingGames")
      .withIndex("byUserClerkIdGame", (q) => q.eq("userClerkId", userClerkId).eq("game", gameId))
      .first();
    if (ongoingGame) {
      await ctx.db.delete(ongoingGame._id);
    }
  },
});

/**
 * Gets the most recent ongoing game for a user if one exists.
 * Used to check if a user has a game in progress that they can resume.
 *
 * @param userClerkId - The Clerk ID of the user to check for ongoing games
 * @returns The most recent ongoing game entry for the user, or null if none exists
 */
export const getOngoingGameFromUser = query({
  args: {
    userClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userClerkId } = args;
    const ongoingGame = await ctx.db
      .query("ongoingGames")
      .withIndex("byUserClerkId")
      .filter((q) =>
        q.and(q.eq(q.field("userClerkId"), userClerkId), q.neq(q.field("gameType"), "multiplayer"))
      )
      .first();
    return ongoingGame;
  },
});

/**
 * Gets an ongoing game by its game ID.
 * Used to retrieve the ongoing game details when resuming a game.
 *
 * @param gameId - The ID of the game to retrieve the ongoing game for
 * @returns The ongoing game entry for the given game ID, or null if none exists
 */
export const getOngoingGameById = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, args) => {
    const { gameId } = args;
    const ongoingGame = await ctx.db
      .query("ongoingGames")
      .withIndex("byGame")
      .filter((q) => q.eq(q.field("game"), gameId))
      .first();
    return ongoingGame;
  },
});

