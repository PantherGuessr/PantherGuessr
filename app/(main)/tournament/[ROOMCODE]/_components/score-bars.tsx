"use client";

import { TournamentUser } from "@/app/(main)/tournament/_components/player-slot";

type ScoreBarsRoom = {
  player1ClerkId?: string;
  player2ClerkId?: string;
  player1TotalScore: number;
  player2TotalScore: number;
};

function ScoreBar({ name, score, pct, fillClass }: { name: string; score: number; pct: number; fillClass: string }) {
  return (
    <div className="relative flex w-full items-center overflow-hidden rounded bg-secondary px-3 py-2">
      {/* Fill bar */}
      <div
        className={`absolute left-0 top-0 h-full rounded transition-[width] duration-700 ease-out ${fillClass}`}
        style={{ width: `${pct}%` }}
      />
      {/* Base text layer — uses foreground color, visible in the unfilled area */}
      <div className="relative z-10 flex w-full justify-between drop-shadow-sm">
        <span className="font-bold">{name}</span>
        <span className="font-bold">{score}</span>
      </div>
      {/* White text layer clipped to the filled area, animates with the fill */}
      <div
        className="absolute inset-0 z-20 flex items-center px-3"
        style={{
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
          transition: "clip-path 700ms ease-out",
        }}
      >
        <div className="flex w-full justify-between drop-shadow-sm">
          <span className="font-bold text-white">{name}</span>
          <span className="font-bold text-white">{score}</span>
        </div>
      </div>
    </div>
  );
}

export function ScoreBars({ room, users }: { room: ScoreBarsRoom; users: TournamentUser[] }) {
  const maxScore = Math.max(room.player1TotalScore, room.player2TotalScore, 1);
  const p1Pct = (room.player1TotalScore / maxScore) * 100;
  const p2Pct = (room.player2TotalScore / maxScore) * 100;
  const p1Name = users.find((u) => u.clerkId === room.player1ClerkId)?.username ?? "P1";
  const p2Name = users.find((u) => u.clerkId === room.player2ClerkId)?.username ?? "P2";

  return (
    <div className="flex flex-col gap-2 text-sm">
      <ScoreBar name={p1Name} score={room.player1TotalScore} pct={p1Pct} fillClass="bg-blue-500" />
      <ScoreBar name={p2Name} score={room.player2TotalScore} pct={p2Pct} fillClass="bg-orange-500" />
    </div>
  );
}
