import { v } from "convex/values";

import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

async function getCallerUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const callerUser = await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();

  return { identity, callerUser };
}

function hasLevelCreationPermission(callerUser: { roles?: string[] } | null) {
  return !!(callerUser?.roles?.includes("developer") || callerUser?.roles?.includes("moderator"));
}

function hasDeferredImagePermission(callerUser: { roles?: string[] } | null) {
  return !!callerUser?.roles?.includes("developer");
}

async function requireLevelCreationPermission(ctx: QueryCtx | MutationCtx) {
  const { identity, callerUser } = await getCallerUser(ctx);
  if (!hasLevelCreationPermission(callerUser)) {
    throw new Error("Insufficient permissions");
  }
  return { identity, callerUser };
}

async function requireDeferredImagePermission(ctx: QueryCtx | MutationCtx) {
  const { identity, callerUser } = await getCallerUser(ctx);
  if (!hasDeferredImagePermission(callerUser)) {
    throw new Error("Insufficient permissions");
  }
  return { identity, callerUser };
}

/**
 * Generates an upload URL for a new image
 * @returns The URL of the image storage
 */
export const generateUploadUrl = mutation(async (ctx) => {
  await requireLevelCreationPermission(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const generateDeferredLevelImageUploadUrl = mutation(async (ctx) => {
  await requireDeferredImagePermission(ctx);

  return await ctx.storage.generateUploadUrl();
});

export const createDeferredLevelImageDrafts = mutation({
  args: {
    storageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    if (args.storageIds.length === 0) {
      throw new Error("No images were uploaded");
    }
    if (args.storageIds.length > 20) {
      throw new Error("You can defer up to 20 images at a time");
    }

    const { identity, callerUser } = await requireDeferredImagePermission(ctx);

    for (const storageId of args.storageIds) {
      await ctx.db.insert("deferredLevelImages", {
        imageId: storageId,
        uploadedByClerkId: identity.subject,
        uploadedByUsername: callerUser?.username,
      });
    }
  },
});

export const getDeferredLevelImageDrafts = query({
  args: {},
  handler: async (ctx) => {
    await requireDeferredImagePermission(ctx);

    const drafts = await ctx.db.query("deferredLevelImages").collect();
    drafts.sort((a, b) => (a._creationTime > b._creationTime ? -1 : 1));
    return drafts;
  },
});

export const getDeferredLevelImageDraftSrc = query({
  args: {
    draftId: v.id("deferredLevelImages"),
  },
  handler: async (ctx, args) => {
    await requireDeferredImagePermission(ctx);

    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Deferred image not found");

    return await ctx.storage.getUrl(draft.imageId);
  },
});

export const completeDeferredLevelImageDraft = mutation({
  args: {
    draftId: v.id("deferredLevelImages"),
    description: v.string(),
    latitude: v.float64(),
    longitude: v.float64(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { callerUser } = await requireDeferredImagePermission(ctx);

    const draft = await ctx.db.get(args.draftId);
    if (!draft) throw new Error("Deferred image not found");

    await ctx.db.insert("levels", {
      imageId: draft.imageId,
      title: args.description,
      latitude: args.latitude,
      longitude: args.longitude,
      timesPlayed: BigInt(0),
      authorUsername: callerUser?.username ?? draft.uploadedByUsername,
      tags: args.tags,
    });

    await ctx.db.delete(args.draftId);
  },
});

export const deleteDeferredLevelImageDraft = mutation({
  args: {
    draftId: v.id("deferredLevelImages"),
  },
  handler: async (ctx, args) => {
    await requireDeferredImagePermission(ctx);

    const draft = await ctx.db.get(args.draftId);
    if (!draft) return;

    await ctx.storage.delete(draft.imageId);
    await ctx.db.delete(args.draftId);
  },
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
    await requireLevelCreationPermission(ctx);

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

/**
 * Updates a level's image and/or coordinates. Deletes the old image from storage when replacing.
 */
export const updateLevel = mutation({
  args: {
    levelId: v.id("levels"),
    newImageId: v.optional(v.id("_storage")),
    latitude: v.optional(v.float64()),
    longitude: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    await requireLevelCreationPermission(ctx);

    const level = await ctx.db.get(args.levelId);
    if (!level) throw new Error("Level not found");

    const updates: { imageId?: typeof level.imageId; latitude?: number; longitude?: number } = {};

    if (args.newImageId !== undefined) {
      await ctx.storage.delete(level.imageId);
      updates.imageId = args.newImageId;
    }
    if (args.latitude !== undefined) updates.latitude = args.latitude;
    if (args.longitude !== undefined) updates.longitude = args.longitude;

    await ctx.db.patch(args.levelId, updates);
  },
});

/**
 * Deletes a level by its ID and the associated image from storage
 * @param args.levelId - The ID of the level to delete
 */
export const deleteLevelById = mutation({
  args: {
    levelId: v.id("levels"),
  },
  handler: async (ctx, args) => {
    await requireLevelCreationPermission(ctx);

    const level = await ctx.db.get(args.levelId);
    if (level) {
      // Find all games that contain this level and delete them too
      const allGames = await ctx.db.query("games").collect();
      const gamesToDelete = allGames.filter(game =>
        game.round_1 === args.levelId ||
        game.round_2 === args.levelId ||
        game.round_3 === args.levelId ||
        game.round_4 === args.levelId ||
        game.round_5 === args.levelId
      );
      for (const game of gamesToDelete) {
        // Find weekly challenges that use this game
        const allWeeklyChallenges = await ctx.db.query("weeklyChallenges").collect();
        const weeklyChallengesToDelete = allWeeklyChallenges.filter(wc => wc.gameId === game._id);
        for (const wc of weeklyChallengesToDelete) {
          // Delete leaderboard entries for this weekly challenge
          const leaderboardEntriesForWC = await ctx.db.query("leaderboardEntries").collect();
          const entriesToDeleteWC = leaderboardEntriesForWC.filter(entry => entry.game === wc._id);
          for (const entry of entriesToDeleteWC) {
            await ctx.db.delete(entry._id);
          }
          await ctx.db.delete(wc._id);
        }

        // Delete leaderboard entries for this game
        const allLeaderboardEntries = await ctx.db.query("leaderboardEntries").collect();
        const entriesToDeleteGame = allLeaderboardEntries.filter(entry => entry.game === game._id);
        for (const entry of entriesToDeleteGame) {
          await ctx.db.delete(entry._id);
        }

        // Delete ongoing games for this game
        const allOngoingGames = await ctx.db.query("ongoingGames").collect();
        const ongoingToDelete = allOngoingGames.filter(og => og.game === game._id);
        for (const og of ongoingToDelete) {
          await ctx.db.delete(og._id);
        }

        await ctx.db.delete(game._id);
      }

      // delete the level and image in storage
      await ctx.storage.delete(level.imageId);
      await ctx.db.delete(args.levelId);
    }
  },
});
