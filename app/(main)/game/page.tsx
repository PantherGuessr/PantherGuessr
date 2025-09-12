"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

import "./_components/game-animations.css";

import { api } from "@/convex/_generated/api";
import { useBanCheck } from "@/hooks/use-ban-check";
import { cn } from "@/lib/utils";

import InGameSidebar from "./_components/in-game-sidebar";
import DynamicInteractableMap from "./_components/map-wrapper";
import { GameProvider } from "./_context/GameContext";

const GamePage = () => {
  const { isLoading: isConvexLoading, isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.current);
  const { result: isBanned, isLoading: isBanCheckLoading } = useBanCheck(currentUser?.clerkId);

  const router = useRouter();

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);

  useEffect(() => {
    if (!isConvexAuthenticated) {
      router.push(`/`);
    }
  }, [isConvexAuthenticated, isConvexLoading, router]);

  const isMobile = useMediaQuery("(max-width: 600px");

  if (!currentUser && isBanCheckLoading) {
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
