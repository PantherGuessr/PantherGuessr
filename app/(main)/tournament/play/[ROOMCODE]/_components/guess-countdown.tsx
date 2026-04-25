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

  const room = useQuery(api.tournament.getTournamentRoomById, tournament ? { roomId: tournament.roomId } : "skip");

  const guesses = useQuery(
    api.tournament.getTournamentGuessesForRound,
    tournament && room ? { roomId: tournament.roomId, round: room.currentRound } : "skip"
  );

  const clerkId = currentUser?.user.clerkId;
  const myGuess = guesses?.find((g) => g.playerClerkId === clerkId);
  const hasSubmitted = !!myGuess?.hasSubmitted;

  const firstGuessAt = room?.firstGuessAt;
  const guessCountdownSeconds = room?.guessCountdownSeconds ?? 15;

  // Stores the last-sampled timestamp so timeLeft can be computed without
  // calling Date.now() during render (which the linter flags as impure).
  const [now, setNow] = useState<number | null>(null);

  // Refs for the auto-submit callback. Updated in an effect (not during render)
  // so the timeout always reads the freshest values without needing to reschedule.
  const markerPositionRef = useRef(game?.markerPosition ?? null);
  const submitGuessRef = useRef(game?.submitGuess);
  const tournamentRef = useRef(tournament);
  const hasSubmittedRef = useRef(hasSubmitted);
  const hasAutoSubmittedRef = useRef(false);

  // No dep array — runs after every render so refs are always current.
  useEffect(() => {
    markerPositionRef.current = game?.markerPosition ?? null;
    submitGuessRef.current = game?.submitGuess;
    tournamentRef.current = tournament;
    hasSubmittedRef.current = hasSubmitted;
  });

  // Reset the auto-submit guard whenever a new countdown starts
  useEffect(() => {
    hasAutoSubmittedRef.current = false;
  }, [firstGuessAt]);

  // Drive the visible countdown ticks — setNow is called via tick(), not directly
  useEffect(() => {
    if (!firstGuessAt || hasSubmitted) return;
    const tick = () => setNow(Date.now());
    tick();
    const interval = setInterval(tick, 200);
    return () => {
      clearInterval(interval);
      setNow(null);
    };
  }, [firstGuessAt, hasSubmitted]);

  // Schedule the auto-submit to fire at the deadline
  useEffect(() => {
    if (!firstGuessAt) return;

    const deadline = firstGuessAt + guessCountdownSeconds * 1000;
    const remaining = deadline - Date.now();

    const doAutoSubmit = () => {
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

  // Derive timeLeft from the stored timestamp — no Date.now() in render
  const deadline = firstGuessAt ? firstGuessAt + guessCountdownSeconds * 1000 : null;
  const timeLeft = now !== null && deadline !== null ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;

  if (!firstGuessAt || hasSubmitted || game?.correctLocation || timeLeft === null) {
    return null;
  }

  const fraction = guessCountdownSeconds > 0 ? timeLeft / guessCountdownSeconds : 0;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="absolute inset-x-0 top-0 z-10 mr-4 mt-4 h-8 overflow-hidden border-b bg-background">
      <div
        className="absolute inset-y-0 left-0 rounded-t-sm bg-destructive transition-[width] duration-200"
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
