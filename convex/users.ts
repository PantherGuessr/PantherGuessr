import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Query to get the current user.
 *
 * @constant
 * @type {Query}
 * @param {Object} args - The arguments for the query.
 * @param {Function} handler - The handler function to process the query.
 * @returns {Promise<User>} The current user.
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

/**
 * Upserts a user record from Clerk data.
 * 
 * This function performs an internal mutation that either inserts a new user record
 * or updates an existing one based on the provided Clerk user data.
 * 
 * @param args.data - The user data from Clerk, validated as `UserJSON`.
 * 
 * @remarks
 * - This function does not perform runtime validation on the input data and trusts the data from Clerk.
 * - If a user with the given Clerk ID does not exist, a new record is inserted.
 * - If a user with the given Clerk ID already exists, the existing record is updated.
 * 
 * @param ctx - The context object containing the database connection.
 * @param data - The user data from Clerk.
 * 
 * @returns {Promise<void>} - A promise that resolves when the upsert operation is complete.
 */
export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const user = await userByClerkId(ctx, data.id);
    
    if (user === null) {      
      const background = await ctx.db.query("profileBackgrounds").withIndex("by_creation_time").first(); // generates background
      // TODO: Guarantee that the "Just born" tagline is always set
      const tagline = await ctx.db.query("profileTaglines").first(); // generates tagline

      const userAttributes = {
        clerkId: data.id!,
        username: data.username!,
        emails: data.email_addresses ? data.email_addresses.map(email => email.email_address) : [],
        level: 1n,
        currentXP: 0n,
        currentStreak: 0n,
        picture: data.image_url,
        profileBackground: background!._id,
        profileTagline: tagline!._id,
        unlockedProfileBackgrounds: [background!._id],
        unlockedProfileTaglines: [tagline!._id],
      };
            
      await ctx.db.insert("users", userAttributes);
    } else {
      const userAttributes = {
        clerkId: data.id!,
        username: data.username!,
        emails: data.email_addresses ? data.email_addresses.map(email => email.email_address) : [],
        picture: data.image_url,
      };

      await ctx.db.patch(user._id, userAttributes);
    }
  },
});


/**
 * Deletes a user from the database based on the provided Clerk user ID.
 * 
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkUserId - The Clerk user ID of the user to be deleted.
 * 
 * @param {Object} ctx - The context object.
 * 
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 * 
 * @throws {Error} - Throws an error if the user cannot be found or deleted.
 * 
 * @example
 * ```typescript
 * await deleteFromClerk({ clerkUserId: 'clerk_user_id' });
 * ```
 */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByClerkId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

/**
 * Query to get a user by their username.
 *
 * This query takes a username as an argument and retrieves the corresponding user document
 * from the users table. It uses an index on the username field to perform the query efficiently.
 *
 * @param {Object} args - The arguments object.
 * @param {string} args.username - The username of the user to retrieve.
 * @returns {Promise<Object|null>} - A promise that resolves to the user document if found, or null if not found.
*/
export const getUserByUsername = query({
  args: {
    username: v.string(),
  },
  async handler(ctx, args) {
    const user = await userByUsername(ctx, args.username);
    return user;
  }
});

/**
 * Awards experience points (XP) to a user and updates their level accordingly.
 * 
 * @param args - The arguments for the mutation.
 * @param args.username - The username of the user to award XP to.
 * @param args.earnedXP - The amount of XP earned by the user.
 * 
 * @throws {Error} If the user is not found.
 * 
 * @remarks
 * This function calculates the new XP and level for the user based on the earned XP.
 * The XP required for each level doubles with each level up to a maximum level.
 * The user's level and current XP are updated in the database.
 * 
 * @example
 * ```typescript
 * await awardUserXP({ username: "john_doe", earnedXP: 150 });
 * ```
 */
