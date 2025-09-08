import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { WEEKLY_RESET_DAY_UTC, WEEKLY_RESET_HOUR_UTC, WEEKLY_RESET_MINUTE_UTC } from "../lib/weeklytimes";

const crons = cronJobs();

crons.daily(
  "Reset inactive streaks",
  { hourUTC: 8, minuteUTC: 0 }, // 12:00am PST
  internal.users.resetInactiveStreaks
);

crons.daily(
  "Clear old games",
  { hourUTC: 8, minuteUTC: 0 }, // 12:00am PST
  internal.game.clearOldGames
);

crons.daily(
  "Clear unplayed games",
  { hourUTC: 8, minuteUTC: 0 }, // 12:00am PST
  internal.game.clearUnplayedGames
);

crons.weekly(
  "Create weekly challenge",
  {
    dayOfWeek: (["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const)[WEEKLY_RESET_DAY_UTC],
    hourUTC: WEEKLY_RESET_HOUR_UTC,
    minuteUTC: WEEKLY_RESET_MINUTE_UTC
  },
  internal.weeklychallenge.createWeeklyChallenge
)

export default crons;
