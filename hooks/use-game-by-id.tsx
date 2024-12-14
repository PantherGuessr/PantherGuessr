import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConvexAuth, useQuery } from "convex/react";
import { Doc } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";

interface GameData {
  gameContent: Doc<"games">;
  startingRound?: number;
  startingScores?: number[];
  startingDistances?: number[];
}

const useGameById = (gameId?: Id<"games">) => {
  const { user } = useUser();
  const { isAuthenticated } = useConvexAuth();

  const [createdGameId, setCreatedGameId] = useState<Id<"games"> | null>(null);
  const isCreatingGame = useRef(false);
  const [gameData, setGameData] = useState<GameData | null>(null);

  const createGame = useMutation(api.game.createNewGame);

  // Create a new game if gameId is null
  useEffect(() => {
    if (!gameId && !createdGameId && !isCreatingGame.current) {
      isCreatingGame.current = true;
      createGame({ timeAllowedPerRound: BigInt(60) })
        .then(newGameId => {
          setCreatedGameId(newGameId);
        })
        .catch(error => {
          console.error("Error creating game:", error);
        })
        .finally(() => {
          isCreatingGame.current = false;
        });
    }
  }, [gameId, createdGameId, createGame]);

  // Fetch the ongoing game for the user
  const ongoingGame = useQuery(
    api.continuegame.getOngoingGameFromUser,
    isAuthenticated && user ? { userClerkId: user?.id } : "skip"
  );

  // Fetch the game data by ID
  const gameContent = useQuery(
    api.game.getExistingGame,
    gameId
      ? { gameId }
      : createdGameId
        ? { gameId: createdGameId }
        : "skip"
  );

  // Update gameData when gameContent or ongoingGame changes
  useEffect(() => {
    if (gameContent) {
      const data: GameData = {
        gameContent,
      };

      if (ongoingGame && ongoingGame.game === gameContent._id) {
        data.startingRound = Number(ongoingGame.currentRound);
        data.startingScores = ongoingGame.scores?.map(score => Number(score));
        data.startingDistances = ongoingGame.distances?.map(distance => Number(distance));
      }

      setGameData(data);
    }
  }, [gameContent, ongoingGame]);

  return gameData;
};

export default useGameById;