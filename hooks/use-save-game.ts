import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

const useSaveGame = (gameId: Id<"games">, userClerkId: string) => {

  const saveGame = async (gameState: {
    currentRound: number,
    timeLeftInRound?: number,
    totalTimeTaken: number
  }) => {
    try {
      await updateOngoingGameOrCreate({
        gameId,
        userClerkId,
        currentRound: BigInt(gameState.currentRound),
        timeLeftInRound: gameState.timeLeftInRound ? BigInt(gameState.timeLeftInRound) : undefined,
        totalTimeTaken: BigInt(gameState.totalTimeTaken)
      });
    } catch (error) {
      console.error("Failed to save game:", error);
    }
  };

  return { saveGame };
};

export default useSaveGame;