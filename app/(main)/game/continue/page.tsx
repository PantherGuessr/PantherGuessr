"use client";

import "../_components/game-animations.css";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";


const GameContinuePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();

  /**
   * Attempts to fetch the ongoing game for the user
   */
  const getOngoingGame = useQuery(api.continuegame.getOngoingGameFromUser, 
    isAuthenticated && !isLoading ? { userClerkId: user?.id ?? "" } : "skip"
  );

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (getOngoingGame === null) {
        router.push('/game'); // If there is no ongoing game, redirect to make a new one.
      } else if (getOngoingGame) {
        router.push(`/game/${getOngoingGame.game}`);
      }
    }
  }, [getOngoingGame, isAuthenticated, isLoading, router]);

  return (
    <>
      <Loader2 className="h-6 w-6 animate-spin" />
    </>
  );
};

export default GameContinuePage;