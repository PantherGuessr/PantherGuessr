"use client";

import { useQuery } from "convex/react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useLeaderboardByGameUser } from "@/hooks/use-leaderboard-by-game-user";
import { useWeeklyChallengeGameId } from "@/hooks/use-weekly-challenge-id";

export default function WeeklyPage() {
  const router = useRouter();
  const gameId = useWeeklyChallengeGameId();

  // Get current user
  const currentUser = useQuery(api.users.current);

  // Get leaderboard entry for this weekly game and user
  // You may want to handle loading state for currentUser if needed
  const currentUserId = currentUser?._id as Id<"users"> | undefined;

  // Get leaderboard entry for this weekly game and user using the new hook
  const leaderboardEntry = useLeaderboardByGameUser(gameId ? (gameId as Id<"games">) : undefined, currentUserId);

  useEffect(() => {
    // wait for gameId, currentUserId, and leaderboardEntry to load
    if (!gameId) return;
    if (!currentUserId) return;
    if (leaderboardEntry === undefined) return;

    // redirect to results if completed weekly challenge
    if (leaderboardEntry && leaderboardEntry._id) {
      router.replace(`/results/game/${gameId}`);
      return;
    }
    // otherwise redirect to game page
    router.replace(`/game/${gameId}`);
  }, [gameId, leaderboardEntry, currentUserId, router]);

  // show loading elements while waiting
  if (!gameId || !currentUserId || leaderboardEntry === undefined) {
    return (
      <div className="w-full h-full min-h-screen flex flex-col p-8 text-center items-center justify-center gap-4">
        <p className="text-xl">Loading weekly challenge...</p>
        <LoaderCircle className="animate-spin" size={72} />
      </div>
    );
  }

  // shouldn't ever reach but here just in case
  return null;
}
