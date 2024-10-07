"use client";

import InGameSidebar from "./_components/in-game-sidebar";
import InteractableMap from "./_components/interactable-map";

const GamePage = () => {
    return (
        <div className="h-full flex overflow-y-auto">
            <InGameSidebar />
            <div className="flex-1">
                <InteractableMap />
            </div>
        </div>
    )
}
 
export default GamePage;