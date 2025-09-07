import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Calculates the total score from an entry object by summing the values of rounds 1 to 5.
 * If a round value is missing or undefined, it defaults to 0.
 *
 * @param entry - The object containing round scores (round_1 to round_5).
 * @returns The total score as a number.
 */
export function getTotalScore(entry: any) {
  return (
    Number(entry.round_1 ?? 0) +
    Number(entry.round_2 ?? 0) +
    Number(entry.round_3 ?? 0) +
    Number(entry.round_4 ?? 0) +
    Number(entry.round_5 ?? 0)
  );
}