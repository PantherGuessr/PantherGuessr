import { useQuery } from "convex/react";
import { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { LeaderboardType } from "@/convex/leaderboard";

export function useLeaderboard(type: LeaderboardType) {
  // Get current user
  const currentUser = useQuery(api.users.current);

  // Get top 25 users based on type
  const topUsersByStreak = useQuery(api.leaderboard.getTopUsersByStreak, type === "streak" ? {} : "skip");
  const topUsersByLevel = useQuery(api.leaderboard.getTopUsersByLevel, type === "level" ? {} : "skip");
  const topUsersByTotalPoints = useQuery(
    api.leaderboard.getTopUsersByTotalPoints,
    type === "totalPoints" ? {} : "skip"
  );

  // Get user rank
  const userRank = useQuery(
    api.leaderboard.getUserRank,
    currentUser?.clerkId ? { clerkId: currentUser.clerkId, type } : "skip"
  );

  // Determine the correct data based on type
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

  // Check if user is in top 25
  const userInTop25 = useMemo(() => {
    if (!topUsers || !currentUser) return false;
    return topUsers.some((user: Doc<"users">) => user._id === currentUser._id);
  }, [topUsers, currentUser]);

  // Create display entries (top 25 + current user if not in top 25)
  const displayEntries = useMemo(() => {
    if (!topUsers) return [];
    if (!currentUser || userInTop25) return topUsers;

    // Add current user to the list if not in top 25
    return [...topUsers, currentUser];
  }, [topUsers, currentUser, userInTop25]);

  const isLoading = topUsers === undefined || currentUser === undefined || userRank === undefined;

  return {
    topUsers: topUsers || [],
    currentUser,
    userRank: userRank !== undefined ? (userRank > 0 ? userRank : -1) : null,
    userInTop25,
    displayEntries,
    isLoading,
  };
}
