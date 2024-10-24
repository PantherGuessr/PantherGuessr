import { v } from "convex/values";

import { mutation } from "./_generated/server";

// creates an image upload url
export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

// writes a new level to the database

export const createLevelWithImageStorageId = mutation({
  args: { storageId: v.id("_storage"), description: v.string(), latitude: v.float64(), longitude: v.float64() },
  handler: async (ctx, args) => {
    await ctx.db.insert("levels", {
        imageId: args.storageId,
        title: args.description,
        latitude: args.latitude,
        longitude: args.longitude,
        timesPlayed: BigInt(0)
    });
  },
});