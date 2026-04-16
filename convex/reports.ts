import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

/**
 * Submits a report for a level. Can be called by any authenticated user.
 */
export const submitLevelReport = mutation({
  args: {
    levelId: v.id("levels"),
    reason: v.union(
      v.literal("not_university_property"),
      v.literal("pin_incorrectly_placed"),
      v.literal("wrong_image"),
      v.literal("outdated_image")
    ),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    await ctx.db.insert("levelReports", {
      levelId: args.levelId,
      reason: args.reason,
      reportedByClerkId: identity?.subject,
      status: "pending",
    });
  },
});

/**
 * Retrieves all level reports with enriched level info.
 * Sorted: pending first, then by creation time descending.
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const getLevelReports = query({
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

    const reports = await ctx.db.query("levelReports").collect();

    const result = await Promise.all(
      reports.map(async (report) => {
        const level = await ctx.db.get(report.levelId);
        return {
          ...report,
          levelTitle: level?.title ?? "Unknown Level",
        };
      })
    );

    result.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return b._creationTime - a._creationTime;
    });

    return result;
  },
});

/**
 * Marks a level report as resolved.
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const resolveLevelReport = mutation({
  args: { reportId: v.id("levelReports") },
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

    await ctx.db.patch(args.reportId, { status: "resolved" });
  },
});

/**
 * Marks a level report as dismissed.
 * Only accessible to users with the "developer" or "moderator" role.
 */
export const dismissLevelReport = mutation({
  args: { reportId: v.id("levelReports") },
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

    await ctx.db.patch(args.reportId, { status: "dismissed" });
  },
});
