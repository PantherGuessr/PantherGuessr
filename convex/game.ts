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

        // Shuffles the levels array
        for(let i = levels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [levels[i], levels[j]] = [levels[j], levels[i]];
        }

        // Select the first numOfLevels levels
        const selectedLevels = levels.slice(0, numOfLevels);

        // Extract and return the Ids of the selected levels
        const levelIds = selectedLevels.map(level => level._id);
        return levelIds;
    }
});

export const getImageSrc = query({
    handler: async (ctx) => {
        const level = await ctx.db.query("levels").first();

        if(!level) {
            throw new Error("No levels exist");
        }

        const imageUrl = await ctx.storage.getUrl(level.imageId);

        return imageUrl;
    }
});