export const awardUserXP = internalMutation({
  args: {
    username: v.string(),
    earnedXP: v.number(),
  },
  async handler(ctx, args) {
    // Retrieve the user by their username
    const user = await userByUsername(ctx, args.username);
    if (!user) {
      throw new Error("User not found");
    }

    // Define the XP required for each level
    const xpForLevels = [25, 50, 75, 100];
    const xpForMaxLevel = 100;
    
    // Add the earned XP to the user's current XP
    let currentXP = user.currentXP + BigInt(args.earnedXP);
    let level = user.level;
    const oldLevel = level;

    let canLevelUp = true;

    // Loop to calculate the new level and remaining XP
    do {
      // Determine the XP required for the next level
      const xpForNextLevel = level < BigInt(xpForLevels.length + 1) ? BigInt(xpForLevels[Number(level) - 1]) : BigInt(xpForMaxLevel);
      
      // Check if the user has enough XP to level up
      if (currentXP >= xpForNextLevel) {
        currentXP -= xpForNextLevel; // Subtract the XP required for the next level
        level += 1n; // Increment the user's level
      } else {
        canLevelUp = false; // Exit the loop if the user does not have enough XP to level up
      }
    } while (canLevelUp);

    console.log(`Awarded @${args.username} ${args.earnedXP} XP`);

    // Update the user's level and current XP in the database
    await ctx.db.patch(user._id, { level, currentXP });

    return {
      oldLevel,
      newLevel: level,
    };
  }
});

/**
 * Query to check if a user has a specific role.
 *
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @param {string} args.role - The role to check for.
 * @returns {Promise<boolean>} - Returns `true` if the user has the specified role, otherwise `false`.
 *
 * @async
 * @function hasRole
 * @param {Object} ctx - The context object.
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @param {string} args.role - The role to check for.
 * @returns {Promise<boolean>} - Returns `true` if the user has the specified role, otherwise `false`.
 */
export const hasRole = query({
  args: {
    clerkId: v.string(),
    role: v.string(),
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return false;
    }

    return user.roles?.includes(args.role);
  }
});

/**
 * Query to check if a user has a specific achievement.
 *
 * @param args - The arguments for the query.
 * @param args.name - The name of the achievement to check.
 * @param args.clerkId - The Clerk ID of the user.
 * @returns A boolean indicating whether the user has the specified achievement.
 *
 * @example
 * const hasAchieved = await hasAchievement({ name: 'First Win', clerkId: 'user_123' });
 * console.log(hasAchieved); // true or false
 */
export const hasAchievement = query({
  args: {
    name: v.string(),
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return false;
    }

    for (const achievementId of user.achievements || []) {
      const achievement = await achievementById(ctx, achievementId);
      if (achievement?.name === args.name) {
        return true;
      }
    }

    return false;
  }
});

export const getAchievementByName = query({
  args: {
    name: v.string(),
  },
  async handler(ctx, args) {
    return await achievementByName(ctx, args.name);
  }
});

/**
 * Query to check if a user has an email address ending with "@chapman.edu".
 *
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the user has an email ending with "@chapman.edu", otherwise `false`.
 */
export const hasChapmanEmail = query({
  args: {
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return false;
    }
        
    return user.emails.some(email => email.endsWith("@chapman.edu"));
  }
});

/**
 * Retrieves the unlocked profile taglines for a user based on their Clerk ID.
 *
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @returns {Promise<Array<Object>|null>} A promise that resolves to an array of unlocked profile taglines or null if the user is not found.
 *
 * @async
 * @function getUnlockedTaglines
 * @memberof module:users
 */
export const getUnlockedTaglines = query({
  args: {
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    const taglineIds = user?.unlockedProfileTaglines;

    // iterate through taglines to return objects
    const taglines = [];
    for (const taglineId of taglineIds) {
      const tagline = await ctx.db.query("profileTaglines").withIndex("by_id", (q) => q.eq("_id", taglineId)).unique();
      taglines.push(tagline);
    }
        
    return taglines;
  }
});

/**
 * Retrieves the selected tagline for a user based on their Clerk ID.
 *
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @returns {Promise<Object|null>} The selected tagline object if found, otherwise null.
 *
 * @async
 * @function getSelectedTagline
 * @param {Object} ctx - The context object.
 * @param {Object} args - The arguments object containing the Clerk ID.
 */
export const getSelectedTagline = query({
  args: {
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    const taglineId = user?.profileTagline;

    const tagline = await ctx.db.query("profileTaglines").withIndex("by_id", (q) => q.eq("_id", taglineId)).unique();
        
    return tagline;
  }
});

/**
 * Updates the selected tagline for a user.
 *
 * @mutation
 * @param {Object} args - The arguments for the mutation.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @param {string} args.taglineId - The ID of the selected tagline from the profileTaglines collection.
 * @returns {Promise<null | void>} - Returns null if the user is not found, otherwise void.
 *
 * @async
 * @function
 * @name updateSelectedTagline
 * @param {Object} ctx - The context object containing the database instance.
 * @param {Object} args - The arguments object containing the Clerk ID and tagline ID.
 */
