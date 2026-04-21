"use client";

import React, { createContext, useContext } from "react";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type TournamentContextValue = {
  roomId: Id<"tournamentRooms">;
  roomCode: string;
  isTournamentMode: true;
  organizerControlledRound: number;
  gameLabel: "Duel";
  onMarkerPlace: (lat: number, lng: number) => void;
  onGuessSubmit: (lat: number, lng: number) => Promise<void>;
  suppressRoundAdvance: true;
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

  const updateLiveMarker = useMutation(api.tournament.updateLiveMarker);
  const submitTournamentGuess = useMutation(api.tournament.submitTournamentGuess);

  const currentRound = room?.currentRound ?? 1;

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
        gameLabel: "Duel",
        onMarkerPlace,
        onGuessSubmit,
        suppressRoundAdvance: true,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = (): TournamentContextValue | null => {
  return useContext(TournamentContext);
};
