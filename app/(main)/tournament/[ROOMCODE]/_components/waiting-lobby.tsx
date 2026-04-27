"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Home } from "lucide-react";

import { PlayerSlot, TournamentUser } from "@/app/(main)/tournament/_components/player-slot";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

type WaitingLobbyRoom = {
  _id: string;
  roomCode: string;
  player1ClerkId?: string;
  player2ClerkId?: string;
  guessCountdownSeconds?: number;
};

export function SpectatorWaitingLobby({
  room,
  users,
  isOrganizer,
  onStartGame,
  onUpdateCountdown,
}: {
  room: WaitingLobbyRoom;
  users: TournamentUser[];
  isOrganizer: boolean;
  onStartGame: () => void;
  onUpdateCountdown?: (seconds: number) => void;
}) {
  const [codeVisible, setCodeVisible] = useState(true);
  const serverSeconds = room.guessCountdownSeconds ?? 15;
  const [localSeconds, setLocalSeconds] = useState(serverSeconds);

  // Stay in sync if another organizer session changes it
  useEffect(() => {
    setLocalSeconds(serverSeconds);
  }, [serverSeconds]);

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
        <div className="flex items-center justify-center gap-2">
          <p className="text-5xl font-bold tracking-widest">{codeVisible ? room.roomCode : "••••••"}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCodeVisible((v) => !v)}
            aria-label={codeVisible ? "Hide room code" : "Show room code"}
          >
            {codeVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-16">
        <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} size="large" color="p1color" />
        <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} size="large" color="p2color" />
      </div>

      {isOrganizer && onUpdateCountdown && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Auto-submit countdown: <span className="font-semibold text-foreground">{localSeconds}s</span>
          </p>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={localSeconds}
            onChange={(e) => setLocalSeconds(Number(e.target.value))}
            onPointerUp={(e) => onUpdateCountdown(Number((e.target as HTMLInputElement).value))}
            className="w-48 accent-primary"
          />
          <div className="flex w-48 justify-between text-xs text-muted-foreground">
            <span>5s</span>
            <span>60s</span>
          </div>
        </div>
      )}

      {isOrganizer && room.player1ClerkId && room.player2ClerkId && (
        <Button onClick={onStartGame} size="lg">
          Start Game
        </Button>
      )}
    </div>
  );
}
