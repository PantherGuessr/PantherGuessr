"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayerSlot, TournamentUser } from "@/app/(main)/tournament/_components/player-slot";

type GameOverRoom = {
  _id: string;
  player1ClerkId?: string;
  player2ClerkId?: string;
  player1TotalScore: number;
  player2TotalScore: number;
};

export function SpectatorGameOver({
  room,
  users,
  isOrganizer,
  onPlayAgain,
  onNewLobby,
}: {
  room: GameOverRoom;
  users: TournamentUser[];
  isOrganizer: boolean;
  onPlayAgain: () => void;
  onNewLobby: () => void;
}) {
  const p1Wins = room.player1TotalScore > room.player2TotalScore;
  const tied = room.player1TotalScore === room.player2TotalScore;
  const winnerUser = users.find(
    (u) => u.clerkId === (p1Wins ? room.player1ClerkId : room.player2ClerkId)
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <Link href="/" className="absolute left-4 top-4">
        <Button variant="outline" size="sm" className="gap-2">
          <Home className="h-4 w-4" />
          Home
        </Button>
      </Link>
      <h1 className="text-3xl font-bold">Game Over</h1>
      {tied ? (
        <p className="text-xl">It&apos;s a tie!</p>
      ) : (
        <p className="text-xl font-semibold">{winnerUser?.username ?? "Winner"} wins!</p>
      )}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-center gap-3">
          <PlayerSlot
            clerkId={room.player1ClerkId}
            label="Player 1"
            users={users}
            size="large"
            color="p1color"
          />
          <p className="text-4xl font-bold">{room.player1TotalScore}</p>
          <span className={`text-lg font-bold text-green-500 ${p1Wins && !tied ? "visible" : "invisible"}`}>
            Winner!
          </span>
        </div>
        <span className="self-center text-2xl font-bold text-muted-foreground">vs</span>
        <div className="flex flex-col items-center gap-3">
          <PlayerSlot
            clerkId={room.player2ClerkId}
            label="Player 2"
            users={users}
            size="large"
            color="p2color"
          />
          <p className="text-4xl font-bold">{room.player2TotalScore}</p>
          <span className={`text-lg font-bold text-green-500 ${!p1Wins && !tied ? "visible" : "invisible"}`}>
            Winner!
          </span>
        </div>
      </div>
      {isOrganizer && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={onPlayAgain}>
            Play Again
          </Button>
          <Button size="lg" variant="outline" onClick={onNewLobby}>
            New Lobby
          </Button>
        </div>
      )}
    </div>
  );
}
