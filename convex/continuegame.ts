import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { format, addDays } from 'date-fns';

/**
 * Creates a new save game entry in the ongoingGames table.
 * This allows users to continue their game progress later.
 * 
 * @param gameId - ID of the game being saved
 * @param userClerkId - Clerk ID of the user saving the game
 * @param currentRound - The current round number (1-5) the user is on
 * @param timeLeftInRound - Optional time remaining in current round in seconds
 * @param totalTimeTaken - Total time taken across all rounds in seconds
 * @returns ID of the newly created save game entry
 */
export const createNewSaveGame = mutation({
  args: {
    gameId: v.id("games"),
    userClerkId: v.string(),
    currentRound: v.int64(),
    timeLeftInRound: v.optional(v.int64()),
    totalTimeTaken: v.int64(),
  },
  handler: async (ctx, args) => {
    const { gameId, userClerkId, currentRound, timeLeftInRound, totalTimeTaken } = args;
    await ctx.db.insert("ongoingGames", {
      game: gameId,
      userClerkId,
      currentRound,
      timeLeftInRound,
      totalTimeTaken,
    });
  }
});

/**
 * Updates an existing ongoing game entry with new progress.
 * Used to save a user's current game state as they play.
 * 
 * @param ongoingGameId - ID of the ongoing game entry to update
 * @param currentRound - The current round number (1-5) the user is on
 * @param timeLeftInRound - Optional time remaining in current round in seconds
 * @param totalTimeTaken - Total time taken across all rounds in seconds
 */
export const updateOngoingGame = mutation({
  args: {
    ongoingGameId: v.id("ongoingGames"),
    currentRound: v.int64(),
    timeLeftInRound: v.optional(v.int64()),
    totalTimeTaken: v.int64(),
  },
  handler: async (ctx, args) => {
    const { ongoingGameId, currentRound, timeLeftInRound, totalTimeTaken } = args;
    await ctx.db.patch(ongoingGameId, {
      currentRound,
      timeLeftInRound,
      totalTimeTaken,
    });
  }
});

/**
 * Gets the most recent ongoing game for a user if one exists.
 * Used to check if a user has a game in progress that they can resume.
 * 
 * @param userClerkId - The Clerk ID of the user to check for ongoing games
 * @returns The most recent ongoing game entry for the user, or null if none exists
 */
export const getOngoingGameFromUser = query({
  args: {
    userClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userClerkId } = args;
    const ongoingGame = await ctx.db.query("ongoingGames").withIndex("byUserClerkId").filter(q => q.eq(q.field("userClerkId"), userClerkId)).first();
    return ongoingGame;
  }
});

/**
 * Deletes an ongoing game entry.
 * Used when a user completes a game to clean up their save data.
 * 
 * @param ongoingGameId - ID of the ongoing game entry to delete
 */
export const deleteOngoingGame = mutation({
  args: {
    ongoingGameId: v.id("ongoingGames"),
  },
  handler: async (ctx, args) => {
    const { ongoingGameId } = args;
    await ctx.db.delete(ongoingGameId);
  }
});

