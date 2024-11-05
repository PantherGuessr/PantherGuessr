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

// Gets the image src url based on an id
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