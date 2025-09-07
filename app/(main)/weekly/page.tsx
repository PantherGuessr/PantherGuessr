"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeeklyChallengeGameId } from "@/hooks/use-weekly-challenge-id";

export default function WeeklyPage() {
  const router = useRouter();
  const gameId = useWeeklyChallengeGameId();

  useEffect(() => {
    if (gameId) {
      router.replace(`/game/${gameId}`);
    }
  }, [gameId, router]);

  if (gameId === null) {
    return (
      <div className="flex flex-row p-8 text-center items-center justify-center">
        No weekly challenge is currently active.
      </div>
    );
  }

  // Optionally, show a loading spinner while waiting for gameId
  return <div className="p-8 text-center">Loading weekly challenge...</div>;
}
