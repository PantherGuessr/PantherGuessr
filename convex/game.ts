import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

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
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gameId);
  }
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
      timeAllowedPerRound: args.timeAllowedPerRound
    });

    return gameId;
  }
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
  }
});

/**
 * Adds a leaderboard entry for a completed game.
 * 
 * @param args.gameId - ID of the game the entry is for
 * @param args.userClerkId - Clerk ID of the user who completed the game
 * @param args.round_1 - Score for round 1 
 * @param args.round_2 - Score for round 2
 * @param args.round_3 - Score for round 3
 * @param args.round_4 - Score for round 4
 * @param args.round_5 - Score for round 5
 * @param args.totalTimeTaken - Total time taken to complete all rounds
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
    username: v.string(),
    userId: v.id("users"),
    round_1: v.int64(),
    round_1_distance: v.int64(),
    round_2: v.int64(),
    round_2_distance: v.int64(),
    round_3: v.int64(),
    round_3_distance: v.int64(),
    round_4: v.int64(),
    round_4_distance: v.int64(),
    round_5: v.int64(),
    round_5_distance: v.int64(),
    totalTimeTaken: v.int64()
  },
  handler: async (ctx, args) => {
    const newXP = getTotalEarnedXP(
      [
        args.round_1,
        args.round_2,
        args.round_3,
        args.round_4,
        args.round_5
      ],
      [
        args.round_1_distance,
        args.round_2_distance,
        args.round_3_distance,
        args.round_4_distance,
        args.round_5_distance
      ]
    );

    await ctx.runMutation(internal.users.awardUserXP, { username: args.username, earnedXP: newXP });

    // make leaderboard entry
    const leaderboardEntry = await ctx.db.insert("leaderboardEntries", {
      game: args.gameId,
      username: args.username,
      userId: args.userId,
      round_1: args.round_1,
      round_1_distance: args.round_1_distance,
      round_2: args.round_2,
      round_2_distance: args.round_2_distance,
      round_3: args.round_3,
      round_3_distance: args.round_3_distance,
      round_4: args.round_4,
      round_4_distance: args.round_4_distance,
      round_5: args.round_5,
      round_5_distance: args.round_5_distance,
      totalTimeTaken: args.totalTimeTaken,
      xpGained: newXP
    });

    // get game by ID
    const game = await ctx.db.get(args.gameId);

    // add leaderboard entry to game with existing entries
    if (game) {
      await ctx.db.patch(args.gameId, {
        leaderboard: [...(game?.leaderboard ?? []), leaderboardEntry]
      });
    }
    else {
      return null;
    }
        
    return leaderboardEntry;
  }
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
 * Retrieves the image src url based on an id
 * 
 * @param args.id - The ID of the level to retrieve
 * @returns The image src url
 */
export const getImageSrc = query({
  args: { id: v.id("levels") },
  handler: async (ctx, args) => {
    if(!args.id) {
      throw new Error("Missing entryId parameter.");
    }

    const level = await ctx.db.get(args.id);

    if(!level) {
      throw new Error("No levels exist");
    }

    const imageUrl = await ctx.storage.getUrl(level.imageId);

    return imageUrl;
  }
});

export const updateFirstPlayedByClerkId = mutation({
  args: { gameId: v.id("games"), clerkId: v.string() },
  handler: async (ctx, args) => {
    // update only if firstPlayedByClerkId is not set
    const game = await ctx.db.get(args.gameId);

    if(!game) {
      throw new Error("No games exist");
    }

    if(game.firstPlayedByClerkId) {
      return { success: false };
    }

    // update
    const newGame = {
      ...game,
      firstPlayedByClerkId: args.clerkId
    };

    await ctx.db.replace(args.gameId, newGame);

    return { success: true };
  }
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
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMiles = R * c;
  const distanceInFeet = distanceInMiles * 5280; // Convert miles to feet

  return distanceInFeet;
};

/**
 * Checks a user's guess against the correct latitude and longitude of a level
 * 
 * @param args.id - The ID of the level to check against
 * @param args.guessLatitude - The user's guess for the latitude
 * @param args.guessLongitude - The user's guess for the longitude
 * @returns An object containing the correct latitude, correct longitude, distance away, and score
 */
export const checkGuess = mutation({
  args: { id: v.id("levels"), guessLatitude: v.float64(), guessLongitude: v.float64() },
  handler: async(ctx, args) => {
    const level = await ctx.db.get(args.id);

    if(!level) {
      throw new Error("No levels exist");
    }

    const correctLat = level.latitude;
    const correctLng = level.longitude;

    const distanceAway = parseInt(haversineDistanceInFeet(correctLat, correctLng, args.guessLatitude, args.guessLongitude).toFixed(0));
    // give some leniency to the distance
    let lenientDistance = distanceAway - 20;
    if (lenientDistance < 0) {
      lenientDistance = 0;
    }
    // If within 250 feet, score increases by distance if outside of 250 feet score = 0
    let score = 250 - lenientDistance; 
    if (score < 0) { // no negative score
      score = 0;
    }

    console.log("Correct: " + correctLat + " " + correctLng);
    console.log("User Guess: " + args.guessLatitude + " " + args.guessLongitude);

    return {
      correctLat,
      correctLng,
      distanceAway,
      score,
    };
  }
});

/**
 * Updates the timesPlayed field for a level //TODO: Fix this to enable it to work
 * 
 * @param args.id - The ID of the level to update
 * @returns Object indicating success/failure of updating the timesPlayed field
 */
export const updateTimesPlayed = mutation({
  args: { id: v.id("levels") },
  handler: async(ctx, args) => {
    const level = await ctx.db.get(args.id);

    if(!level) {
      throw new Error("No levels exist");
    }

    const timesPlayed = (level.timesPlayed ?? BigInt(0)) + BigInt(1);

    // update level
    const newLevel = {
      ...level,
      timesPlayed
    };

    await ctx.db.replace(args.id, newLevel);

    return { success: true };

  }
});

/**
 * Calculates the total earned experience points (XP) based on the points and distances provided.
 *
 * @param {bigint[]} allPoints - An array of points earned in each game.
 * @param {bigint[]} allDistances - An array of distances for each game.
 * @returns {number} The total earned XP.
 *
 * @remarks
 * - Adds a base score of 10 XP for playing a game.
 * - Add 10 XP if it is the first game of the day.
 * - For every 25 points earned, 1 XP is awarded.
 * - For every "Spot On" game (distance <= 20), an additional 5 XP bonus is awarded.
 * - If every round was "Spot On", the total XP is doubled.
 */
function getTotalEarnedXP(allPoints: bigint[], allDistances: bigint[]): number {
  let earnedXP = 0;
  
  // TODO: Add 10xp if first game of the day
  
  // * Add score for playing a game
  earnedXP += 10;
  
  // * For every 25 points you get 1xp
  let totalPointsEarned = 0;
  for(let i = 0; i < allPoints.length; ++i) {
    totalPointsEarned += Number(allPoints[i]);
  }
  earnedXP += Math.floor(totalPointsEarned / 25);

  // * For every "Spot On" (distance away <= 20) add 5xp bonus
  let numberOfSpotOnGames = 0;
  for(let i = 0; i < allDistances.length; ++i) {
    if(allDistances[i] <= 20) {
      earnedXP += 5;
      numberOfSpotOnGames++;
    }
  }

  // * If every round was spot on, double their score
  if(numberOfSpotOnGames == allPoints.length) {
    earnedXP *= 2;
  }

  return earnedXP;
}