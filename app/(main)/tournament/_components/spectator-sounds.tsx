"use client";

import { useEffect, useRef } from "react";

const COUNTDOWN_SOUNDS = [
  { file: "cd-three.mp3", offset: 0 },
  { file: "cd-two.mp3", offset: 1000 },
  { file: "cd-one.mp3", offset: 2000 },
  { file: "cd-lets-begin.mp3", offset: 3000 },
];

function playAudio(file: string) {
  new Audio(`/audio/tournament/${file}`).play().catch(() => {});
}

export function SpectatorSounds({
  countdownStartedAt,
  p1Submitted,
  p2Submitted,
}: {
  countdownStartedAt: number | undefined;
  p1Submitted: boolean;
  p2Submitted: boolean;
}) {
  const prevCountdown = useRef<number | undefined>(undefined);
  const p1WasSubmitted = useRef(false);
  const p2WasSubmitted = useRef(false);

  // Countdown sounds — schedule from current elapsed position so joining late still syncs
  useEffect(() => {
    if (!countdownStartedAt) return;
    if (countdownStartedAt === prevCountdown.current) return;
    prevCountdown.current = countdownStartedAt;

    const elapsed = Date.now() - countdownStartedAt;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (const { file, offset } of COUNTDOWN_SOUNDS) {
      const delay = offset - elapsed;
      if (delay < -200) continue; // already passed
      timeouts.push(setTimeout(() => playAudio(file), Math.max(0, delay)));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [countdownStartedAt]);

  // P1 lock-in sound
  useEffect(() => {
    if (p1Submitted && !p1WasSubmitted.current) {
      p1WasSubmitted.current = true;
      playAudio("p1-lockin.mp3");
    } else if (!p1Submitted) {
      p1WasSubmitted.current = false;
    }
  }, [p1Submitted]);

  // P2 lock-in sound
  useEffect(() => {
    if (p2Submitted && !p2WasSubmitted.current) {
      p2WasSubmitted.current = true;
      playAudio("p2-lockin.mp3");
    } else if (!p2Submitted) {
      p2WasSubmitted.current = false;
    }
  }, [p2Submitted]);

  return null;
}
