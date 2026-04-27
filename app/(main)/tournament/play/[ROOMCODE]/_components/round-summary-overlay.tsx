"use client";

import { Loader2 } from "lucide-react";

export function RoundSummaryOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-6 text-card-foreground shadow-xl">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm font-medium">Waiting for next round...</p>
      </div>
    </div>
  );
}
