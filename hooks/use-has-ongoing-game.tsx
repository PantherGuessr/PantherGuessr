import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useHasOngoingGame = (clerkId: string | undefined) => {
  const result = useQuery(api.users.hasOngoingGame, clerkId ? { clerkId } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
