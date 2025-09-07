import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

/**
 * Custom hook to get the currently active weekly challenge game ID
 * @returns gameId (string) or null if not found
 */
export function useWeeklyChallengeGameId(): string | null {
  const weeklyChallenge = useQuery(api.weeklychallenge.getWeeklyChallenge, {});
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    if (weeklyChallenge && weeklyChallenge.gameId) {
      setGameId(weeklyChallenge.gameId);
    } else {
      setGameId(null);
    }
  }, [weeklyChallenge]);

  return gameId;
}
