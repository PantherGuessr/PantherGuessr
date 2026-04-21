"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar/navbar";
import { NotFoundContent } from "@/components/not-found-content";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn, isValidConvexId } from "@/lib/utils";

import "../_components/game-animations.css";

import InGameSidebar from "../_components/in-game-sidebar";
import DynamicInteractableMap from "../_components/map-wrapper";
import { GameProvider, useGame } from "../_context/GameContext";

type Props = {
  params: Promise<{ GAMEID: string }>;
};

const GameContent = ({ isMobile }: { isMobile: boolean }) => {
  const { isModalVisible } = useGame()!;

  return (
    <>
      {isModalVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center rounded-md bg-card p-6 text-card-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <p>Loading results...</p>
          </div>
        </div>
      )}
      <div
        className={cn(
          "animate-body-opacity-scale-in flex h-full w-full overflow-y-auto",
          isMobile ? "flex-col" : "flex-row"
        )}
      >
        <InGameSidebar />
        <div className={cn("flex grow rounded-sm", isMobile ? "p-3" : "py-4 pl-0 pr-4")}>
          <DynamicInteractableMap />
        </div>
      </div>
    </>
  );
};

const GameIdPage = ({ params }: Props) => {
  const router = useRouter();
  const { GAMEID } = use(params);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const isValidId = isValidConvexId(GAMEID);
  const gameIdAsId = isValidId ? (GAMEID as Id<"games">) : undefined;

  const gameExists = useQuery(api.game.gameExists, gameIdAsId ? { gameId: gameIdAsId } : "skip");

  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  if (gameExists === false || !isValidId) {
    return (
      <div className="h-full">
        <Navbar />
        <div className="flex min-h-full flex-col">
          <div className="flex flex-1 flex-grow flex-col items-center justify-center gap-y-8 px-6 pt-24 text-center">
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

export default GameIdPage;
