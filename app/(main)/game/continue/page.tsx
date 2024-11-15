"use client";

import { cn } from "@/lib/utils";
import InGameSidebar from "../_components/in-game-sidebar";
import InteractableMap from "../_components/interactable-map";
import { GameProvider, useGame } from "../_context/GameContext";
import { useMediaQuery } from "usehooks-ts";
import "../_components/game-animations.css";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";


const GameContinuePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [gameIdAsId, setGameIdAsId] = useState<Id<"games"> | null>(null);
  const [startingRound, setStartingRound] = useState<number | null>(null);
  const [startingScores, setStartingScores] = useState<number[] | null>(null);
  const [startingDistances, setStartingDistances] = useState<number[] | null>(null);

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
        setGameIdAsId(getOngoingGame.game as Id<"games">);
        setStartingRound(Number(getOngoingGame.currentRound));
        setStartingScores(getOngoingGame.scores?.map(score => Number(score)) ?? []);
        setStartingDistances(getOngoingGame.distances?.map(distance => Number(distance)) ?? []);
      }
    }
  }, [getOngoingGame, isAuthenticated, isLoading, router]);

  return (
    <>
      {isAuthenticated && !isLoading && gameIdAsId !== null && (
        <GameProvider gameId={gameIdAsId} startingRound={startingRound} startingScores={startingScores} startingDistances={startingDistances}>
          <GameContent isMobile={isMobile} />
        </GameProvider>
      )}
    </>
  );
};

const GameContent = ({ isMobile }: { isMobile: boolean }) => {
  const { isModalVisible } = useGame()!;

  return (
    <>
      {isModalVisible && (
        <div className="fixed z-[9999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center bg-white p-6 rounded-md">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Loading results...</p>
          </div>
        </div>
      )}
      <div className={
        cn("h-full w-full flex overflow-y-auto",
          isMobile ? "animate-body-opacity-scale-in flex-col" : "flex-row")}>
        <InGameSidebar />
        <div className={
          cn("flex grow rounded-sm",
            isMobile ? "p-3" : "py-4 pr-4 pl-0"
          )
        }>
          <InteractableMap />
        </div>
      </div>
    </>
  );
};

export default GameContinuePage;