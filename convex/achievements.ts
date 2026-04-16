import { v } from "convex/values";

import { internalMutation, mutation, MutationCtx } from "./_generated/server";
import { getCurrentUser } from "./users";

async function userByUsername(ctx: MutationCtx, username: string) {
  return await ctx.db
    .query("users")
    .withIndex("byUsername", (q) => q.eq("username", username))
    .unique();
}

/**
 * Grants an achievement to a user by their Convex user ID.
 * No-ops if the user already has the achievement.
 */
export const grantAchievement = internalMutation({
  args: {
    userId: v.id("users"),
    achievementId: v.string(),
  },
  handler: async (ctx, { userId, achievementId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return;
    const current = user.achievements ?? [];
    if (current.includes(achievementId)) return;
    await ctx.db.patch(userId, { achievements: [...current, achievementId] });
  },
});

/**
 * Revokes an achievement from a user by their Convex user ID.
 * No-ops if the user does not have the achievement.
 */
export const revokeAchievement = internalMutation({
  args: {
    userId: v.id("users"),
    achievementId: v.string(),
  },
  handler: async (ctx, { userId, achievementId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return;
    await ctx.db.patch(userId, {
      achievements: (user.achievements ?? []).filter((id) => id !== achievementId),
    });
  },
});

/**
 * Admin mutation to grant an achievement to a user by username.
 * Requires the calling user to have the "developer" or "moderator" role.
 */
export const adminGrantAchievement = mutation({
  args: {
    targetUsername: v.string(),
    achievementId: v.string(),
  },
  handler: async (ctx, { targetUsername, achievementId }) => {
    const caller = await getCurrentUser(ctx);
    if (!caller) return;

    const isDev = caller.roles?.includes("developer");
    const isMod = caller.roles?.includes("moderator");
    if (!isDev && !isMod) return;

    const target = await userByUsername(ctx, targetUsername);
    if (!target) return;

    const current = target.achievements ?? [];
    if (current.includes(achievementId)) return;
    await ctx.db.patch(target._id, { achievements: [...current, achievementId] });
  },
});

/**
 * Admin mutation to revoke an achievement from a user by username.
 * Requires the calling user to have the "developer" or "moderator" role.
 */
export const adminRevokeAchievement = mutation({
  args: {
    targetUsername: v.string(),
    achievementId: v.string(),
  },
  handler: async (ctx, { targetUsername, achievementId }) => {
    const caller = await getCurrentUser(ctx);
    if (!caller) return;

    const isDev = caller.roles?.includes("developer");
    const isMod = caller.roles?.includes("moderator");
    if (!isDev && !isMod) return;

    const target = await userByUsername(ctx, targetUsername);
    if (!target) return;

    await ctx.db.patch(target._id, {
      achievements: (target.achievements ?? []).filter((id) => id !== achievementId),
    });
  },
});
