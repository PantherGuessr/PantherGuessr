"use client";

import { Button } from "@/components/ui/button";

type OrganizerControlsRoom = {
  status: string;
  currentRound: number;
};

export function OrganizerControls({
  room,
  bothSubmitted,
  onShowRoundSummary,
  onAdvanceToNextRound,
}: {
  room: OrganizerControlsRoom;
  bothSubmitted: boolean;
  onShowRoundSummary: () => void;
  onAdvanceToNextRound: () => void;
}) {
  return (
    <div className="mt-auto flex flex-col gap-2">
      {room.status === "round_active" && (
        <Button onClick={onShowRoundSummary} disabled={!bothSubmitted} size="sm">
          Show Results
        </Button>
      )}
      {room.status === "round_summary" && (
        <Button onClick={onAdvanceToNextRound} size="sm">
          {room.currentRound >= 5 ? "End Tournament" : "Next Round"}
        </Button>
      )}
    </div>
  );
}
