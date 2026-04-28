"use client";

import { PlayerSlot, PlayerStatus, TournamentUser } from "@/app/(main)/tournament/_components/player-slot";
import { Logo } from "@/components/logo";

type SpectatorHeaderRoom = {
  player1ClerkId?: string;
  player2ClerkId?: string;
  currentRound: number;
};

export function SpectatorHeader({
  room,
  users,
  p1Status,
  p2Status,
}: {
  room: SpectatorHeaderRoom;
  users: TournamentUser[];
  p1Status: PlayerStatus;
  p2Status: PlayerStatus;
}) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} status={p1Status} color="p1color" />
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center gap-2">
          <Logo logoDimensions={100} textOptions="text-2xl" badge="Tournament" stackOnMobile={true} />
        </div>
        <span className="text-sm text-muted-foreground">Round {room.currentRound}/5</span>
      </div>
      <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} status={p2Status} color="p2color" />
    </div>
  );
}
