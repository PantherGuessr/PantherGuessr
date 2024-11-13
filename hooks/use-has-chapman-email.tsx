import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

/**
 * Custom hook to check if a user has a Chapman email.
 *
 * @param {string | null} [userClerkId=null] - The Clerk ID of the user. If not provided, it will use the ID from the `useUser` hook.
 * @returns {Object} An object containing the query result and a loading state.
 * @returns {any} result - The result of the query to check if the user has a Chapman email.
 * @returns {boolean} isLoading - A boolean indicating if the query is still loading.
 * @example
 * const {result, isLoading } = useHasChapmanEmail();
 */
export const useHasChapmanEmail = (userClerkId: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkId || user?.id || "";
  const queryResult = useQuery(api.users.hasChapmanEmail, { clerkId });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(queryResult !== undefined) {
      setIsLoading(false);
    }
  }, [queryResult]);

  return { result: queryResult, isLoading };
};