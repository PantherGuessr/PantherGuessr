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

/**
 * Deletes a level by its ID and the associated image from storage
 * @param args.levelId - The ID of the level to delete
 */
export const deleteLevelById = mutation({
  args: {
    levelId: v.id("levels"),
  },
  handler: async (ctx, args) => {
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

      await ctx.storage.delete(level.imageId);
      await ctx.db.delete(args.levelId);
    }
  },
});