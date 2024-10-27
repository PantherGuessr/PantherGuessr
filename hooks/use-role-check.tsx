import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

/**
 * Custom hook to check if a user has a specific role.
 *
 * @param {string} role - The role to check for.
 * @param {string | null} [userClerkIdToCheck=null] - Optional Clerk ID of the user to check. If not provided, the current user's ID will be used.
 * @returns {{ result: any, isLoading: boolean }} - An object containing the query result and a loading state.
 * @example
 * const { result, isLoading } = useRoleCheck("developer");
 */
export const useRoleCheck = (role: string, userClerkIdToCheck: string | null = null) => {
    const { user } = useUser();
    const clerkId = userClerkIdToCheck || user?.id || "";
    const queryResult = useQuery(api.users.hasRole, { clerkId, role });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(queryResult !== undefined) {
            setIsLoading(false);
        }
    }, [queryResult]);

    return { result: queryResult, isLoading };
};