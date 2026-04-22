import { useEffect, useMemo, useRef, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface GameData {
  gameContent: Doc<"games">;
  startingRound?: number;
  startingScores?: number[];
  startingDistances?: number[];
}

const useGameById = (gameId?: Id<"games">, clerkId?: string) => {
  const { isAuthenticated } = useConvexAuth();

  const [createdGameId, setCreatedGameId] = useState<Id<"games"> | null>(null);
  const isCreatingGame = useRef(false);

  const createGame = useMutation(api.game.createNewGame);

  // Create a new game if gameId is null
  useEffect(() => {
    if (!gameId && !createdGameId && !isCreatingGame.current) {
      isCreatingGame.current = true;
      createGame({ timeAllowedPerRound: BigInt(60) })
        .then((newGameId) => {
          setCreatedGameId(newGameId);
        })
        .catch((error) => {
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
    isAuthenticated && clerkId ? { userClerkId: clerkId } : "skip"
  );

  // Fetch the game data by ID
  const gameContent = useQuery(
    api.game.getExistingGame,
    gameId ? { gameId } : createdGameId ? { gameId: createdGameId } : "skip"
  );

  // Derive gameData from gameContent and ongoingGame
  const gameData = useMemo<GameData | null>(() => {
    if (!gameContent) return null;

    // Wait until clerkId is loaded and ongoingGame has settled before returning data.
    // gameData returns before we know a resume state without this fix, causes a flash of round 1 data
    if (isAuthenticated && (!clerkId || ongoingGame === undefined)) return null;

    const data: GameData = { gameContent };

    if (ongoingGame && ongoingGame.game === gameContent._id) {
      data.startingRound = Number(ongoingGame.currentRound);
      data.startingScores = ongoingGame.scores?.map((score) => Number(score));
      data.startingDistances = ongoingGame.distances?.map((distance) => Number(distance));
    }

    return data;
  }, [gameContent, ongoingGame, isAuthenticated, clerkId]);

  return gameData;
};

export default useGameById;
