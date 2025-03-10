"use client";

import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import InGameSidebar from "../_components/in-game-sidebar";
import InteractableMap from "../_components/interactable-map";
import { GameProvider, useGame } from "../_context/GameContext";

import "../_components/game-animations.css";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useBanCheck } from "@/hooks/use-ban-check";

type Props = {
  params: { GAMEID: string };
};

const GameIdPage = ({ params }: Props) => {
  /**
   * Sets the game ID based on the URL parameter
   * Passes in the game ID to the GameProvider
   */
  const router = useRouter();
  const gameIdAsId = params.GAMEID as Id<"games">;
  const isMobile = useMediaQuery("(max-width: 600px)");

  const gameExists = useQuery(api.game.gameExists, { gameId: gameIdAsId });

  const currentUser = useQuery(api.users.current);
  const { result: isBanned } = useBanCheck(currentUser?.clerkId);

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);

  useEffect(() => {
    if (gameExists === false) {
      router.push("/game");
    }
  }, [gameExists, router]);

  return (
    <GameProvider gameId={gameIdAsId}>
      <GameContent isMobile={isMobile} />
    </GameProvider>
  );
};

const GameContent = ({ isMobile }: { isMobile: boolean }) => {
  const { isModalVisible } = useGame()!;

  return (
    <>
      {isModalVisible && (
        <div className="fixed z-[9999] inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center bg-card text-card-foreground p-6 rounded-md">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Loading results...</p>
          </div>
        </div>
      )}
      <div
        className={cn(
          "h-full w-full flex overflow-y-auto",
          isMobile ? "animate-body-opacity-scale-in flex-col" : "flex-row"
        )}
      >
        <InGameSidebar />
        <div className={cn("flex grow rounded-sm", isMobile ? "p-3" : "py-4 pr-4 pl-0")}>
          <InteractableMap />
        </div>
      </div>
    </>
  );
};

export default GameIdPage;
