import { v } from "convex/values";
import { query } from "./_generated/server";

export type LeaderboardType = "streak" | "level" | "totalPoints";

/**
 * Gets the top 25 users by current streak.
 * Tiebreakers: level, then currentXP
 */
export const getTopUsersByStreak = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isBanned"), false))
      .order("desc")
      .collect();

    // Sort by current streak, then by level, then by currentXP as tiebreakers
    const sortedUsers = users
      .sort((a, b) => {
        if (a.currentStreak !== b.currentStreak) {
          return Number(b.currentStreak - a.currentStreak);
        }
        if (a.level !== b.level) {
          return Number(b.level - a.level);
        }
        return Number(b.currentXP - a.currentXP);
      })
      .slice(0, 25);

    return sortedUsers;
  },
});

/**
 * Get the top 25 users by level and XP.
 * Tiebreakers: currentXP, then currentStreak
 */
export const getTopUsersByLevel = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isBanned"), false))
      .order("desc")
      .collect();

    // Sort by level, then by currentXP, then by currentStreak as tiebreakers
    const sortedUsers = users
      .sort((a, b) => {
        if (a.level !== b.level) {
          return Number(b.level - a.level);
        }
        if (a.currentXP !== b.currentXP) {
          return Number(b.currentXP - a.currentXP);
        }
        return Number(b.currentStreak - a.currentStreak);
      })
      .slice(0, 25);

    return sortedUsers;
  },
});

/**
 * Get the top 25 users by total points earned.
 * Tiebreakers: level, then currentXP
 */
export const getTopUsersByTotalPoints = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isBanned"), false))
      .order("desc")
      .collect();

    // Sort by total points earned, then by level, then by currentXP as tiebreakers
    const sortedUsers = users
      .sort((a, b) => {
        const aPoints = a.totalPointsEarned ?? 0n;
        const bPoints = b.totalPointsEarned ?? 0n;
        if (aPoints !== bPoints) {
          return Number(bPoints - aPoints);
        }
        if (a.level !== b.level) {
          return Number(b.level - a.level);
        }
        return Number(b.currentXP - a.currentXP);
      })
      .slice(0, 25);

    return sortedUsers;
  },
});

/**
 * Get user rank by a specific leaderboard type.
 */
export const getUserRank = query({
  args: {
    clerkId: v.string(),
    type: v.union(v.literal("streak"), v.literal("level"), v.literal("totalPoints")),
  },
  handler: async (ctx, { clerkId, type }) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isBanned"), false))
      .order("desc")
      .collect();

    let sortedUsers;
    
    if (type === "streak") {
      // Sort by current streak, then by level, then by currentXP as tiebreakers
      sortedUsers = users.sort((a, b) => {
        if (a.currentStreak !== b.currentStreak) {
          return Number(b.currentStreak - a.currentStreak);
        }
        if (a.level !== b.level) {
          return Number(b.level - a.level);
        }
        return Number(b.currentXP - a.currentXP);
      });
    } else if (type === "level") {
      // Sort by level, then by currentXP, then by currentStreak as tiebreakers
      sortedUsers = users.sort((a, b) => {
        if (a.level !== b.level) {
          return Number(b.level - a.level);
        }
        if (a.currentXP !== b.currentXP) {
          return Number(b.currentXP - a.currentXP);
        }
        return Number(b.currentStreak - a.currentStreak);
      });
    } else {
      // Sort by total points earned, then by level, then by currentXP as tiebreakers
      sortedUsers = users.sort((a, b) => {
        const aPoints = a.totalPointsEarned ?? 0n;
        const bPoints = b.totalPointsEarned ?? 0n;
        if (aPoints !== bPoints) {
          return Number(bPoints - aPoints);
        }
        if (a.level !== b.level) {
          return Number(b.level - a.level);
        }
        return Number(b.currentXP - a.currentXP);
      });
    }

    const userIndex = sortedUsers.findIndex(user => user.clerkId === clerkId);
    return userIndex >= 0 ? userIndex + 1 : -1;
  },
});
