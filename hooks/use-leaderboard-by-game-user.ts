import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Custom hook to get the leaderboard entry for a specific game ID and user ID.
 * Returns the leaderboard entry or null if not found.
 *
 * @param gameId - The ID of the game
 * @param userId - The ID of the user
 */
export function useLeaderboardByGameUser(gameId?: Id<"games">, userId?: Id<"users">) {
  return useQuery(api.game.getLeaderboardEntryByGameAndUser, gameId && userId ? { gameId, userId } : "skip");
}
