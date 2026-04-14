import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Custom hook to get the currently active weekly challenge game ID, and create one if not found
 * @returns gameId (string) or null if not found
 */
export function useWeeklyChallengeGameId(): Id<"games"> | null {
  const weeklyChallenge = useQuery(api.weeklychallenge.getWeeklyChallenge, {});
  const createWeeklyChallenge = useMutation(api.weeklychallenge.makeWeeklyChallengeIfNonexistent);
  const challengeCreated = useRef(false);

  useEffect(() => {
    if (!weeklyChallenge?.gameId && !challengeCreated.current) {
      createWeeklyChallenge();
      challengeCreated.current = true;
    }
  }, [weeklyChallenge, createWeeklyChallenge]);

  return weeklyChallenge?.gameId ?? null;
}
