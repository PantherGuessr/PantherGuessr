import { v } from "convex/values";

import { computeXPBreakdown, isNewPSTDay } from "../lib/xp";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";

// Gets the number of random Levels from the database
// export const getRandomLevels = query({
//     args: { cacheBuster: v.number() },
//     handler: async (ctx) => {
//         // TODO: Implement a way to choose number of levels based on backend settings
//         const numOfLevels = 5;
//         const levels = await ctx.db.query("levels").collect();

//         if(levels.length < numOfLevels) {
//             throw new Error("Not enough levels to complete request!");
//         }

//         console.log(levels);

//         const selectedLevels = [];

//         for(let i = 0; i < numOfLevels; i++) {
//             const randomIndex = Math.floor(Math.random() * levels.length);
//             selectedLevels[i] = levels[randomIndex];
//             levels.splice(randomIndex, 1);
//         }

//         // Extract and return the Ids of the selected levels
//         const levelIds = selectedLevels.map(level => level._id);
//         console.log("[SERVER SIDE] Ids", levelIds);
//         return levelIds;
//     }
// });

/**
 * Retrieves a game document by its ID.
 *
 * @param args.gameId - The ID of the game to retrieve
 * @returns The game document if found, null otherwise
 */
export const getExistingGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    try {
      const docId = args.gameId as Id<"games">;
      const doc = await ctx.db.get(docId);
      return doc || null; // If doc doesn't exist, doc is null
    } catch (error) {
      console.log(error);
      // If decoding fails (invalid ID format), return null
      return null;
    }
  },
});

/**
 * Query to check if a game exists in the database.
 *
 * @param args - The arguments for the query.
 * @param args.gameId - The ID of the game to check.
 * @returns A boolean indicating whether the game exists.
 *
 * @example
 * const exists = await gameExists({ gameId: "some-game-id" });
 * console.log(exists); // true or false
 *
 * @throws Will log an error and return false if there is an issue with the database query.
 */
export const gameExists = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    try {
      const docId = args.gameId as Id<"games">;
      const doc = await ctx.db.get(docId);
      return doc ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});

/**
 * Mutation to clear old games from the database.
 *
 * This mutation performs the following steps:
 * 1. Calculates the current time and the time one month ago.
 * 2. Queries the "games" collection for games older than one month.
 * 3. Iterates through the old games and performs the following actions:
 *    - Deletes any connected leaderboard entries.
 *    - Deletes any connected ongoing games.
 *    - Deletes the game itself.
 *
 * @param {Object} ctx - The context object containing the database connection.
 * @returns {Promise<string>} - A promise that resolves to a string indicating the number of deleted games.
 */
export const clearOldGames = internalMutation({
  async handler(ctx) {
    const now = new Date();
    const time = now.getTime();
    const monthInMs = 30 * 24 * 60 * 60 * 1000;
    const oldtime = time - monthInMs;
    const games = await ctx.db
      .query("games")
      .filter((q) => q.lt(q.field("_creationTime"), oldtime))
      .collect();

    // iterate through all games
    for (const game of games) {
      // get the connected leaderboard IDs, if applicable
      const leaderboardIds = game.leaderboard ?? [];
      for (const leaderboardId of leaderboardIds) {
        await ctx.db.delete(leaderboardId);
      }

      // get any connected ongoing games, if applicable
      await ctx.db
        .query("ongoingGames")
        .filter((q) => q.eq(q.field("game"), game._id))
        .collect()
        .then(
          // delete the ongoing games
          async (ongoingGames) => {
            for (const ongoingGame of ongoingGames) {
              await ctx.db.delete(ongoingGame._id);
            }
          }
        );
      // delete game
      await ctx.db.delete(game._id);

      return `Deleted ${games.length} games`;
    }
  },
});

export const clearUnplayedGames = internalMutation({
  async handler(ctx) {
    const days = 7;
    const now = new Date();
    const time = now.getTime();
    const timeLimit = days * 24 * 60 * 60 * 1000; // 7 days
    const oldTime = time - timeLimit;
    const games = await ctx.db
      .query("games")
      .filter((q) => q.lt(q.field("_creationTime"), oldTime))
      .collect();

    for (const game of games) {
      if (!game.firstPlayedByClerkId) {
        // check if game has any ongoing games
        const ongoingGames = await ctx.db
          .query("ongoingGames")
          .filter((q) => q.eq(q.field("game"), game._id))
          .collect();
        // delete ongoing games
        for (const ongoingGame of ongoingGames) {
          await ctx.db.delete(ongoingGame._id);
        }
        // delete game
        await ctx.db.delete(game._id);
      }
    }

    return `Deleted ${games.length} unplayed games older than ${days} days`;
  },
});

