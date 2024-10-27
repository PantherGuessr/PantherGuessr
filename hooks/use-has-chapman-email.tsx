import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

/**
 * Custom hook to check if a user has a Chapman email.
 *
 * @param {User | null} [userToCheck=null] - The user object to check. If not provided, the current user will be checked.
 * @returns {{ result: any, isLoading: boolean }} - An object containing the query result and a loading state.
 *
 * @example
 * const { result, isLoading } = useHasChapmanEmail();
 */
export const useHasChapmanEmail = (userToCheck: User | null = null) => {
    const { user } = useUser();
    const clerkId = userToCheck?.id || user?.id || "";
    const queryResult = useQuery(api.users.hasChapmanEmail, { clerkId });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(queryResult !== undefined) {
            setIsLoading(false);
        }
    }, [queryResult]);

    return { result: queryResult, isLoading };
};