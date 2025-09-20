import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Id, TableNames } from "@/convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if a string is a valid Convex ID format
 *
 * @param id - The string to validate as a Convex ID
 * @returns true if the format appears to be a valid Convex ID
 */
export function isValidConvexId(id: string): boolean {
  if (!id || typeof id !== "string") {
    return false;
  }

  // Convex IDs are typically base64url encoded and have a specific length range
  // They should only contain letters, numbers, hyphens, and underscores
  const convexIdRegex = /^[A-Za-z0-9_-]{16,}$/;
  return convexIdRegex.test(id);
}

/**
 * Safely converts a string to a Convex ID after validation
 *
 * @param id - The string to convert to a Convex ID
 * @returns The typed Convex ID or null if invalid
 */
export function toConvexId<T extends TableNames>(id: string): Id<T> | null {
  if (!isValidConvexId(id)) {
    return null;
  }
  return id as Id<T>;
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
