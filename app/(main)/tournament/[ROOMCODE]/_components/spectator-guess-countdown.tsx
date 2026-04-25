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
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!firstGuessAt || bothSubmitted || !guessesLoaded) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, 200);
    return () => {
      clearInterval(interval);
      setNow(null);
    };
  }, [firstGuessAt, bothSubmitted, guessesLoaded]);

  const deadline = firstGuessAt ? firstGuessAt + guessCountdownSeconds * 1000 : null;
  const timeLeft = now !== null && deadline !== null ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;
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
        className="absolute inset-y-0 left-0 bg-destructive transition-[width] duration-200"
        style={{ width: `${fraction * 100}%` }}
      />
      <div className="relative flex h-full items-center justify-center gap-1.5 text-xs font-medium text-card-foreground">
        <Timer className="h-3.5 w-3.5 shrink-0" />
        <span className={cn(isUrgent && "animate-pulse font-semibold")}>{timeLeft}s remaining!</span>
      </div>
    </div>
  );
}
