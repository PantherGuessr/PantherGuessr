"use client";

import { useEffect, useState } from "react";

import "./countdown.css";

const STEP_MS = 1000;
const STEPS = ["3", "2", "1", "Let's Begin!"];

export function CountdownOverlay({ countdownStartedAt }: { countdownStartedAt: number | undefined }) {
  const [step, setStep] = useState<number | null>(() => {
    if (countdownStartedAt == null) return null;
    const s = Math.floor((Date.now() - countdownStartedAt) / STEP_MS);
    return s < STEPS.length ? s : null;
  });

  useEffect(() => {
    if (countdownStartedAt == null) {
      setStep(null);
      return;
    }

    const elapsed = Date.now() - countdownStartedAt;
    const startStep = Math.floor(elapsed / STEP_MS);

    if (startStep >= STEPS.length) {
      setStep(null);
      return;
    }

    setStep(startStep);

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    for (let s = startStep + 1; s <= STEPS.length; s++) {
      const delay = s * STEP_MS - elapsed;
      timeouts.push(setTimeout(() => setStep(s < STEPS.length ? s : null), delay));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [countdownStartedAt]);

  if (step === null) return null;

  const isGo = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <span
        key={step}
        className={`countdown-number select-none font-black text-white drop-shadow-2xl ${
          isGo ? "text-6xl" : "text-[12rem] leading-none"
        }`}
      >
        {STEPS[step]}
      </span>
    </div>
  );
}
