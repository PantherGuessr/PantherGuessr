import { v } from "convex/values";

import { query } from "./_generated/server";

export const getAllLevels = query({
  handler: async (ctx) => {
    const levels = await ctx.db.query("levels").collect();

    return levels;
  }
});

export const getImageSrcByLevelId = query({
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