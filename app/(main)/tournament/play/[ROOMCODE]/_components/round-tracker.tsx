"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function RoundTracker({
  roomId,
  onRoundAdvance,
}: {
  roomId: Id<"tournamentRooms">;
  onRoundAdvance: () => void;
}) {
  const room = useQuery(api.tournament.getTournamentRoomById, { roomId });

  // null = not yet initialized from server (skip advance on first load)
  const prevRoundRef = useRef<number | null>(null);
  // Always point at the latest callback without re-scheduling the effect
  const onRoundAdvanceRef = useRef(onRoundAdvance);

  useEffect(() => {
    onRoundAdvanceRef.current = onRoundAdvance;
  }, [onRoundAdvance]);

  useEffect(() => {
    if (!room) return;

    if (prevRoundRef.current === null) {
      // Seed from server on first load so a refresh never triggers a spurious advance
      prevRoundRef.current = room.currentRound;
      return;
    }

    if (room.currentRound > prevRoundRef.current) {
      prevRoundRef.current = room.currentRound;
      onRoundAdvanceRef.current();
    }
  }, [room?.currentRound]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
