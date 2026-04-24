"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { Timer } from "lucide-react";

import { useGame } from "@/app/(main)/game/_context/GameContext";
import { useTournament } from "@/app/(main)/game/_context/TournamentContext";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";

export function GuessCountdown() {
  const tournament = useTournament();
  const game = useGame();
  const { data: currentUser } = useCurrentUser();

  const room = useQuery(
    api.tournament.getTournamentRoomById,
    tournament ? { roomId: tournament.roomId } : "skip"
  );

  const guesses = useQuery(
    api.tournament.getTournamentGuessesForRound,
    tournament && room ? { roomId: tournament.roomId, round: room.currentRound } : "skip"
  );

  const clerkId = currentUser?.user.clerkId;
  const myGuess = guesses?.find((g) => g.playerClerkId === clerkId);
  const hasSubmitted = !!myGuess?.hasSubmitted;

  const firstGuessAt = room?.firstGuessAt;
  const guessCountdownSeconds = room?.guessCountdownSeconds ?? 15;

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Keep fresh values accessible inside the timeout callback without re-scheduling it
  const markerPositionRef = useRef(game?.markerPosition ?? null);
  markerPositionRef.current = game?.markerPosition ?? null;
  const submitGuessRef = useRef(game?.submitGuess);
  submitGuessRef.current = game?.submitGuess;
  const tournamentRef = useRef(tournament);
  tournamentRef.current = tournament;
  const hasSubmittedRef = useRef(hasSubmitted);
  hasSubmittedRef.current = hasSubmitted;
  const hasAutoSubmittedRef = useRef(false);

  // reset auto-submit when new countdown starts
  useEffect(() => {
    hasAutoSubmittedRef.current = false;
  }, [firstGuessAt]);

  // visible countdown display lgoic
  useEffect(() => {
    if (!firstGuessAt || hasSubmitted) {
      setTimeLeft(null);
      return;
    }

    const deadline = firstGuessAt + guessCountdownSeconds * 1000;

    const tick = () => setTimeLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [firstGuessAt, hasSubmitted, guessCountdownSeconds]);

  // schedule to fire auto-submit when the countdown expires if the player hasn't submitted by then
  useEffect(() => {
    if (!firstGuessAt) return;

    const deadline = firstGuessAt + guessCountdownSeconds * 1000;
    const remaining = deadline - Date.now();

    const doAutoSubmit = () => {
      // Server-side submitTournamentGuess is idempotent, safe to call even if the player already submitted manually just before the timer fired.
      if (hasAutoSubmittedRef.current || hasSubmittedRef.current) return;
      hasAutoSubmittedRef.current = true;

      const lat = markerPositionRef.current?.lat ?? 0;
      const lng = markerPositionRef.current?.lng ?? 0;
      submitGuessRef.current?.(lat, lng).then((success) => {
        if (success) tournamentRef.current?.onGuessSubmit(lat, lng).catch(console.error);
      });
    };

    if (remaining <= 0) {
      doAutoSubmit();
      return;
    }

    const timer = setTimeout(doAutoSubmit, remaining);
    return () => clearTimeout(timer);
  }, [firstGuessAt, guessCountdownSeconds]);

  // hide when countdown not started / player already submitted / result already showing
  if (!firstGuessAt || hasSubmitted || game?.correctLocation || timeLeft === null) {
    return null;
  }

  const fraction = guessCountdownSeconds > 0 ? timeLeft / guessCountdownSeconds : 0;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="absolute inset-x-0 top-0 z-10 h-8 overflow-hidden border-b bg-background mr-4 mt-4">
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-200 bg-destructive rounded-t-sm"
        style={{ width: `${fraction * 100}%` }}
      />
      <div className="relative flex h-full items-center justify-center gap-1.5 text-sm font-medium text-card-foreground">
        <Timer className="h-3.5 w-3.5 shrink-0" />
        <span className={cn(isUrgent && "font-semibold")}>
          Opponent has submitted! {timeLeft}s to lock in your guess
        </span>
      </div>
    </div>
  );
}
