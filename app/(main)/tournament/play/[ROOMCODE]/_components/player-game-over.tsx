"use client";

import { useRouter } from "next/navigation";

import { PlayerSlot, TournamentUser } from "@/app/(main)/tournament/_components/player-slot";
import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";

type PlayerGameOverRoom = {
  player1ClerkId?: string;
  player2ClerkId?: string;
  player1TotalScore: number;
  player2TotalScore: number;
};

export function PlayerGameOver({
  room,
  users,
  clerkId,
  roomCode,
}: {
  room: PlayerGameOverRoom;
  users: TournamentUser[];
  clerkId: string;
  roomCode: string;
}) {
  const router = useRouter();
  const isP1 = clerkId === room.player1ClerkId;
  const myScore = isP1 ? room.player1TotalScore : room.player2TotalScore;
  const theirScore = isP1 ? room.player2TotalScore : room.player1TotalScore;
  const tied = myScore === theirScore;
  const p1Wins = room.player1TotalScore > room.player2TotalScore;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pt-24 text-center">
        <div className="flex flex-row items-center gap-2 pb-4">
          <Logo logoDimensions={100} textOptions="text-2xl" badge="Tournament" stackOnMobile={true} />
        </div>
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} size="large" color="p1color" />
            <p className="text-4xl font-bold">{room.player1TotalScore}</p>
            <span className={`text-lg font-bold text-green-500 ${p1Wins && !tied ? "visible" : "invisible"}`}>
              Winner!
            </span>
          </div>
          <span className="self-center text-xl text-muted-foreground">vs</span>
          <div className="flex flex-col items-center gap-3">
            <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} size="large" color="p2color" />
            <p className="text-4xl font-bold">{room.player2TotalScore}</p>
            <span className={`text-lg font-bold text-green-500 ${!p1Wins && !tied ? "visible" : "invisible"}`}>
              Winner!
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => router.push(`/tournament/play/${roomCode}`)} variant="default">
            Stay in Lobby
          </Button>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to Home
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">The organizer can restart this lobby for a rematch.</p>
      </div>
      <Footer />
    </div>
  );
}
