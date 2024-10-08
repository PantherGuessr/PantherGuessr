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
            setCurrentSrcUrl(imageSrc ?? "");
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
        <GameContext.Provider value={{ levels, currentRound, score, currentLevelId, currentImageSrcUrl }}>
            {children}
        </GameContext.Provider>
    );
};

// Export the hook so that components can use game context
export const useGame = () => useContext(GameContext);