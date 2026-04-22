"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function RoundTracker({
  roomId,
  localRound,
  onRoundAdvance,
}: {
  roomId: Id<"tournamentRooms">;
  localRound: number;
  onRoundAdvance: () => void;
}) {
  const room = useQuery(api.tournament.getTournamentRoomById, { roomId });
  const prevRound = useRef(localRound);

  useEffect(() => {
    if (!room) return;
    if (room.currentRound > prevRound.current) {
      prevRound.current = room.currentRound;
      onRoundAdvance();
    }
  }, [room?.currentRound, onRoundAdvance, room]);

  return null;
}
