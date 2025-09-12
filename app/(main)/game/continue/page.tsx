"use client";

import "../_components/game-animations.css";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/convex/_generated/api";

const GameContinuePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();

  /**
   * Attempts to fetch the ongoing game for the user
   */
  const getOngoingGame = useQuery(
    api.continuegame.getOngoingGameFromUser,
    isAuthenticated && !isLoading ? { userClerkId: user?.id ?? "" } : "skip"
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/`);
    }
    if (isAuthenticated && !isLoading) {
      if (getOngoingGame === null) {
        router.push("/game"); // If there is no ongoing game, redirect to make a new one.
      } else if (getOngoingGame) {
        router.push(`/game/${getOngoingGame.game}`);
      }
    }
  }, [getOngoingGame, isAuthenticated, isLoading, router]);

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <Loader2 className="h-20 w-20 animate-spin" />
    </div>
  );
};

export default GameContinuePage;
