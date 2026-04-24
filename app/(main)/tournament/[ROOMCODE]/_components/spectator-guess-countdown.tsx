"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

import { cn } from "@/lib/utils";

export function SpectatorGuessCountdown({
  firstGuessAt,
  guessCountdownSeconds,
  bothSubmitted,
  guessesLoaded,
}: {
  firstGuessAt: number | undefined;
  guessCountdownSeconds: number;
  bothSubmitted: boolean;
  guessesLoaded: boolean;
}) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!firstGuessAt || bothSubmitted || !guessesLoaded) {
      setTimeLeft(null);
      return;
    }

    const deadline = firstGuessAt + guessCountdownSeconds * 1000;

    const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [firstGuessAt, bothSubmitted, guessesLoaded, guessCountdownSeconds]);

  const isVisible = !!(firstGuessAt && guessesLoaded && !bothSubmitted && timeLeft !== null);
  const fraction = isVisible && guessCountdownSeconds > 0 ? (timeLeft ?? 0) / guessCountdownSeconds : 0;
  const isUrgent = isVisible && (timeLeft ?? 0) <= 5;

  return (
    <div
      className={cn(
        "relative w-full shrink-0 overflow-hidden transition-[height] duration-300",
        isVisible ? "h-8 border-b bg-background" : "h-0"
      )}
    >
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-200 bg-destructive"
        style={{ width: `${fraction * 100}%` }}
      />
      <div className="relative flex h-full items-center justify-center gap-1.5 text-xs font-medium text-card-foreground">
        <Timer className="h-3.5 w-3.5 shrink-0" />
        <span className={cn(isUrgent && "font-semibold animate-pulse")}>
          {timeLeft}s remaining!
        </span>
      </div>
    </div>
  );
}
