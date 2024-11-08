import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        username: v.string(),
        emails: v.array(v.string()),
        profileTagline: v.id("profileTaglines"),
        profileBackground: v.id("profileBackgrounds"),
        unlockedProfileTaglines: v.array(v.id("profileTaglines")),
        unlockedProfileBackgrounds: v.array(v.id("profileBackgrounds")),
        level: v.int64(),
        currentXP: v.int64(),
        roles: v.optional(v.array(v.string())),
        achievements: v.optional(v.array(v.string())),
        picture: v.string(),
    })
    .index("byClerkId", ["clerkId"])
    .index("byUsername", ["username"])
    .index("byLevel", ["level"]),

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
    
    games: defineTable({
        round_1: v.id("levels"),
        round_2: v.id("levels"),
        round_3: v.id("levels"),
        round_4: v.id("levels"),
        round_5: v.id("levels"),    
        timeAllowedPerRound: v.optional(v.int64()),
        firstPlayedByClerkId: v.optional(v.string()),
        leaderboard: v.optional(v.array(v.id("leaderboardEntries")))
    }),

    weeklyChallenges: defineTable({
        startDate: v.string(),
        endDate: v.string(),
        round_1: v.id("levels"),
        round_2: v.id("levels"),
        round_3: v.id("levels"),
        round_4: v.id("levels"),
        round_5: v.id("levels"),
        timeAllowedPerRound: v.optional(v.int64()),
        firstPlayedByClerkId: v.optional(v.string()),
        leaderboard: v.optional(v.array(v.id("leaderboardEntries")))
    }),

    leaderboardEntries: defineTable({
        game: v.union(v.id("games"), v.id("weeklyChallenges")),
        username: v.string(),
        round_1: v.int64(),
        round_1_distance: v.int64(),
        round_2: v.int64(),
        round_2_distance: v.int64(),
        round_3: v.int64(),
        round_3_distance: v.int64(),
        round_4: v.int64(),
        round_4_distance: v.int64(),
        round_5: v.int64(),
        round_5_distance: v.int64(),
        totalTimeTaken: v.int64(),
    }),

    ongoingGames: defineTable({
        game: v.union(v.id("games"), v.id("weeklyChallenges")),
        userClerkId: v.string(),
        currentRound: v.int64(),
        timeLeftInRound: v.optional(v.int64()),
        totalTimeTaken: v.int64(),
    }),

    profileTaglines: defineTable({
        tagline: v.string()
    }),

    profileBackgrounds: defineTable({
        title: v.string(),
        backgroundCSS: v.string(),
    })
});