/**
 * Creates a new game with 5 randomly selected levels.
 *
 * @param args.timeAllowedPerRound - The time limit in seconds for each round
 * @returns
 *
 * This mutation:
 * 1. Gets all available levels from the database
 * 2. Randomly selects 5 unique levels
 * 3. Creates a new game document with the selected levels and time limit
 * 4. Returns the game ID
 */
export const createNewGame = mutation({
  args: { timeAllowedPerRound: v.int64() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const staleOngoingGames = await ctx.db
        .query("ongoingGames")
        .withIndex("byUserClerkId", (q) => q.eq("userClerkId", identity.subject))
        .collect();
      for (const staleGame of staleOngoingGames) {
        if (staleGame.gameType === "singleplayer") {
          await ctx.db.delete(staleGame._id);
        }
      }
    }

    const levels = await ctx.db.query("levels").collect();
    const randomLevels = [];
    const randomIndices: number[] = [];

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * levels.length);
      if (randomIndices.includes(randomIndex)) {
        i--;
        continue;
      }
      randomIndices.push(randomIndex);
      randomLevels.push(levels[randomIndex]._id);
    }

    const gameId = await ctx.db.insert("games", {
      round_1: randomLevels[0],
      round_2: randomLevels[1],
      round_3: randomLevels[2],
      round_4: randomLevels[3],
      round_5: randomLevels[4],
      timeAllowedPerRound: args.timeAllowedPerRound,
      gameType: "singleplayer",
    });

    return gameId;
  },
});

/**
 * Retrieves a game document by its ID.
 *
 * @param args.id - The ID of the game to retrieve
 * @returns The game document if found, null otherwise
 *
 * This query:
 * 1. Takes a game ID as input
 * 2. Looks up the corresponding game document in the database
 * 3. Returns the full game document or null if not found
 */
