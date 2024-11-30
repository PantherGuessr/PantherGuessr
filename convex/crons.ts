import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Reset inactive streaks",
  { hourUTC: 0, minuteUTC: 0 },
  internal.users.resetInactiveStreaks
);

export default crons;