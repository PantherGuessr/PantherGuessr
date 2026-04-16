/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as continuegame from "../continuegame.js";
import type * as crons from "../crons.js";
import type * as game from "../game.js";
import type * as gamestats from "../gamestats.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as levelcreator from "../levelcreator.js";
import type * as reports from "../reports.js";
import type * as users from "../users.js";
import type * as weeklychallenge from "../weeklychallenge.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  continuegame: typeof continuegame;
  crons: typeof crons;
  game: typeof game;
  gamestats: typeof gamestats;
  http: typeof http;
  leaderboard: typeof leaderboard;
  levelcreator: typeof levelcreator;
  reports: typeof reports;
  users: typeof users;
  weeklychallenge: typeof weeklychallenge;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
