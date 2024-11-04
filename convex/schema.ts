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

    /* // TODO: create a games schema to store unique game data
    Needs to include the following:
    - Round 1 LevelID
    - Round 2 LevelID
    - Round 3 LevelID
    - Round 4 LevelID
    - Round 5 LevelID
    - Time allowed per round, int64
    - First played by, user clerk ID
    - [] of leaderboard entries
    */

    weeklyChallenges: defineTable({
        startDate: v.string(),
        endDate: v.string(),
        round_1: v.id("levels"),
        round_2: v.id("levels"),
        round_3: v.id("levels"),
        round_4: v.id("levels"),
        round_5: v.id("levels")
        //TODO: Add a leaderboard entries array for weekly challenge leaderboards
    }),

    /* //TODO: Add a leaderboard entries schema to store leaderboard entries for all game types
    Needs to include the following:
    - union of games schema entries or weeklyChallenges schema entries
    - user clerk ID
    - round 1 score
    - round 2 score
    - round 3 score
    - round 4 score
    - round 5 score
    - total time taken
    */

    /* //TODO: Add a ongoing games schema to store any ongoing games
    Needs to include the following:
    - union of games schema entries or weeklyChallenges schema entries
    - user clerk ID
    - current round
    - total time taken so far in game
    - time left in current round (defaults to 5 seconds if not saved in time)

    */

    profileTaglines: defineTable({
        tagline: v.string()
    }),

    profileBackgrounds: defineTable({
        title: v.string(),
        backgroundCSS: v.string(),
    })
});