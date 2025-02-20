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

export default crons;
