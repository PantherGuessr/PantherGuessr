"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { api } from "@/convex/_generated/api";

import { useCurrentUser } from "@/hooks/use-current-user";

import "../_components/game-animations.css";

const GameContinuePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { data: currentUser } = useCurrentUser();

  const getOngoingGame = useQuery(
    api.continuegame.getOngoingGameFromUser,
    isAuthenticated && !isLoading && currentUser ? { userClerkId: currentUser.user.clerkId } : "skip"
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/`);
    }
    if (isAuthenticated && !isLoading) {
      if (getOngoingGame === null) {
        router.push("/game");
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
