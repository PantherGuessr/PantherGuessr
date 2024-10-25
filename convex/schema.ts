import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        username: v.string(),
        emails: v.array(v.string()),
        roles: v.optional(v.array(v.string())),
        picture: v.string(),
    }).index("byClerkId", ["clerkId"]),

    levels: defineTable({
        title: v.string(),
        latitude: v.float64(),
        longitude: v.float64(),
        imageId: v.id("_storage"),
        timesPlayed: v.int64(),
        authorUsername: v.optional(v.string())
    }),

    gameStats: defineTable({
        type: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
        isoTime: v.string(),
        isoDay: v.string(),
        isoYearMonth: v.string(),
        count: v.int64(),
        lastUpdated: v.string()
    }),

    weeklyChallenges: defineTable({
        startDate: v.string(),
        endDate: v.string(),
        round_1: v.id("levels"),
        round_2: v.id("levels"),
        round_3: v.id("levels"),
        round_4: v.id("levels"),
        round_5: v.id("levels")
    })
});