export const updateSelectedTagline = mutation({
  args: {
    clerkId: v.string(),
    taglineId: v.id("profileTaglines")
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    await ctx.db.patch(user._id, { profileTagline: args.taglineId });
  }
});

export const getUnlockedBackgrounds = query({
  args: {
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    const backgroundIds = user?.unlockedProfileBackgrounds;

    const backgrounds = [];
    for (const backgroundId of backgroundIds) {
      const background = await ctx.db.query("profileBackgrounds").withIndex("by_id", (q) => q.eq("_id", backgroundId)).unique();
      backgrounds.push(background);
    }
        
    return backgrounds;
  }
});

export const getSelectedBackground = query({
  args: {
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    const backgroundId = user?.profileBackground;

    const background = await ctx.db.query("profileBackgrounds").withIndex("by_id", (q) => q.eq("_id", backgroundId)).unique();
        
    return background;
  }
});

export const updateSelectedBackground = mutation({
  args: {
    clerkId: v.string(),
    backgroundId: v.id("profileBackgrounds")
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    await ctx.db.patch(user._id, { profileBackground: args.backgroundId });
  }
});

export const getListOfProfiles = query({
  args: {},
  async handler(ctx) {
    return await ctx.db.query("users").collect();
  }
});

/**
 * Retrieves the last N played games for a user based on their Clerk ID.
 * 
 * @param {Object} args - The arguments object.
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @param {number} args.n - The number of games to retrieve.
 * @returns {Promise<Array<Object>|null>} - A promise that resolves to an array of the last N played games or null if the user is not found.
 */
export const getLastNPlayedGames = query({
  args: {
    clerkId: v.string(),
    n: v.number()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if(!user) {
      return null;
    }

    const leaderboardEntriesList = await ctx.db.query("leaderboardEntries")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.n);

    return leaderboardEntriesList;
  }
});

/**
 * Updates the user's streak based on their last play timestamp.
 *
 * @mutation
 * @param {string} args.clerkId - The Clerk ID of the user.
 * @returns {Promise<bigint>} The updated streak value.
 * @throws {Error} If the user could not be found.
 *
 * This mutation checks the user's last play timestamp and updates their streak accordingly.
 * If the user played within the last full day (PST), the streak is incremented.
 * If more than a full day has passed since the last play, the streak is reset to 1.
 * The updated streak and the current timestamp are then saved to the database.
 */
export const updateStreak = mutation({
  args: {
    clerkId: v.string()
  },
  async handler(ctx, args) {
    const user = await userByClerkId(ctx, args.clerkId);

    if (!user) {
      throw new Error("User could not be found!");
    }

    const now = new Date();
    const nowPST = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const lastPlay = user.lastPlayedTimestamp ? new Date(user.lastPlayedTimestamp) : new Date(0);
    const lastPlayPST = new Date(lastPlay.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));

    // Reset time part of the dates to midnight PST
    const nowMidnightPST = new Date(nowPST.getFullYear(), nowPST.getMonth(), nowPST.getDate());
    const lastPlayMidnightPST = new Date(lastPlayPST.getFullYear(), lastPlayPST.getMonth(), lastPlayPST.getDate());

    let newStreak = user.currentStreak ?? 0n;

    // Check if the user has already played today
    if (nowMidnightPST.getTime() !== lastPlayMidnightPST.getTime()) {
      const timeSinceLastPlay = nowMidnightPST.getTime() - lastPlayMidnightPST.getTime();
      if (timeSinceLastPlay <= 24 * 60 * 60 * 1000) {
        // Played within the next full day, increment streak
        newStreak += 1n;
      } else {
        // More than a full day, reset streak
        newStreak = 1n;
      }
    }

    await ctx.db.patch(user._id, { currentStreak: newStreak, lastPlayedTimestamp: now.getTime() });

    return newStreak;
  }
});

/**
 * Resets the current streaks of users who have been inactive for more than 24 hours.
 * 
 * This function calculates the current time in the PST timezone and determines the 
 * midnight timestamp of the current day in PST. It then queries the database for users 
 * whose `lastPlayedTimestamp` is earlier than 24 hours before the current midnight PST.
 * For each inactive user found, it resets their `currentStreak` to 0 and sets their 
 * `lastPlayedTimestamp` to undefined.
 * 
 * @param ctx - The context object containing the database connection and other utilities.
 * @returns A message indicating the number of users whose streaks were cleared.
 */