export const getGameById = query({
  args: { id: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Adds a leaderboard entry for a completed game.
 *
 * @param args.gameId - ID of the game the entry is for
 * @param args.totalTimeTaken - Total time taken to complete all rounds
 * @param args.gameType - The game mode that the leaderboard entry is for
 * @returns Object indicating success/failure of adding the entry
 *
 * This mutation:
 * 1. Creates a new leaderboard entry document with the provided scores
 * 2. Retrieves the game document
 * 3. Adds the new entry ID to the game's leaderboard array
 * 4. Returns success status
 */

export const addLeaderboardEntryToGame = mutation({
  args: {
    gameId: v.id("games"),
    totalTimeTaken: v.int64(),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const callerUser = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!callerUser) throw new Error("User not found");

    const ongoingGame = await ctx.db
      .query("ongoingGames")
      .withIndex("byUserClerkIdGame", (q) =>
        q.eq("userClerkId", identity.subject).eq("game", args.gameId)
      )
      .first();

    if (!ongoingGame?.scores || ongoingGame.scores.length !== 5) {
      throw new Error("Game not completed — all 5 rounds must be played before submitting");
    }
    if (!ongoingGame.distances || ongoingGame.distances.length !== 5) {
      throw new Error("Incomplete game data");
    }

    const [round_1, round_2, round_3, round_4, round_5] = ongoingGame.scores;
    const [round_1_distance, round_2_distance, round_3_distance, round_4_distance, round_5_distance] =
      ongoingGame.distances;

    // Fetch user data before updating streak/timestamp (both are mutated after this)
    const user = callerUser;
    const currentStreak = user?.currentStreak ?? 0n;

    const isFirstGameOfDay = isNewPSTDay(user?.lastPlayedTimestamp);

    const { totalXP: newXP } = computeXPBreakdown(
      [round_1, round_2, round_3, round_4, round_5].map(Number),
      [round_1_distance, round_2_distance, round_3_distance, round_4_distance, round_5_distance].map(Number),
      Number(currentStreak),
      isFirstGameOfDay
    );

    // calculate total points to update user points earned
    const totalPointsEarned = round_1 + round_2 + round_3 + round_4 + round_5;

    const xpResult: { newLevel: bigint; oldLevel: bigint } = await ctx.runMutation(internal.users.awardUserXP, {
      userID: callerUser._id,
      earnedXP: newXP,
      totalPointsEarned: BigInt(totalPointsEarned || 0n),
    });

    // make leaderboard entry
    const leaderboardEntry = await ctx.db.insert("leaderboardEntries", {
      game: args.gameId,
      oldLevel: xpResult.oldLevel,
      newLevel: xpResult.newLevel,
      userId: callerUser._id,
      round_1,
      round_1_distance,
      round_2,
      round_2_distance,
      round_3,
      round_3_distance,
      round_4,
      round_4_distance,
      round_5,
      round_5_distance,
      totalTimeTaken: args.totalTimeTaken,
      xpGained: newXP,
      streakAtGame: currentStreak,
      firstGameOfDay: isFirstGameOfDay,
      gameType: args.gameType,
    });

    // get game by ID
    const game = await ctx.db.get(args.gameId);

    // add leaderboard entry to game with existing entries
    if (game) {
      await ctx.db.patch(args.gameId, {
        leaderboard: [...(game?.leaderboard ?? []), leaderboardEntry],
      });
    } else {
      return null;
    }

    await ctx.db.delete(ongoingGame._id);

    await ctx.runMutation(internal.gamestats.incrementDailyGameStats);
    await ctx.runMutation(internal.gamestats.incrementMonthlyGameStats);

    // Update streak
    await ctx.runMutation(internal.users.updateStreak, { userId: callerUser._id });

    // Award achievements
    const scores = [round_1, round_2, round_3, round_4, round_5];

    // first_steps: first completed game
    const priorEntries = await ctx.db
      .query("leaderboardEntries")
      .withIndex("byUserId", (q) => q.eq("userId", callerUser._id))
      .take(2);
    if (priorEntries.length === 1) {
      await ctx.runMutation(internal.achievements.grantAchievement, {
        userId: callerUser._id,
        achievementId: "first_steps",
      });
    }

    // map_master: at least one perfect round (score of 250)
    if (scores.some((s) => s === 250n)) {
      await ctx.runMutation(internal.achievements.grantAchievement, {
        userId: callerUser._id,
        achievementId: "map_master",
      });
    }

    // sniped: all 5 rounds perfect
    if (scores.every((s) => s === 250n)) {
      await ctx.runMutation(internal.achievements.grantAchievement, {
        userId: callerUser._id,
        achievementId: "sniped",
      });
    }

    return leaderboardEntry;
  },
});

/**
 * Retrieves a leaderboard entry by its ID
 *
 * @param args.id - The ID of the leaderboard entry to retrieve
 * @returns The leaderboard entry
 */
export const getPersonalLeaderboardEntryById = query({
  args: { id: v.string() },
  handler: async (ctx, { id }) => {
    try {
      const docId = id as Id<"leaderboardEntries">;
      const doc = await ctx.db.get(docId);
      return doc || null; // If doc doesn't exist, doc is null
    } catch (error) {
      console.log(error);
      // If decoding fails (invalid ID format), return null
      return null;
    }
  },
});

/**
 * Retrieves all leaderboard entries for a specific game, sorted by total score descending.
 * @param args.gameId - The ID of the game
 * @returns Array of leaderboard entries
 */
export const getLeaderboardEntriesForGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("leaderboardEntries")
      .filter((q) => q.eq(q.field("game"), args.gameId))
      .collect();

    // Calculate total score for each entry and sort descending
    const sorted = entries
      .map((entry) => ({
        ...entry,
        totalScore:
          Number(entry.round_1 ?? 0) +
          Number(entry.round_2 ?? 0) +
          Number(entry.round_3 ?? 0) +
          Number(entry.round_4 ?? 0) +
          Number(entry.round_5 ?? 0),
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    return sorted;
  },
});

/**
 * Retrieves a leaderboard entry for a specific game and user.
 *
 * @param args.gameId - The ID of the game
 * @param args.userId - The ID of the user
 * @returns The leaderboard entry if found, null otherwise
 */
export const getLeaderboardEntryByGameAndUser = query({
  args: { gameId: v.id("games"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("leaderboardEntries")
      .filter((q) => q.eq(q.field("game"), args.gameId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return entry || null;
  },
});

/**
 * Retrieves the image src url based on an id
 *
 * @param args.id - The ID of the level to retrieve
 * @returns The image src url
 */
export const getImageSrc = query({
  args: { id: v.id("levels") },
  handler: async (ctx, args) => {
    if (!args.id) {
      throw new Error("Missing entryId parameter.");
    }

    const level = await ctx.db.get(args.id);

    if (!level) {
      throw new Error("No levels exist");
    }

    const imageUrl = await ctx.storage.getUrl(level.imageId);

    return imageUrl;
  },
});

export const updateFirstPlayedByClerkId = mutation({
  args: { gameId: v.id("games"), clerkId: v.string() },
  handler: async (ctx, args) => {
    // update only if firstPlayedByClerkId is not set
    const game = await ctx.db.get(args.gameId);

    if (!game) {
      throw new Error("No games exist");
    }

    if (game.firstPlayedByClerkId) {
      return { success: false };
    }

    // update
    const newGame = {
      ...game,
      firstPlayedByClerkId: args.clerkId,
    };

    await ctx.db.replace(args.gameId, newGame);

    return { success: true };
  },
});

/**
 * Calculates the distance between two points in feet using the Haversine formula
 *
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns The distance in feet
 */
export const haversineDistanceInFeet = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 3958.8; // Radius of the Earth in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMiles = R * c;
  const distanceInFeet = distanceInMiles * 5280; // Convert miles to feet

  return distanceInFeet;
};

/**
 * Checks a user's guess against the correct latitude and longitude of a level
 *
 * @param args.id - The ID of the level to check against
 * @param args.gameId - The ID of the game to check
 * @param args.guessLatitude - The user's guess for the latitude
 * @param args.guessLongitude - The user's guess for the longitude
 * @returns An object containing the correct latitude, correct longitude, distance away, and score
 */
export const checkGuess = mutation({
  args: {
    id: v.id("levels"),
    gameId: v.id("games"),
    guessLatitude: v.float64(),
    guessLongitude: v.float64(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Game not found");

    const roundIds = [game.round_1, game.round_2, game.round_3, game.round_4, game.round_5];
    const roundIndex = roundIds.findIndex((id) => id === args.id);
    if (roundIndex === -1) throw new Error("Level is not part of this game");

    // check if this round has already been answered
    const existingOngoingGame = await ctx.db
      .query("ongoingGames")
      .withIndex("byUserClerkIdGame", (q) =>
        q.eq("userClerkId", identity.subject).eq("game", args.gameId)
      )
      .first();

    if ((existingOngoingGame?.scores?.length ?? 0) > roundIndex) {
      throw new Error("Already submitted a guess for this round");
    }

    const level = await ctx.db.get(args.id);
    if (!level) throw new Error("Level not found");

    const correctLat = level.latitude;
    const correctLng = level.longitude;

    const distanceAway = parseInt(
      haversineDistanceInFeet(correctLat, correctLng, args.guessLatitude, args.guessLongitude).toFixed(0)
    );
    // give some leniency to the distance
    let lenientDistance = distanceAway - 20;
    if (lenientDistance < 0) {
      lenientDistance = 0;
    }
    // If within 250 feet, score increases by distance if outside of 250 feet score = 0
    let score = 250 - lenientDistance;
    if (score < 0) {
      // no negative score
      score = 0;
    }

    console.log("Correct: " + correctLat + " " + correctLng);
    console.log("User Guess: " + args.guessLatitude + " " + args.guessLongitude);

    await ctx.db.patch(args.id, {
      timesPlayed: (level.timesPlayed ?? BigInt(0)) + BigInt(1),
    });

    const newScores = [...(existingOngoingGame?.scores ?? []), BigInt(score)];
    const newDistances = [...(existingOngoingGame?.distances ?? []), BigInt(distanceAway)];

    if (existingOngoingGame) {
      await ctx.scheduler.runAfter(0, internal.continuegame.deleteStaleGames, {
        userClerkId: identity.subject,
        gameType: game.gameType,
        matchingId: existingOngoingGame._id,
      });
      await ctx.db.patch(existingOngoingGame._id, {
        scores: newScores,
        distances: newDistances,
      });
    } else {
      const newId = await ctx.db.insert("ongoingGames", {
        game: args.gameId,
        userClerkId: identity.subject,
        currentRound: BigInt(roundIndex + 2),
        totalTimeTaken: BigInt(0),
        scores: newScores,
        distances: newDistances,
        gameType: game.gameType,
      });
      await ctx.scheduler.runAfter(0, internal.continuegame.deleteStaleGames, {
        userClerkId: identity.subject,
        gameType: game.gameType,
        matchingId: newId,
      });
    }

    return {
      correctLat,
      correctLng,
      distanceAway,
      score,
    };
  },
});

/**
 * Gets the game type for a given game ID.
 * @param gameId - The ID of the game to retrieve the type for
 * @returns The game type as a string ("weekly", "singleplayer", or "multiplayer"), or null if not found
 */
export const getGameType = query({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game) {
      return null;
    }
    return game.gameType;
  },
});
