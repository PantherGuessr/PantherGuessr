import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Gets the number of random Levels from the database
export const getRandomLevels = query({
    handler: async (ctx) => {
        // TODO: Implement a way to choose number of levels based on backend settings
        const numOfLevels = 5;
        const levels = await ctx.db.query("levels").collect();

        if(levels.length < numOfLevels) {
            throw new Error("Not enough levels to complete request!");
        }

        console.log(levels);

        const selectedLevels = [];

        for(let i = 0; i < numOfLevels; i++) {
            const randomIndex = Math.floor(Math.random() * levels.length);
            selectedLevels[i] = levels[randomIndex];
            levels.splice(randomIndex, 1);
        }

        // Extract and return the Ids of the selected levels
        const levelIds = selectedLevels.map(level => level._id);
        console.log("[SERVER SIDE] Ids", levelIds);
        return levelIds;
    }
});

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