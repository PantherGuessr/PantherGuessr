import { v } from "convex/values";

import { mutation } from "./_generated/server";

/**
 * Generates an upload URL for a new image
 * @returns The URL of the image storage
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

/**
 * Creates a new level with an image storage ID
 * @param args.storageId - The ID of the image storage
 * @param args.description - The description of the level
 * @param args.latitude - The latitude of the level
 * @param args.longitude - The longitude of the level
 * @param args.authorUsername - The username of the author
 */
export const createLevelWithImageStorageId = mutation({
  args: {
    storageId: v.id("_storage"),
    description: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    authorUsername: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("levels", {
      imageId: args.storageId,
      title: args.description,
      latitude: args.latitude,
      longitude: args.longitude,
      timesPlayed: BigInt(0),
      authorUsername: args.authorUsername,
      tags: args.tags,
    });
  },
});
