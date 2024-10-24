import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

/**
 * Custom hook to check if a user has a specific role.
 *
 * @param {string} role - The role to check for.
 * @param {User | null} [userToCheck=null] - Optional user object to check the role for. If not provided, the current user will be used.
 * @returns {{ data: any, isLoading: boolean }} - An object containing the query result data and a loading state.
 *
 * @example
 * const { data, isLoading } = useRoleCheck('admin');
 */
export const useRoleCheck = (role: string, userToCheck: User | null = null) => {
    const { user } = useUser();
    const clerkId = userToCheck?.id || user?.id || "";
    const queryResult = useQuery(api.users.hasRole, { clerkId, role });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(queryResult !== undefined) {
            setIsLoading(false);
        }
    }, [queryResult]);

    return { data: queryResult, isLoading };
};