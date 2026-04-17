"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLeaderboardByGameUser } from "@/hooks/use-leaderboard-by-game-user";
import { useWeeklyChallengeGameId } from "@/hooks/use-weekly-challenge-id";

export default function WeeklyPage() {
  const router = useRouter();
  const gameId = useWeeklyChallengeGameId();

  const { data: currentUser } = useCurrentUser();
  const currentUserId = currentUser?.user._id as Id<"users"> | undefined;

  const leaderboardEntry = useLeaderboardByGameUser(gameId ? (gameId as Id<"games">) : undefined, currentUserId);

  useEffect(() => {
    if (!gameId) return;
    if (!currentUserId) return;
    if (leaderboardEntry === undefined) return;

    if (leaderboardEntry && leaderboardEntry._id) {
      router.replace(`/results/game/${gameId}`);
      return;
    }
    router.replace(`/game/${gameId}`);
  }, [gameId, leaderboardEntry, currentUserId, router]);

  if (!gameId || !currentUserId || leaderboardEntry === undefined) {
    return (
      <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-xl">Loading weekly challenge...</p>
        <LoaderCircle className="animate-spin" size={72} />
      </div>
    );
  }

  return null;
}
