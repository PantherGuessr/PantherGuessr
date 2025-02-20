import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

/**
 * Custom hook to get the selected background for a user.
 *
 * @param {string | null} [userClerkId=null] - The Clerk ID of the user. If not provided, the ID from the current user context will be used.
 * @returns {Object} An object containing the query result and loading state.
 * @returns {any} result - The result of the query for the selected background.
 * @returns {boolean} isLoading - A boolean indicating if the query is still loading.
 */
export const useGetSelectedBackground = (userClerkId: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkId || user?.id || "";
  const queryResult = useQuery(api.users.getSelectedBackground, { clerkId });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (queryResult !== undefined) {
      setIsLoading(false);
    }
  }, [queryResult]);

  return { result: queryResult, isLoading };
};
