import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

/**
 * Retrieves all levels from the database
 * @returns An array containing all level documents from the database
 */
export const getAllLevels = query({
  handler: async (ctx) => {
    // get levels and sort from newest to oldest
    const levels = await ctx.db.query("levels").collect();
    levels.sort((a, b) => (a._creationTime > b._creationTime ? -1 : 1));

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

/**
 * Retrieves all ban appeals with enriched user and moderator info.
 * Sorted: unresolved first, then by creation time descending.
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const getBanAppeals = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const callerUser = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!callerUser?.roles?.includes("developer") && !callerUser?.roles?.includes("moderator")) {
      return null;
    }

    const appeals = await ctx.db.query("banAppeals").collect();

    const result = await Promise.all(
      appeals.map(async (appeal) => {
        const [user, moderator] = await Promise.all([
          ctx.db.get(appeal.user),
          appeal.moderator ? ctx.db.get(appeal.moderator) : null,
        ]);
        return {
          ...appeal,
          username: user?.username ?? null,
          userPicture: user?.picture ?? null,
          isBanned: user?.isBanned ?? false,
          moderatorUsername: moderator?.username ?? null,
        };
      })
    );

    result.sort((a, b) => {
      if (a.hasBeenResolved !== b.hasBeenResolved) return a.hasBeenResolved ? 1 : -1;
      return b._creationTime - a._creationTime;
    });

    return result;
  },
});

/**
 * Retrieves all user reports with enriched reporter, reported user, and moderator info.
 * Sorted: unresolved first, then by creation time descending.
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const getUserReports = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const callerUser = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!callerUser?.roles?.includes("developer") && !callerUser?.roles?.includes("moderator")) {
      return null;
    }

    const reports = await ctx.db.query("userReports").collect();

    const result = await Promise.all(
      reports.map(async (report) => {
        const [reportedUser, reporter, moderator] = await Promise.all([
          ctx.db.get(report.reportedUser),
          ctx.db.get(report.reporter),
          report.moderator ? ctx.db.get(report.moderator) : null,
        ]);
        return {
          ...report,
          reportedUsername: reportedUser?.username ?? null,
          reportedUserPicture: reportedUser?.picture ?? null,
          reporterUsername: reporter?.username ?? null,
          moderatorUsername: moderator?.username ?? null,
        };
      })
    );

    result.sort((a, b) => {
      if (a.hasBeenResolved !== b.hasBeenResolved) return a.hasBeenResolved ? 1 : -1;
      return b._creationTime - a._creationTime;
    });

    return result;
  },
});

/**
 * Marks a ban appeal as resolved with an optional moderator note.
 * If approve is true, the user is unbanned (banAppeal reference is kept for history).
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const resolveBanAppeal = mutation({
  args: {
    appealId: v.id("banAppeals"),
    approve: v.boolean(),
    moderatorMessage: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const callerUser = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!callerUser?.roles?.includes("developer") && !callerUser?.roles?.includes("moderator")) {
      throw new Error("Insufficient permissions");
    }

    const appeal = await ctx.db.get(args.appealId);
    if (!appeal) throw new Error("Appeal not found");

    await ctx.db.patch(args.appealId, {
      hasBeenResolved: true,
      moderator: callerUser._id,
      moderatorMessage: args.moderatorMessage,
    });

    if (args.approve) {
      const user = await ctx.db.get(appeal.user);
      if (!user) throw new Error("User no longer exists");
      await ctx.db.patch(user._id, {
        isBanned: false,
        banReason: undefined,
        // banAppeal reference kept intentionally for history tracking
      });
    }
  },
});

/**
 * Marks a user report as resolved with an optional moderator note.
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const resolveUserReport = mutation({
  args: {
    reportId: v.id("userReports"),
    moderatorMessage: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const callerUser = await ctx.db
      .query("users")
      .withIndex("byClerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!callerUser?.roles?.includes("developer") && !callerUser?.roles?.includes("moderator")) {
      throw new Error("Insufficient permissions");
    }

    await ctx.db.patch(args.reportId, {
      hasBeenResolved: true,
      moderator: callerUser._id,
      moderatorMessage: args.moderatorMessage,
    });
  },
});
