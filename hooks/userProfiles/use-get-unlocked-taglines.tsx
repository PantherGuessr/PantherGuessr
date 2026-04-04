import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetUnlockedTaglines = (clerkId: string | undefined) => {
  const result = useQuery(api.users.getUnlockedTaglines, clerkId ? { clerkId } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
