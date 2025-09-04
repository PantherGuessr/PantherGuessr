import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

const useWeeklyChallenge = () => {
  // Fetch weekly challenge data
  const weeklyChallengeData = useQuery(api.weeklychallenge.getPopulatedWeeklyChallenge);

  // Mutation to create a weekly challenge
  const createWeeklyChallenge = useMutation(api.weeklychallenge.makeWeeklyChallenge);

  // State to track if the challenge creation has been attempted
  const [challengeCreated, setChallengeCreated] = useState(false);

  // Check if a weekly challenge exists and create one if not
  useEffect(() => {
    if (weeklyChallengeData === null && !challengeCreated) {
      createWeeklyChallenge();
      setChallengeCreated(true);
    }
  }, [weeklyChallengeData, challengeCreated, createWeeklyChallenge]);

  return weeklyChallengeData;
};

export default useWeeklyChallenge;
