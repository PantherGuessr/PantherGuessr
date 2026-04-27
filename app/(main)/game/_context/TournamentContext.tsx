"use client";

import React, { createContext, useContext } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";

export type TournamentContextValue = {
  roomId: Id<"tournamentRooms">;
  roomCode: string;
  isTournamentMode: true;
  organizerControlledRound: number;
  gameLabel: "Tournament";
  onMarkerPlace: (lat: number, lng: number) => void;
  onGuessSubmit: (lat: number, lng: number) => Promise<void>;
  suppressRoundAdvance: true;
  hasSubmittedThisRound: boolean;
};

const TournamentContext = createContext<TournamentContextValue | null>(null);

export const TournamentProvider = ({
  children,
  roomId,
  roomCode,
}: {
  children: React.ReactNode;
  roomId: Id<"tournamentRooms">;
  roomCode: string;
}) => {
  const room = useQuery(api.tournament.getTournamentRoomById, { roomId });
  const { data: currentUser } = useCurrentUser();

  const currentRound = room?.currentRound ?? 1;

  const guesses = useQuery(
    api.tournament.getTournamentGuessesForRound,
    room ? { roomId, round: currentRound } : "skip"
  );

  const clerkId = currentUser?.user.clerkId;
  const myGuess = guesses?.find((g) => g.playerClerkId === clerkId);
  const hasSubmittedThisRound = !!myGuess?.hasSubmitted;

  const updateLiveMarker = useMutation(api.tournament.updateLiveMarker);
  const submitTournamentGuess = useMutation(api.tournament.submitTournamentGuess);

  const onMarkerPlace = (lat: number, lng: number) => {
    updateLiveMarker({ roomId, round: currentRound, lat, lng }).catch(console.error);
  };

  const onGuessSubmit = async (lat: number, lng: number) => {
    await submitTournamentGuess({ roomId, round: currentRound, lat, lng });
  };

  return (
    <TournamentContext.Provider
      value={{
        roomId,
        roomCode,
        isTournamentMode: true,
        organizerControlledRound: currentRound,
        gameLabel: "Tournament",
        onMarkerPlace,
        onGuessSubmit,
        suppressRoundAdvance: true,
        hasSubmittedThisRound,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = (): TournamentContextValue | null => {
  return useContext(TournamentContext);
};
