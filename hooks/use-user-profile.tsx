import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useUserProfile = (clerkId: string | undefined) => {
  const profile = useQuery(api.users.getUserProfile, clerkId ? { clerkId } : "skip");
  return {
    data: profile ?? null,
    isLoading: profile === undefined && clerkId !== undefined,
  };
};
