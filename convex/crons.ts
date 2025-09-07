import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

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
    dayOfWeek: "monday",
    hourUTC: 17,
    minuteUTC: 0
  }, // 9:00 am PST on Monday
  internal.weeklychallenge.makeWeeklyChallenge
)

export default crons;
