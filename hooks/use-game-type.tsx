import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Hook to get the game type for a given game ID using Convex generated function
 * @param gameId - The ID of the game to check
 * @returns { gameType: string | undefined, loading: boolean }
 */
export function useGameType(gameId?: Id<"games">) {
  const result = useQuery(api.game.getGameType, gameId ? { gameId } : "skip");
  return {
    gameType: result,
    loading: result === undefined,
  };
}
