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
      // should never be nonexistent
      <div className="w-full h-full min-h-screen flex flex-row p-8 text-center items-center justify-center">
        Finding weekly challenge...
      </div>
    );
  }

  // show loading challenge
  return <div className="w-full h-full min-h-screen flex flex-row p-8 text-center items-center justify-center">Loading weekly challenge...</div>;
}
