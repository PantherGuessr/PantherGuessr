import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { format, addDays } from 'date-fns';

// attempts to get the weekly challenge where today is between the start and end date of the weekly challenge
export const getWeeklyChallenge = query({
  handler: async (ctx) => {
    const date = new Date();
    const today = date.toISOString().split("T")[0];
    const weeklyChallenges = await ctx.db
      .query("weeklyChallenges")
      .filter(q => q.and(
        q.lte(q.field("startDate"), today),
        q.gte(q.field("endDate"), today)
      ))
      .collect();

    return weeklyChallenges;
  }
});

// makes the weekly challenge for the current week by picking 5 random levels from the levels table
export const makeWeeklyChallenge = mutation({
    handler: async (ctx) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const endDate = format(addDays(new Date(), 6), 'yyyy-MM-dd');
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
            startDate: today,
            endDate: endDate,
            round_1: randomLevels[0],
            round_2: randomLevels[1],
            round_3: randomLevels[2],
            round_4: randomLevels[3],
            round_5: randomLevels[4],
            timeAllowedPerRound: BigInt(60)
        });
    }
});

// gets weekly challenge with levels
export const getLevelsFromWeeklyChallenge = query({
  args: { round1: v.id("levels"), round2: v.id("levels"), round3: v.id("levels"), round4: v.id("levels"), round5: v.id("levels") },
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
      round_5
    };
  }
});

// gets weekly challenge with populated levels
export const getPopulatedLevelsFromWeeklyChallenge = query({
  handler: async (ctx) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const endDate = format(addDays(new Date(), 6), 'yyyy-MM-dd');
    const weeklyChallenges = await ctx.db
      .query("weeklyChallenges")
      .filter(q => q.and(
        q.lte(q.field("startDate"), today),
        q.lte(q.field("endDate"), endDate)
      ))
      .collect();

    if (weeklyChallenges.length === 0) {
      return null;
    }
    else {
      const weeklyChallenge = weeklyChallenges[0];
      const round_1 = (await ctx.db.query("levels").filter(q => q.eq(q.field("_id"), weeklyChallenge.round_1)).collect())[0];
      const round_2 = (await ctx.db.query("levels").filter(q => q.eq(q.field("_id"), weeklyChallenge.round_2)).collect())[0];
      const round_3 = (await ctx.db.query("levels").filter(q => q.eq(q.field("_id"), weeklyChallenge.round_3)).collect())[0];
      const round_4 = (await ctx.db.query("levels").filter(q => q.eq(q.field("_id"), weeklyChallenge.round_4)).collect())[0];
      const round_5 = (await ctx.db.query("levels").filter(q => q.eq(q.field("_id"), weeklyChallenge.round_5)).collect())[0];

      return {
        _id: weeklyChallenge._id,
        startDate: weeklyChallenge.startDate,
        endDate: weeklyChallenge.endDate,
        round_1,
        round_2,
        round_3,
        round_4,
        round_5
      };
    }
  }
});

// updates a specific weekly challenge's specific round with a new level ID
export const updateWeeklyChallengeRound = mutation({
  args: { weeklyChallengeId: v.id("weeklyChallenges"), roundNumber: v.int64() , levelId: v.id("levels") },
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
  }
});