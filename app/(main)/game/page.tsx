"use client";

import { cn } from "@/lib/utils";
import InGameSidebar from "./_components/in-game-sidebar";
import InteractableMap from "./_components/interactable-map";
import { GameProvider } from "./_context/GameContext";
import { useMediaQuery } from "usehooks-ts";
import "./_components/game-animations.css";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBanCheck } from "@/hooks/use-ban-check";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const GamePage = () => {
  const currentUser = useQuery(api.users.current);
  const { result: isBanned, isLoading: isBanCheckLoading } = useBanCheck(currentUser?.clerkId);

  const router = useRouter();

  useEffect(() => {
    if(isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);
  
  const isMobile = useMediaQuery("(max-width: 600px");

  if(!currentUser && isBanCheckLoading) {
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
    </GameProvider>
  );
};
 
export default GamePage;