import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Hook to check if a game is a weekly challenge using Convex generated function
 * @param gameId - The ID of the game to check
 * @returns { isWeekly: boolean | undefined, loading: boolean }
 */
export function useIsGameWeekly(gameId?: Id<"games">) {
  const result = useQuery(
    api.weeklychallenge.isGameWeeklyChallenge,
    gameId ? { gameId } : "skip"
  );
  return {
    isWeekly: result,
    loading: result === undefined,
  };
}
