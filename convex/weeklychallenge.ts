import { getNextWeeklyResetTimestamp } from "../lib/weeklytimes";
import { internalMutation, mutation, query } from "./_generated/server";

/**
 * Retrieves the weekly challenge that is currently active
 * @returns The weekly challenge that is currently active
 */
export const getWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.getTime();
    const weeklyChallenge = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", true))
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .first();
    return weeklyChallenge;
  },
});

/**
 * Retrieves the upcoming weekly challenge (next week's challenge)
 * @returns The upcoming weekly challenge
 */
export const getUpcomingWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.getTime();
    const upcomingChallenge = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", false))
      .filter((q) => q.gt(q.field("startDate"), BigInt(today)))
      .order("asc")
      .first();
    return upcomingChallenge;
  },
});

export const getPopulatedWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.getTime();
    const weeklyChallenge = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", true))
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .first();

    if (!weeklyChallenge) {
      return null;
    }

    const game = await ctx.db.get(weeklyChallenge.gameId);
    if (!game) {
      return null;
    }

    const round1 = await ctx.db.get(game.round_1);
    const round2 = await ctx.db.get(game.round_2);
    const round3 = await ctx.db.get(game.round_3);
    const round4 = await ctx.db.get(game.round_4);
    const round5 = await ctx.db.get(game.round_5);

    return {
      ...weeklyChallenge,
      game: {
        ...game,
        round_1: round1,
        round_2: round2,
        round_3: round3,
        round_4: round4,
        round_5: round5,
      },
    };
  },
});

/**
 * Retrieves the populated upcoming weekly challenge
 * @returns The populated upcoming weekly challenge
 */
export const getPopulatedUpcomingWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.getTime();
    const weeklyChallenge = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", false))
      .filter((q) => q.gt(q.field("startDate"), BigInt(today)))
      .order("asc")
      .first();

    if (!weeklyChallenge) {
      return null;
    }

    const game = await ctx.db.get(weeklyChallenge.gameId);
    if (!game) {
      return null;
    }

    const round1 = await ctx.db.get(game.round_1);
    const round2 = await ctx.db.get(game.round_2);
    const round3 = await ctx.db.get(game.round_3);
    const round4 = await ctx.db.get(game.round_4);
    const round5 = await ctx.db.get(game.round_5);

    return {
      ...weeklyChallenge,
      game: {
        ...game,
        round_1: round1,
        round_2: round2,
        round_3: round3,
        round_4: round4,
        round_5: round5,
      },
    };
  },
});

/**
 * Creates a new weekly challenge by selecting 5 random levels from the levels table.
 * This runs on a cron job and:
 * 1. Activates any upcoming challenges whose start date has passed
 * 2. Creates a new upcoming challenge for next week if one doesn't exist
 */
export const createWeeklyChallenge = internalMutation({
  handler: async (ctx) => {
    const now = new Date();
    const today = now.getTime();
    
    // Step 1: Activate any upcoming challenges whose start date has passed
    const challengesToActivate = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", false))
      .filter((q) => q.lte(q.field("startDate"), BigInt(today)))
      .collect();
    
    for (const challenge of challengesToActivate) {
      await ctx.db.patch(challenge._id, { isActive: true });
    }
    
    // Step 2: Check if there's already an upcoming challenge
    const existingUpcoming = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", false))
      .filter((q) => q.gt(q.field("startDate"), BigInt(today)))
      .first();
    
    if (existingUpcoming) {
      return; // Already have an upcoming challenge
    }
    
    // Step 3: Create a new upcoming challenge for next week
    const nextResetDate = getNextWeeklyResetTimestamp(now);
    const weekAfterNextResetDate = getNextWeeklyResetTimestamp(new Date(nextResetDate));
    
    const levels = await ctx.db.query("levels").collect();
    const randomLevels = [];
    const randomIndices: number[] = [];
    
    // Select 5 random unique levels
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * levels.length);
      if (randomIndices.includes(randomIndex)) {
        i--;
        continue;
      }
      randomIndices.push(randomIndex);
      randomLevels.push(levels[randomIndex]._id);
    }
    
    // Create the game for the upcoming challenge
    const gameId = await ctx.db.insert("games", {
      round_1: randomLevels[0],
      round_2: randomLevels[1],
      round_3: randomLevels[2],
      round_4: randomLevels[3],
      round_5: randomLevels[4],
      timeAllowedPerRound: BigInt(60),
      gameType: "weekly",
    });
    
    // Create the upcoming weekly challenge (inactive until its start date)
    await ctx.db.insert("weeklyChallenges", {
      startDate: BigInt(nextResetDate),
      endDate: BigInt(weekAfterNextResetDate),
      gameId: gameId,
      isActive: false,
    });
  },
});

/**
 * Creates weekly challenges if they don't exist:
 * - An active challenge for this week
 * - An upcoming challenge for next week
 * @returns The mutation promise of the new weekly challenge, or null if challenges already exist
 */
export const makeWeeklyChallengeIfNonexistent = mutation({
  handler: async (ctx) => {
    const now = new Date();
    const today = now.getTime();
    
    // Check if there's an active weekly challenge
    const existingActive = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", true))
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .first();
    
    // Create active challenge if it doesn't exist
    if (!existingActive) {
      const endDate = getNextWeeklyResetTimestamp(now);
      const levels = await ctx.db.query("levels").collect();
      const randomLevels = [];
      const randomIndices: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * levels.length);
        if (randomIndices.includes(randomIndex)) {
          i--;
          continue;
        }
        randomIndices.push(randomIndex);
        randomLevels.push(levels[randomIndex]._id);
      }
      
      const gameId = await ctx.db.insert("games", {
        round_1: randomLevels[0],
        round_2: randomLevels[1],
        round_3: randomLevels[2],
        round_4: randomLevels[3],
        round_5: randomLevels[4],
        timeAllowedPerRound: BigInt(60),
        gameType: "weekly",
      });
      
      await ctx.db.insert("weeklyChallenges", {
        startDate: BigInt(today),
        endDate: BigInt(endDate),
        gameId: gameId,
        isActive: true,
      });
    }
    
    // Check if there's an upcoming weekly challenge
    const existingUpcoming = await ctx.db
      .query("weeklyChallenges")
      .withIndex("byIsActive", (q) => q.eq("isActive", false))
      .filter((q) => q.gt(q.field("startDate"), BigInt(today)))
      .first();
    
    // Create upcoming challenge if it doesn't exist
    if (!existingUpcoming) {
      const nextResetDate = getNextWeeklyResetTimestamp(now);
      const weekAfterNextResetDate = getNextWeeklyResetTimestamp(new Date(nextResetDate));
      const levels = await ctx.db.query("levels").collect();
      const randomLevels = [];
      const randomIndices: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * levels.length);
        if (randomIndices.includes(randomIndex)) {
          i--;
          continue;
        }
        randomIndices.push(randomIndex);
        randomLevels.push(levels[randomIndex]._id);
      }
      
      const gameId = await ctx.db.insert("games", {
        round_1: randomLevels[0],
        round_2: randomLevels[1],
        round_3: randomLevels[2],
        round_4: randomLevels[3],
        round_5: randomLevels[4],
        timeAllowedPerRound: BigInt(60),
        gameType: "weekly",
      });
      
      await ctx.db.insert("weeklyChallenges", {
        startDate: BigInt(nextResetDate),
        endDate: BigInt(weekAfterNextResetDate),
        gameId: gameId,
        isActive: false,
      });
    }
  },
});
