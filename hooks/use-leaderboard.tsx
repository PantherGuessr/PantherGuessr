import { useMemo } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { LeaderboardType } from "@/convex/leaderboard";
import { useCurrentUser } from "./use-current-user";

export function useLeaderboard(type: LeaderboardType) {
  const { data: currentUserProfile } = useCurrentUser();
  const currentUser = currentUserProfile?.user ?? null;

  const topUsersByStreak = useQuery(api.leaderboard.getTopUsersByStreak, type === "streak" ? {} : "skip");
  const topUsersByLevel = useQuery(api.leaderboard.getTopUsersByLevel, type === "level" ? {} : "skip");
  const topUsersByTotalPoints = useQuery(
    api.leaderboard.getTopUsersByTotalPoints,
    type === "totalPoints" ? {} : "skip"
  );

  const userRank = useQuery(
    api.leaderboard.getUserRank,
    currentUser?.clerkId ? { clerkId: currentUser.clerkId, type } : "skip"
  );

  const topUsers = useMemo(() => {
    switch (type) {
      case "streak":
        return topUsersByStreak;
      case "level":
        return topUsersByLevel;
      case "totalPoints":
        return topUsersByTotalPoints;
      default:
        return undefined;
    }
  }, [type, topUsersByStreak, topUsersByLevel, topUsersByTotalPoints]);

  const userInTop25 = useMemo(() => {
    if (!topUsers || !currentUser) return false;
    return topUsers.some((user: Doc<"users">) => user._id === currentUser._id);
  }, [topUsers, currentUser]);

  const displayEntries = useMemo(() => {
    if (!topUsers) return [];
    if (!currentUser || userInTop25) return topUsers;
    return [...topUsers, currentUser];
  }, [topUsers, currentUser, userInTop25]);

  const isLoading = topUsers === undefined || currentUserProfile === undefined || (!!currentUser?.clerkId && userRank === undefined);

  return {
    topUsers: topUsers || [],
    currentUser,
    userRank: userRank !== undefined ? (userRank > 0 ? userRank : -1) : null,
    userInTop25,
    displayEntries,
    isLoading,
  };
}
