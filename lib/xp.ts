export interface XPBreakdown {
  baseXP: number;
  firstGameOfDayXP: number;
  pointsXP: number;
  spotOnXP: number;
  isPerfect: boolean;
  streakMultiplier: number;
  streakBonusXP: number;
  totalXP: number;
}

/**
 * Returns true if `lastPlayedTimestamp` was on a different PST calendar day than now,
 * i.e. the current game is the player's first of the day.
 */
export function isNewPSTDay(lastPlayedTimestamp: number | null | undefined): boolean {
  const now = new Date();
  const nowPST = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const nowMidnight = new Date(nowPST.getFullYear(), nowPST.getMonth(), nowPST.getDate());

  if (!lastPlayedTimestamp) return true;

  const lastPlayPST = new Date(
    new Date(lastPlayedTimestamp).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
  const lastPlayMidnight = new Date(lastPlayPST.getFullYear(), lastPlayPST.getMonth(), lastPlayPST.getDate());

  return nowMidnight.getTime() !== lastPlayMidnight.getTime();
}

/**
 * Returns the streak XP multiplier for a given streak length.
 * - 3–6 days:  1.1× (+10%)
 * - 7–13 days: 1.25× (+25%)
 * - 14+ days:  1.5× (+50%)
 */
export function getStreakMultiplier(streak: number): number {
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
}

/**
 * Computes the full XP breakdown for a completed game.
 *
 * @param points            Array of round scores (as numbers).
 * @param distances         Array of distances from target in feet (as numbers).
 * @param streak            The player's streak at the time the game was completed.
 * @param isFirstGameOfDay  Whether this is the player's first game today.
 */
export function computeXPBreakdown(
  points: number[],
  distances: number[],
  streak: number,
  isFirstGameOfDay: boolean
): XPBreakdown {
  const baseXP = 10;

  // Bonus for first game of the day
  const firstGameOfDayXP = isFirstGameOfDay ? 10 : 0;

  // 1 XP per 25 points scored
  const totalPoints = points.reduce((sum, p) => sum + p, 0);
  const pointsXP = Math.floor(totalPoints / 25);

  // 5 XP per spot-on round (distance ≤ 20 ft)
  const spotOnCount = distances.filter((d) => d <= 20).length;
  const spotOnXP = spotOnCount * 5;

  // Perfect game: all rounds spot-on → double everything so far
  const isPerfect = spotOnCount === points.length && points.length > 0;
  const subtotal = (baseXP + firstGameOfDayXP + pointsXP + spotOnXP) * (isPerfect ? 2 : 1);

  // Streak multiplier applied last
  const streakMultiplier = getStreakMultiplier(streak);
  const streakBonusXP = Math.floor(subtotal * streakMultiplier) - subtotal;
  const totalXP = subtotal + streakBonusXP;

  return { baseXP, firstGameOfDayXP, pointsXP, spotOnXP, isPerfect, streakMultiplier, streakBonusXP, totalXP };
}
