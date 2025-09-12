import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";

/**
 * Custom hook to check if a user has an ongoing game.
 *
 * @param {string | null} [userClerkIdToCheck=null] - Optional Clerk ID of the user to check. If not provided, the current user's ID will be used.
 * @returns {{ result: any, isLoading: boolean }} - An object containing the query result and a loading state.
 * @example
 * const { result, isLoading } = useHasOngoingGame({ userClerkIdToCheck });
 */
export const useHasOngoingGame = (userClerkIdToCheck: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkIdToCheck || user?.id || "";
  const queryResult = useQuery(api.users.hasOngoingGame, { clerkId });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (queryResult !== undefined) {
      setIsLoading(false);
    }
  }, [queryResult]);

  return { result: queryResult, isLoading };
};
