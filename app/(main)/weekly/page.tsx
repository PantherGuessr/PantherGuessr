"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import Spinner from "@/components/spinner";
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
      <div className="w-full h-full min-h-screen flex flex-col p-8 text-center items-center justify-center gap-4">
        <p className="text-xl">Finding weekly challenge...</p>
        <LoaderCircle className="animate-spin" size={72} />
      </div>
    );
  }

  // show loading challenge
  return (
    <div className="w-full h-full min-h-screen flex flex-col p-8 text-center items-center justify-center gap-4">
      <p className="text-xl">Loading weekly challenge...</p>
      <LoaderCircle className="animate-spin" size={72} />
    </div>
  );
}
