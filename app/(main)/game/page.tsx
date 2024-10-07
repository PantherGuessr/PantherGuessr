"use client";

import InGameSidebar from "./_components/in-game-sidebar";
import InteractableMap from "./_components/interactable-map";
import { GameProvider } from "./_context/GameContext";

const GamePage = () => {
    return (
        <GameProvider>
            <div className="h-full flex overflow-y-auto">
                <InGameSidebar />
                <div className="flex-1">
                    <InteractableMap />
                </div>
            </div>
        </GameProvider>
    )
}
 
export default GamePage;