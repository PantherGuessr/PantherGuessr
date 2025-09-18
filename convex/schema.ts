import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    emails: v.array(v.string()),
    level: v.int64(),
    currentXP: v.int64(),
    currentStreak: v.int64(),
    totalPointsEarned: v.optional(v.int64()),
    lastPlayedTimestamp: v.optional(v.number()),
    roles: v.optional(v.array(v.string())),
    isBanned: v.boolean(),
    banReason: v.optional(v.string()),
    banAppeal: v.optional(v.id("banAppeals")),
    achievements: v.optional(v.array(v.id("achievements"))),
    picture: v.string(),
    profileTagline: v.id("profileTaglines"),
    profileBackground: v.id("profileBackgrounds"),
    unlockedProfileTaglines: v.array(v.id("profileTaglines")),
    unlockedProfileBackgrounds: v.array(v.id("profileBackgrounds")),
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
    authorUsername: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }),

  gameStats: defineTable({
    type: v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly")),
    isoTime: v.string(),
    isoDay: v.string(),
    isoYearMonth: v.string(),
    count: v.int64(),
    lastUpdated: v.string(),
  }),

  games: defineTable({
    round_1: v.id("levels"),
    round_2: v.id("levels"),
    round_3: v.id("levels"),
    round_4: v.id("levels"),
    round_5: v.id("levels"),
    timeAllowedPerRound: v.optional(v.int64()),
    firstPlayedByClerkId: v.optional(v.string()),
    leaderboard: v.optional(v.array(v.id("leaderboardEntries"))),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
  }),

  weeklyChallenges: defineTable({
    startDate: v.int64(),
    endDate: v.int64(),
    gameId: v.id("games"),
    firstPlayedByClerkId: v.optional(v.string()),
    leaderboard: v.optional(v.array(v.id("leaderboardEntries"))),
  }),

  leaderboardEntries: defineTable({
    game: v.union(v.id("games"), v.id("weeklyChallenges")),
    oldLevel: v.int64(),
    newLevel: v.int64(),
    userId: v.id("users"),
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
    xpGained: v.number(),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
  }).index("byUserId", ["userId"]),

  ongoingGames: defineTable({
    game: v.id("games"),
    userClerkId: v.string(),
    currentRound: v.int64(),
    timeLeftInRound: v.optional(v.int64()),
    totalTimeTaken: v.int64(),
    scores: v.optional(v.array(v.int64())),
    distances: v.optional(v.array(v.int64())),
    gameType: v.union(v.literal("weekly"), v.literal("singleplayer"), v.literal("multiplayer")),
  })
    .index("byUserClerkIdGame", ["userClerkId", "game"])
    .index("byUserClerkId", ["userClerkId"])
    .index("byGame", ["game"]),

  profileTaglines: defineTable({
    tagline: v.string(),
  }),

  profileBackgrounds: defineTable({
    title: v.string(),
    backgroundCSS: v.string(),
  }),

  achievements: defineTable({
    name: v.string(),
    description: v.string(),
    isEnabled: v.boolean(),
    canUnlock: v.boolean(),
  }).index("byName", ["name"]),

  userReports: defineTable({
    reportedUser: v.id("users"),
    reporter: v.id("users"),
    reportReason: v.string(),
    reporterMessage: v.optional(v.string()),
    hasBeenResolved: v.boolean(),
    moderator: v.optional(v.id("users")),
    moderatorMessage: v.optional(v.string()),
  }),

  banAppeals: defineTable({
    user: v.id("users"),
    banReason: v.optional(v.string()),
    appealMessage: v.string(),
    hasBeenResolved: v.boolean(),
    moderator: v.optional(v.id("users")),
    moderatorMessage: v.optional(v.string()),
  }),
});
