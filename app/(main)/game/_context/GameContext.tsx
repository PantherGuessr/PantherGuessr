import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { createContext, useState, useEffect, useContext } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface GameContextType {
    levels: Id<"levels">[];
    round: number;
    score: number;
    currentLevel: Id<"levels"> | null;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [levels, setLevels] = useState<Id<"levels">[]>([]);
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const [currentLevel, setCurrentLevel] = useState<Id<"levels"> | null>(null);

    const ids = useQuery(api.game.getRandomLevels);
    
    useEffect(() => {
        if (ids) {
            setLevels(ids);
        }
    }, [ids]);

    return (
        <GameContext.Provider value={{ levels, round, score, currentLevel }}>
            {children}
        </GameContext.Provider>
    );
};

// Export the hook so that components can use game context
export const useGame = () => useContext(GameContext);