"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

import "./_components/game-animations.css";

import InGameSidebar from "./_components/in-game-sidebar";
import DynamicInteractableMap from "./_components/map-wrapper";
import { GameProvider } from "./_context/GameContext";

const GamePage = () => {
  const { data: currentUser, isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push(`/`);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  const isMobile = useMediaQuery("(max-width: 600px");

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <div
        className={cn(
          "flex h-full w-full overflow-y-auto",
          isMobile ? "animate-body-opacity-scale-in flex-col" : "flex-row"
        )}
      >
        <InGameSidebar />
        <div className={cn("flex grow rounded-sm", isMobile ? "p-3" : "py-4 pl-0 pr-4")}>
          <DynamicInteractableMap />
        </div>
      </div>
    </GameProvider>
  );
};

export default GamePage;
