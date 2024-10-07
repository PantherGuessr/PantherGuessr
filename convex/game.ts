import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const get = query({
    handler: async (ctx) => {
        const levels = await ctx.db.query("levels").first();

        return levels;
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