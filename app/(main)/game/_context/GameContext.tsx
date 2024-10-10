import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { createContext, useState, useEffect, useContext } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface GameContextType {
    levels: Id<"levels">[];
    currentRound: number;
    score: number;
    currentLevelId: Id<"levels"> | null;
    currentImageSrcUrl: string;
    markerHasBeenPlaced: boolean;
    setMarkerHasBeenPlaced: (marker: boolean) => void;
    isSubmittingGuess: boolean;
    setIsSubmittingGuess: (button: boolean) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [levels, setLevels] = useState<Id<"levels">[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    const [currentLevelId, setCurrentLevel] = useState<Id<"levels"> | null>(null);
    const [currentImageSrcUrl, setCurrentSrcUrl] = useState("");
    const [cacheBuster, setCacheBuster] = useState(Math.random());
    const [markerHasBeenPlaced, setMarkerHasBeenPlaced] = useState(false);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);

    const ids = useQuery(api.game.getRandomLevels, { cacheBuster });
    const imageSrc = useQuery(api.game.getImageSrc, currentLevelId ? { id: currentLevelId } : "skip");
    
    useEffect(() => {
        if (ids) {
            setLevels(ids);
            setCurrentRound(1);
            setCurrentLevel(ids[0]);
        }
    }, [ids]);

    useEffect(() => {
        if(currentLevelId) {
            setCurrentSrcUrl(imageSrc ?? "/Invalid-Image.jpg");
        }
    }, [currentLevelId, imageSrc]);

    if (ids === undefined || (currentLevelId && imageSrc === undefined)) {
        // The query is still loading
        /**
         * TODO: Add skeleton here @Daniel
         */
        return <div>Loading...</div>;
    }

    return (
        <GameContext.Provider value={{ levels, currentRound, score, currentLevelId, currentImageSrcUrl, markerHasBeenPlaced, setMarkerHasBeenPlaced, isSubmittingGuess, setIsSubmittingGuess }}>
            {children}
        </GameContext.Provider>
    );
};

// Export the hook so that components can use game context
export const useGame = () => useContext(GameContext);