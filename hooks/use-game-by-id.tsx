import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

const useGameById = (gameId?: Id<"games">) => {
  const [createdGameId, setCreatedGameId] = useState<Id<"games"> | null>(null);
  const gameData = useQuery(api.game.getExistingGame, gameId ? { gameId } : createdGameId ? { gameId: createdGameId } : "skip");
  const createGame = useMutation(api.game.createNewGame);
  const [shouldCreateGame, setShouldCreateGame] = useState(false);

  useEffect(() => {
    console.log("Checking if game should be created:", { gameData, gameId, shouldCreateGame });
    if (!gameData && !gameId && !createdGameId && !shouldCreateGame) {
      console.log("Setting shouldCreateGame to true");
      setShouldCreateGame(true);
    }
  }, [gameData, gameId, createdGameId, shouldCreateGame]);

  useEffect(() => {
    if (shouldCreateGame) {
      console.log("Creating game...");
      createGame({ timeAllowedPerRound: BigInt(60) })
        .then(response => {
          console.log('Game created with ID:', response);
          setCreatedGameId(response);
          setShouldCreateGame(false);
        })
        .catch(error => {
          console.error('Error creating game:', error);
        });
    }
  }, [shouldCreateGame, createGame]);

  return gameData;
};

export default useGameById;