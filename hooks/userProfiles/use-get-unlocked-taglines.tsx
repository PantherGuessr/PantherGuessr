import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";


/**
 * Custom hook to fetch unlocked taglines for a user.
 *
 * @param {string | null} [userClerkId=null] - The Clerk ID of the user. If not provided, the ID from the user context will be used.
 * @returns {Object} - An object containing the query result and loading state.
 * @returns {any} result - The result of the query fetching unlocked taglines.
 * @returns {boolean} isLoading - A boolean indicating if the query is still loading.
 */
export const useGetUnlockedTaglines = (userClerkId: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkId || user?.id || "";
  const queryResult = useQuery(api.users.getUnlockedTaglines, { clerkId });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(queryResult !== undefined) {
      setIsLoading(false);
    }
  }, [queryResult]);

  return { result: queryResult, isLoading };
};