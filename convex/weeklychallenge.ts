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
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .first();
    return weeklyChallenge;
  },
});

export const getPopulatedWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.getTime();
    const weeklyChallenge = await ctx.db
      .query("weeklyChallenges")
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
 * Creates a new weekly challenge by selecting 5 random levels from the levels table
 * @returns The mutation promise of the new weekly challenge
 */
export const makeWeeklyChallenge = internalMutation({
  handler: async (ctx) => {
    const today = new Date().getTime();
    const endDate = new Date(today + 7 * 24 * 60 * 60 * 1000).getTime();
    const levels = await ctx.db.query("levels").collect();
    const randomLevels = [];
    const randomIndices: number[] = [];

    // fiunction to get random levels
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * levels.length);
      if (randomIndices.includes(randomIndex)) {
        i--;
        continue;
      }
      randomIndices.push(randomIndex);
      randomLevels.push(levels[randomIndex]._id);
    }

    // makes a new game with weekly challenge parameter set
    const gameId = await ctx.db.insert("games", {
      round_1: randomLevels[0],
      round_2: randomLevels[1],
      round_3: randomLevels[2],
      round_4: randomLevels[3],
      round_5: randomLevels[4],
      timeAllowedPerRound: BigInt(60),
      isWeekly: true
    });

    await ctx.db.insert("weeklyChallenges", {
      startDate: BigInt(today),
      endDate: BigInt(endDate),
      gameId: gameId,
    });
  },
});

/**
 * Creates a new weekly challenge if one does not already exist, ending on the upcoming Monday.
 * @returns The mutation promise of the new weekly challenge, or null if one already exists
 */
export const makeWeeklyChallengeIfNonexistent = mutation({
  handler: async (ctx) => {
    // Check if a weekly challenge already exists that hasn't ended
    const now = new Date();
    const today = now.getTime();
    const existingChallenge = await ctx.db
      .query("weeklyChallenges")
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .first();
    if (existingChallenge) {
      return null;
    }

    // Calculate upcoming Monday
    const dayOfWeek = now.getUTCDay(); // Sunday = 0, Monday = 1, etc
    const daysUntilMonday = (8 - dayOfWeek) % 7 || 7; // If today is Monday, set to next Monday
    const nextMonday = new Date(now);
    nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
    nextMonday.setUTCHours(17, 0, 0, 0); // 17:00 UTC (9am PST)
    const endDate = nextMonday.getTime();

    // selects 5 random levels
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

    // creates weekly challenge game
    const gameId = await ctx.db.insert("games", {
      round_1: randomLevels[0],
      round_2: randomLevels[1],
      round_3: randomLevels[2],
      round_4: randomLevels[3],
      round_5: randomLevels[4],
      timeAllowedPerRound: BigInt(60),
      isWeekly: true
    });

    // creates weekly challenge entry
    await ctx.db.insert("weeklyChallenges", {
      startDate: BigInt(today),
      endDate: BigInt(endDate),
      gameId: gameId,
    });
  },
});
