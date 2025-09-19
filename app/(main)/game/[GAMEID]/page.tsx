"use client";

import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

import { Footer } from "@/components/footer";
import { NotFoundContent } from "@/components/not-found-content";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { useBanCheck } from "@/hooks/use-ban-check";

import { cn, isValidConvexId } from "@/lib/utils";

import "../_components/game-animations.css";
import InGameSidebar from "../_components/in-game-sidebar";
import DynamicInteractableMap from "../_components/map-wrapper";
import { GameProvider, useGame } from "../_context/GameContext";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar/navbar";

type Props = {
  params: Promise<{ GAMEID: string }>;
};

const GameIdPage = ({ params }: Props) => {
  const router = useRouter();
  const { GAMEID } = use(params);
  const isMobile = useMediaQuery("(max-width: 600px)");

  // validate convex ID format
  const isValidId = isValidConvexId(GAMEID);
  const gameIdAsId = isValidId ? (GAMEID as Id<"games">) : undefined;

  const gameExists = useQuery(api.game.gameExists, gameIdAsId ? { gameId: gameIdAsId } : "skip");

  const currentUser = useQuery(api.users.current);
  const { result: isBanned } = useBanCheck(currentUser?.clerkId);

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);

  if (!gameExists || !isValidId) {
    return (
      <div className="h-full">
        <Navbar />
        <div className="min-h-full flex flex-col">
          <div className="flex flex-col flex-grow items-center justify-center text-center gap-y-8 flex-1 px-6 pt-24">
            <NotFoundContent
              title="Game Not Found"
              description="The game you are looking for does not exist. It may have been deleted or the ID is incorrect."
            />
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <GameProvider gameId={gameIdAsId!}>
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
          <DynamicInteractableMap />
        </div>
      </div>
    </>
  );
};

export default GameIdPage;
