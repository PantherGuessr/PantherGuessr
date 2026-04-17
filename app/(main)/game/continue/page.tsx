"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

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
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Loader2 className="h-20 w-20 animate-spin" />
    </div>
  );
};

export default GameContinuePage;
