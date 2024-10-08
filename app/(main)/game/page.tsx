"use client";

import InGameSidebar from "./_components/in-game-sidebar";
import InteractableMap from "./_components/interactable-map";

const GamePage = () => {
    return (
        <div className="h-full w-full flex overflow-y-auto">
            <InGameSidebar />
            <div className="flex grow">
                <InteractableMap />
            </div>
        </div>
    )
}
 
export default GamePage;