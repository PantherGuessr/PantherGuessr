"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { PlayerSlot, TournamentUser } from "@/app/(main)/tournament/_components/player-slot";

type WaitingLobbyRoom = {
  _id: string;
  roomCode: string;
  player1ClerkId?: string;
  player2ClerkId?: string;
};

export function SpectatorWaitingLobby({
  room,
  users,
  isOrganizer,
  onStartGame,
}: {
  room: WaitingLobbyRoom;
  users: TournamentUser[];
  isOrganizer: boolean;
  onStartGame: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <Link href="/" className="absolute left-4 top-4">
        <Button variant="outline" size="sm" className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>
      <div className="flex flex-row items-center gap-2">
        <Logo logoDimensions={100} textOptions="text-3xl" badge="Tournament" />
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Room Code</p>
        <p className="text-5xl font-bold tracking-widest">{room.roomCode}</p>
      </div>
      <div className="flex gap-16">
        <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} size="large" />
        <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} size="large" />
      </div>
      {isOrganizer && room.player1ClerkId && room.player2ClerkId && (
        <Button onClick={onStartGame} size="lg">
          Start Game
        </Button>
      )}
    </div>
  );
}
