import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useBanCheck = (clerkId: string | undefined) => {
  const queryResult = useQuery(api.users.isUserBanned, clerkId ? { clerkId } : "skip");

  return {
    result: queryResult?.result,
    banReason: queryResult?.banReason,
    appealActive: queryResult?.appealSubmitted,
    isLoading: queryResult === undefined && clerkId !== undefined,
  };
};
