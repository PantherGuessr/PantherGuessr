"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="animate-spin w-20 h-20" />
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
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
    </GameProvider>
  );
};

export default GamePage;
