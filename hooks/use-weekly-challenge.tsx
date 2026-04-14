import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

const useWeeklyChallenge = () => {
  // Fetch weekly challenge data
  const weeklyChallengeData = useQuery(api.weeklychallenge.getPopulatedWeeklyChallenge);

  // Mutation to create a weekly challenge
  const createWeeklyChallenge = useMutation(api.weeklychallenge.makeWeeklyChallengeIfNonexistent);

  // Ref to track if the challenge creation has been attempted (avoids triggering re-renders)
  const challengeCreated = useRef(false);

  // Check if a weekly challenge exists and create one if not
  useEffect(() => {
    if (weeklyChallengeData === null && !challengeCreated.current) {
      createWeeklyChallenge();
      challengeCreated.current = true;
    }
  }, [weeklyChallengeData, createWeeklyChallenge]);

  return weeklyChallengeData;
};

export default useWeeklyChallenge;
