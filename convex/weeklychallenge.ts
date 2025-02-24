import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

/**
 * Retrieves the weekly challenge that is currently active
 * @returns The weekly challenge that is currently active
 */
export const getWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.getTime();
    const weeklyChallenges = await ctx.db
      .query("weeklyChallenges")
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .collect();

    return weeklyChallenges;
  },
});

/**
 * Creates a new weekly challenge by selecting 5 random levels from the levels table
 * @returns The mutation promise of the new weekly challenge
 */
export const makeWeeklyChallenge = mutation({
  handler: async (ctx) => {
    const today = new Date().getTime();
    const endDate = new Date(today + 6 * 24 * 60 * 60 * 1000).getTime();
    const levels = await ctx.db.query("levels").collect();
    const randomLevels = [];
    const randomIndices: number[] = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * levels.length);
      // redo random level if it's already in the list
      if (randomIndices.includes(randomIndex)) {
        i--;
        continue;
      }
      randomIndices.push(randomIndex);
      randomLevels.push(levels[randomIndex]._id);
    }

    await ctx.db.insert("weeklyChallenges", {
      startDate: BigInt(today),
      endDate: BigInt(endDate),
      round_1: randomLevels[0],
      round_2: randomLevels[1],
      round_3: randomLevels[2],
      round_4: randomLevels[3],
      round_5: randomLevels[4],
      timeAllowedPerRound: BigInt(60),
    });
  },
});

/**
 * Retrieves the levels from a weekly challenge
 * @param args.round1 - The ID of the first round level
 * @param args.round2 - The ID of the second round level
 * @param args.round3 - The ID of the third round level
 * @param args.round4 - The ID of the fourth round level
 * @param args.round5 - The ID of the fifth round level
 * @returns - The levels from the weekly challenge
 */
export const getLevelsFromWeeklyChallenge = query({
  args: {
    round1: v.id("levels"),
    round2: v.id("levels"),
    round3: v.id("levels"),
    round4: v.id("levels"),
    round5: v.id("levels"),
  },
  handler: async (ctx, args) => {
    const round_1 = await ctx.db.get(args.round1);
    const round_2 = await ctx.db.get(args.round2);
    const round_3 = await ctx.db.get(args.round3);
    const round_4 = await ctx.db.get(args.round4);
    const round_5 = await ctx.db.get(args.round5);

    return {
      round_1,
      round_2,
      round_3,
      round_4,
      round_5,
    };
  },
});

/**
 * Retrieves the weekly challenge with populated levels
 * @returns The weekly challenge with populated levels
 */
export const getPopulatedLevelsFromWeeklyChallenge = query({
  handler: async (ctx) => {
    const today = new Date().getTime();
    const weeklyChallenges = await ctx.db
      .query("weeklyChallenges")
      .filter((q) => q.gte(q.field("endDate"), BigInt(today)))
      .collect();

    console.log(weeklyChallenges);

    if (weeklyChallenges.length === 0) {
      return null;
    } else {
      const weeklyChallenge = weeklyChallenges[0];
      const round_1 = (
        await ctx.db
          .query("levels")
          .filter((q) => q.eq(q.field("_id"), weeklyChallenge.round_1))
          .collect()
      )[0];
      const round_2 = (
        await ctx.db
          .query("levels")
          .filter((q) => q.eq(q.field("_id"), weeklyChallenge.round_2))
          .collect()
      )[0];
      const round_3 = (
        await ctx.db
          .query("levels")
          .filter((q) => q.eq(q.field("_id"), weeklyChallenge.round_3))
          .collect()
      )[0];
      const round_4 = (
        await ctx.db
          .query("levels")
          .filter((q) => q.eq(q.field("_id"), weeklyChallenge.round_4))
          .collect()
      )[0];
      const round_5 = (
        await ctx.db
          .query("levels")
          .filter((q) => q.eq(q.field("_id"), weeklyChallenge.round_5))
          .collect()
      )[0];

      return {
        _id: weeklyChallenge._id,
        startDate: weeklyChallenge.startDate,
        endDate: weeklyChallenge.endDate,
        round_1,
        round_2,
        round_3,
        round_4,
        round_5,
      };
    }
  },
});

/**
 * Updates a specific weekly challenge's specific round with a new level ID
 * @param args.weeklyChallengeId - The ID of the weekly challenge
 * @param args.roundNumber - The number of the round to update
 * @param args.levelId - The ID of the new level
 */
export const updateWeeklyChallengeRound = mutation({
  args: { weeklyChallengeId: v.id("weeklyChallenges"), roundNumber: v.int64(), levelId: v.id("levels") },
  handler: async (ctx, args) => {
    const weeklyChallenge = await ctx.db.get(args.weeklyChallengeId);

    if (!weeklyChallenge) {
      return;
    }

    // switch
    switch (Number(args.roundNumber)) {
      case 1:
        weeklyChallenge.round_1 = args.levelId;
        break;
      case 2:
        weeklyChallenge.round_2 = args.levelId;
        break;
      case 3:
        weeklyChallenge.round_3 = args.levelId;
        break;
      case 4:
        weeklyChallenge.round_4 = args.levelId;
        break;
      case 5:
        weeklyChallenge.round_5 = args.levelId;
        break;
      default:
        break;
    }
    await ctx.db.patch(args.weeklyChallengeId, weeklyChallenge);
  },
});
