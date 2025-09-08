// Weekly Challenge Reset Time Configuration
// Change these values to update the reset time everywhere
export const WEEKLY_RESET_DAY_UTC = 1; // Monday (0 = Sunday, 1 = Monday, etc)
export const WEEKLY_RESET_HOUR_UTC = 17; // 17:00 UTC = 9/10 am PST/PDT depending on daylight savings
export const WEEKLY_RESET_MINUTE_UTC = 0;

/**
 * Returns the next weekly challenge reset Date in UTC
 */
export function getNextWeeklyResetUTC(now: Date = new Date()): Date {
  // Find this week's reset
  const dayOfWeek = now.getUTCDay();
  // Calculate days until next reset day
  let daysUntilReset = (WEEKLY_RESET_DAY_UTC - dayOfWeek + 7) % 7;
  // If today is reset day but time has passed, go to next week
  const resetThisWeek = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilReset,
      WEEKLY_RESET_HOUR_UTC,
      WEEKLY_RESET_MINUTE_UTC,
      0,
      0
    )
  );
  if (now.getTime() < resetThisWeek.getTime()) {
    return resetThisWeek;
  } else {
    // Next week's reset
    resetThisWeek.setUTCDate(resetThisWeek.getUTCDate() + 7);
    return resetThisWeek;
  }
}

/**
 * Returns the next weekly challenge reset timestamp (ms since epoch)
 */
export function getNextWeeklyResetTimestamp(now: Date = new Date()): number {
  return getNextWeeklyResetUTC(now).getTime();
}

/**
 * Returns the reset time in a given timezone offset (in hours)
 * Example: Pacific Time is UTC-8 or UTC-7 (DST)
 */
export function getNextWeeklyResetInTimezone(offsetHours: number, now: Date = new Date()): Date {
  const utcReset = getNextWeeklyResetUTC(now);
  return new Date(utcReset.getTime() + offsetHours * 60 * 60 * 1000);
}
