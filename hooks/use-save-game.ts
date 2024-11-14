import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

const useSaveGame = (clerkId: string) => {
  const getOngoingGame = useQuery(api.continuegame.getOngoingGame, { userClerkId: clerkId });
  const createNewSaveGame = useMutation(api.continuegame.createNewSaveGame);
  const updateOngoingGame = useMutation(api.continuegame.updateOngoingGame);
  const deleteOngoingGame = useMutation(api.continuegame.deleteOngoingGame);

  return { getOngoingGame, createNewSaveGame, updateOngoingGame, deleteOngoingGame };
};

export default useSaveGame;