import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

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
        userClerkId: v.string(),
        round_1: v.int64(),
        round_2: v.int64(),
        round_3: v.int64(),
        round_4: v.int64(),
        round_5: v.int64(),
        totalTimeTaken: v.int64()
    },
    handler: async (ctx, args) => {
        // make leaderboard entry
        const leaderboardEntry = await ctx.db.insert("leaderboardEntries", {
            game: args.gameId,
            userClerkId: args.userClerkId,
            round_1: args.round_1,
            round_2: args.round_2,
            round_3: args.round_3,
            round_4: args.round_4,
            round_5: args.round_5,
            totalTimeTaken: args.totalTimeTaken
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
            return { success: false };
        }
        
        return { success: true };
    }
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
        }
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
        }

        await ctx.db.replace(args.id, newLevel);

        return { success: true };

    }
});