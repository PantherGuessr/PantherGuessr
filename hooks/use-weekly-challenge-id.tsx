import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

/**
 * Custom hook to get the currently active weekly challenge game ID, and create one if not found
 * @returns gameId (string) or null if not found
 */
export function useWeeklyChallengeGameId(): string | null {
  const weeklyChallenge = useQuery(api.weeklychallenge.getWeeklyChallenge, {});
  const createWeeklyChallenge = useMutation(api.weeklychallenge.makeWeeklyChallengeIfNonexistent);
  const [gameId, setGameId] = useState<string | null>(null);
  const [challengeCreated, setChallengeCreated] = useState(false);

  useEffect(() => {
    if (weeklyChallenge && weeklyChallenge.gameId) {
      setGameId(weeklyChallenge.gameId);
    } else {
      setGameId(null);
      if (!challengeCreated) {
        createWeeklyChallenge();
        setChallengeCreated(true);
      }
    }
  }, [weeklyChallenge, challengeCreated, createWeeklyChallenge]);

  return gameId;
}
