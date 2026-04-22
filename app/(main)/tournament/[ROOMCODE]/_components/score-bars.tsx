"use client";

import { TournamentUser } from "@/app/(main)/tournament/_components/player-slot";

type ScoreBarsRoom = {
  player1ClerkId?: string;
  player2ClerkId?: string;
  player1TotalScore: number;
  player2TotalScore: number;
};

export function ScoreBars({ room, users }: { room: ScoreBarsRoom; users: TournamentUser[] }) {
  const maxScore = Math.max(room.player1TotalScore, room.player2TotalScore, 1);
  const p1Pct = (room.player1TotalScore / maxScore) * 100;
  const p2Pct = (room.player2TotalScore / maxScore) * 100;
  const p1Name = users.find((u) => u.clerkId === room.player1ClerkId)?.username ?? "P1";
  const p2Name = users.find((u) => u.clerkId === room.player2ClerkId)?.username ?? "P2";

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="relative flex w-full items-center justify-start overflow-hidden rounded bg-secondary px-3 py-2">
        <div className="relative z-10 flex w-full justify-between">
          <span className="font-medium text-white">{p1Name}</span>
          <span className="font-bold text-white">{room.player1TotalScore}</span>
        </div>
        <div
          className="absolute left-0 top-0 h-full rounded bg-blue-500 transition-[width] duration-700 ease-out"
          style={{ width: `${p1Pct}%` }}
        />
      </div>
      <div className="relative flex w-full items-center justify-start overflow-hidden rounded bg-secondary px-3 py-2">
        <div className="relative z-10 flex w-full justify-between">
          <span className="font-medium text-white">{p2Name}</span>
          <span className="font-bold text-white">{room.player2TotalScore}</span>
        </div>
        <div
          className="absolute left-0 top-0 h-full rounded bg-orange-500 transition-[width] duration-700 ease-out"
          style={{ width: `${p2Pct}%` }}
        />
      </div>
    </div>
  );
}
