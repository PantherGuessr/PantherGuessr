import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

/**
 * Custom hook to get the upcoming weekly challenge (next week)
 * Creates challenges if they don't exist
 */
const useUpcomingWeeklyChallenge = () => {
  // Fetch upcoming weekly challenge data
  const upcomingWeeklyChallengeData = useQuery(api.weeklychallenge.getPopulatedUpcomingWeeklyChallenge);

  // Mutation to create weekly challenges
  const createWeeklyChallenge = useMutation(api.weeklychallenge.makeWeeklyChallengeIfNonexistent);

  // Ref to track if the challenge creation has been attempted (avoids triggering re-renders)
  const challengeCreated = useRef(false);

  // Check if weekly challenges exist and create them if not
  useEffect(() => {
    if (upcomingWeeklyChallengeData === null && !challengeCreated.current) {
      createWeeklyChallenge();
      challengeCreated.current = true;
    }
  }, [upcomingWeeklyChallengeData, createWeeklyChallenge]);

  return upcomingWeeklyChallengeData;
};

export default useUpcomingWeeklyChallenge;
