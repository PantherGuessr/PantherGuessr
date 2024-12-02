import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Reset inactive streaks",
  { hourUTC: 8, minuteUTC: 0 }, // 12:00am PST
  internal.users.resetInactiveStreaks
);

export default crons;