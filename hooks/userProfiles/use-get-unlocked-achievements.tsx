import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";

export const useAchievementCheck = (name: string, userClerkIdToCheck: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkIdToCheck || user?.id || "";
  const hasAchievement = useQuery(api.users.hasAchievement, { clerkId, name });
  const achievement = useQuery(api.users.getAchievementByName, { name });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasAchievement !== undefined && achievement !== undefined) {
      setIsLoading(false);
    }
  }, [hasAchievement, achievement]);

  return {
    result: hasAchievement,
    isLoading,
    name: achievement?.name,
    description: achievement?.description,
  };
};