export const resetInactiveStreaks = internalMutation({
  async handler(ctx) {
    const now = new Date();
    const nowPST = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const nowMidnightPST = new Date(nowPST.getFullYear(), nowPST.getMonth(), nowPST.getDate()).getTime();

    const inactiveUsers = await ctx.db.query("users").filter(q => q.lt(q.field("lastPlayedTimestamp"), nowMidnightPST - 24 * 60 * 60 * 1000)).collect();

    for (const user of inactiveUsers) {
      await ctx.db.patch(user._id, { currentStreak: 0n, lastPlayedTimestamp: undefined });
    }

    return `Cleared streaks for ${inactiveUsers.length} users.`;
  }
});

/**
 * Mutation to report a user.
 * 
 * @param {string} args.offenderClerkId - The Clerk ID of the user being reported.
 * @param {string} args.reportReason - The reason for reporting the user.
 * @param {string} args.reporterMessage - Additional message from the reporter.
 * 
 * @returns {Promise<void>} - A promise that resolves when the report is successfully created.
 * 
 * @async
 * @function
 * @name reportUser
 * 
 * @example
 * ```typescript
 * await reportUser({
 *   offenderClerkId: "offender123",
 *   reportReason: "Inappropriate behavior",
 *   reporterMessage: "User was spamming in the chat."
 * });
 * ```
 */
export const reportUser = mutation({
  args: {
    offenderClerkId: v.string(),
    reportReason: v.string(),
    reporterMessage: v.string()
  },
  async handler(ctx, args) {
    const reportUser = await getCurrentUser(ctx);
    const offenderUser = await userByClerkId(ctx, args.offenderClerkId);

    if(!reportUser || !offenderUser) {
      return;
    }

    const timeFrame = 1 * 60 * 60 * 1000; // 1 hour

    // Fetch the reports made by the user within the time frame
    const recentReports = await ctx.db.query("userReports")
      .filter(q => q.eq(q.field("reporter"), reportUser._id))
      .filter(q => q.gt(q.field("_creationTime"), Date.now() - timeFrame))
      .filter(q => q.eq(q.field("hasBeenResolved"), false))
      .collect();

    if(recentReports.length > 0) {
      return;
    }

    await ctx.db.insert("userReports", {
      reportedUser: offenderUser!._id,
      reporter: reportUser!._id,
      reportReason: args.reportReason,
      reporterMessage: args.reporterMessage,
      hasBeenResolved: false
    });
  }
});

/**
 * Retrieves the current user record or throws an error if the user is not found.
 *
 * @param ctx - The context for the query.
 * @returns The current user record.
 * @throws Will throw an error if the current user cannot be retrieved.
 */
export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

/**
 * Retrieves the current user based on the authentication context.
 *
 * @param ctx - The query context containing authentication information.
 * @returns A promise that resolves to the current user or null if no user is authenticated.
 */
export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByClerkId(ctx, identity.subject);
}

/**
 * Retrieves a user from the database using their Clerk ID.
 *
 * @param ctx - The query context containing the database connection.
 * @param clerkId - The Clerk ID of the user to be retrieved.
 * @returns A promise that resolves to the user object if found, otherwise null.
 */
async function userByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", clerkId))
    .unique();
}

/**
 * Retrieves a user by their username from the database.
 *
 * @param ctx - The context object containing the database connection.
 * @param username - The username of the user to retrieve.
 * @returns A promise that resolves to the user object if found, otherwise null.
 */
async function userByUsername(ctx: QueryCtx, username: string) {
  return await ctx.db
    .query("users")
    .withIndex("byUsername", (q) => q.eq("username", username))
    .unique();
}

/**
 * Retrieves an achievement by its id.
 *
 * @param ctx - The query context used to interact with the database.
 * @param id - The id of the achievement to retrieve.
 * @returns A promise that resolves to the unique achievement with the specified id.
 */
async function achievementById(ctx: QueryCtx, id: Id<"achievements">) {
  return await ctx.db
    .query("achievements")
    .withIndex("by_id", (q) => q.eq("_id", id))
    .unique();
}

/**
 * Retrieves an achievement by its name.
 *
 * @param ctx - The query context used to interact with the database.
 * @param name - The name of the achievement to retrieve.
 * @returns A promise that resolves to the unique achievement with the specified name.
 */
async function achievementByName(ctx: QueryCtx, name: string) {
  return await ctx.db
    .query("achievements")
    .withIndex("byName", (q) => q.eq("name", name))
    .unique();
}