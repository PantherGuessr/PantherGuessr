"use client";

import { cn } from "@/lib/utils";
import InGameSidebar from "./_components/in-game-sidebar";
import InteractableMap from "./_components/interactable-map";
import { GameProvider } from "./_context/GameContext";
import { useMediaQuery } from "usehooks-ts";

const GamePage = () => {

    const isMobile = useMediaQuery("(max-width: 600px");

    return (
        <GameProvider>
            <div className={
                cn("h-full w-full flex overflow-y-auto",
                    isMobile ? "flex-col" : "flex-row")}>
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
    )
}
 
export default GamePage;