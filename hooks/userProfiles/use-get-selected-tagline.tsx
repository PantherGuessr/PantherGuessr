import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";

/**
 * Custom hook to fetch the selected tagline for a user.
 *
 * @param {string | null} [userClerkId=null] - The Clerk ID of the user. If not provided, it defaults to the current user's ID.
 * @returns {Object} - An object containing the query result and loading state.
 * @returns {any} result - The result of the query fetching the selected tagline.
 * @returns {boolean} isLoading - A boolean indicating whether the query is still loading.
 */
export const useGetSelectedTagline = (userClerkId: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkId || user?.id || "";
  const queryResult = useQuery(api.users.getSelectedTagline, { clerkId });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (queryResult !== undefined) {
      setIsLoading(false);
    }
  }, [queryResult]);

  return { result: queryResult, isLoading };
};
