import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useAchievementCheck = (name: string, clerkId: string | undefined) => {
  const hasAchievement = useQuery(api.users.hasAchievement, clerkId ? { clerkId, name } : "skip");
  const achievement = useQuery(api.users.getAchievementByName, { name });

  return {
    result: hasAchievement,
    isLoading: (hasAchievement === undefined && clerkId !== undefined) || achievement === undefined,
    name: achievement?.name,
    description: achievement?.description,
  };
};
