import { v } from "convex/values";

import { query } from "./_generated/server";

/**
 * Retrieves all levels from the database
 * @returns An array containing all level documents from the database
 */
export const getAllLevels = query({
  handler: async (ctx) => {
    const levels = await ctx.db.query("levels").collect();

    return levels;
  },
});

/**
 * Retrieves the image URL for a specific level from storage
 * @param args.id - The ID of the level to get the image for
 * @returns The URL of the image stored for this level
 * @throws Error if level ID is missing or level does not exist
 */
export const getImageSrcByLevelId = query({
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
