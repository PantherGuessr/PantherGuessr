import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetUnlockedBackgrounds = (clerkId: string | undefined) => {
  const result = useQuery(api.users.getUnlockedBackgrounds, clerkId ? { clerkId } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
