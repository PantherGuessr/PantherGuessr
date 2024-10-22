// import { v } from "convex/values";

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


/**
 * Retrieves the daily game statistics from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the daily game statistics if found, otherwise null.
 *
 * @example
 * const stats = await getDailyGameStats();
 * if (stats) {
 *   console.log("Daily game stats:", stats);
 * } else {
 *   console.log("No daily game stats found.");
 * }
 */
export const getDailyGameStats = query({
    handler: async (ctx) => {
        const date = new Date()
        const today = date.toISOString().split("T")[0];
        const gameStats = await ctx.db
            .query("gameStats")
            .filter(q => q.and(
                q.eq(q.field("type"), "daily"),
                q.eq(q.field("isoDay"), today)
            ))
            .collect();
            
            return gameStats;

        }
});

export const getPastNDaysOfStats = query({
    args: { n : v.number() },
    handler: async (ctx, args) => {
        // get the current data and past n days of data
        const todayDate = new Date();
        const dataCollection = [];
        for (let i = 0; i < args.n; i++) {
            const date = new Date(todayDate);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split("T")[0];
            const gameStats = await ctx.db
                .query("gameStats")
                .filter(q => q.and(
                    q.eq(q.field("type"), "daily"),
                    q.eq(q.field("isoDay"), dateString)
                ))
                .collect();
            if (gameStats.length > 0) {
                dataCollection.push(gameStats[0]);
            }
        }

        return dataCollection;
    }
});

/**
 * Mutation to create daily game statistics.
 * 
 * This function inserts a new record into the "gameStats" table with the type set to "daily".
 * The record includes the current date, time in ISO format, and initializes the count to 0.
 * 
 * @param ctx - The context object containing the database instance.
 * @returns A promise that resolves to a BigInt value of 0.
 */
export const createDailyGameStats = mutation({
    handler: async (ctx) => {
        const date = new Date()
        await ctx.db.insert("gameStats", {
            type: "daily",
            isoTime: date.toISOString(),
            isoDay: date.toISOString().split("T")[0],
            count: BigInt(0),
            lastUpdated: date.toISOString()
        });
        return BigInt(0);
    }
});


/**
 * Increments the daily game statistics in the database.
 *
 * This mutation function checks if there is an existing record for today's date
 * in the "gameStats" collection with the type "daily". If such a record exists,
 * it increments the count by 1 and updates the lastUpdated timestamp. If no
 * record exists for today, it creates a new record with a count of 1.
 *
 * @param {Object} ctx - The context object containing the database connection.
 * @returns {Promise<bigint>} - The updated count of daily game statistics.
 */
export const incrementDailyGameStats = mutation({
    handler: async (ctx) => {
        const date = new Date()
        const today = date.toISOString().split("T")[0];
        const gameStats = await ctx.db
            .query("gameStats")
            .filter(q => q.and(
                q.eq(q.field("type"), "daily"),
                q.eq(q.field("isoDay"), today)
            ))
            .collect();

        if (gameStats.length > 0) {

            const gameStat = gameStats[0];
            const newGameStat = {
                ...gameStat,
                count: gameStat.count + BigInt(1),
                lastUpdated: date.toISOString()
            }
            const count = gameStat.count + BigInt(1);
            await ctx.db.replace(gameStat._id, newGameStat);
            return count;
        } else {
            await ctx.db.insert("gameStats", {
                type: "daily",
                isoTime: date.toISOString(),
                isoDay: date.toISOString().split("T")[0],
                count: BigInt(1),
                lastUpdated: date.toISOString()
            });
            return BigInt(1);
        }
    }
});