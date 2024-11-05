import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Id } from '@/convex/_generated/dataModel';

const useGameById = (gameId?: Id<"games">) => {
    // State to store the game ID (either provided or created)
    const [currentGameId, setCurrentGameId] = useState<Id<"games"> | undefined>(gameId);

    // Query existing game if ID is available
    const existingGame = useQuery(api.game.getExistingGame, 
        currentGameId ? { gameId: currentGameId } : "skip"
    );

    // Mutation to create a new game
    const createNewGame = useMutation(api.game.createNewGame);

    // State to track if game creation has been attempted
    const [gameCreated, setGameCreated] = useState(false);

    // Create new game if no ID provided and not already created
    useEffect(() => {
        const createGame = async () => {
            if (!currentGameId && !gameCreated) {
                try {
                    // Default 30 seconds per round
                    const newGameId = await createNewGame({ timeAllowedPerRound: BigInt(30) });
                    setCurrentGameId(newGameId);
                    setGameCreated(true);
                } catch (error) {
                    console.error("Error creating new game:", error);
                }
            }
        };

        createGame();
    }, [currentGameId, gameCreated, createNewGame]);

    return existingGame;
};

export default useGameById;