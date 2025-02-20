import Image from "next/image";

import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  lastPlayedTime: number;
  message?: boolean;
}

const LargeStreakBadge: React.FC<StreakBadgeProps> = ({ streak, lastPlayedTime, message = true }) => {
  // If the user has not played today, the streak badge will be greyed out and pulse
  function isStreakActive() {
    const now = new Date();
    const lastPlayedDate = new Date(lastPlayedTime);

    // Reset time part of the dates to midnight
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastPlayedMidnight = new Date(
      lastPlayedDate.getFullYear(),
      lastPlayedDate.getMonth(),
      lastPlayedDate.getDate()
    ).getTime();

    return nowMidnight === lastPlayedMidnight;
  }

  function calculateStreakMessage() {
    if (isStreakActive() && streak !== 0) {
      return "Your streak is safe... for now...";
    } else if (!isStreakActive() && streak !== 0) {
      return "You have not played today. Your streak is in danger!";
    } else {
      return "You have not played today. Start your streak now!";
    }
  }

  const badgeStyle =
    streak !== 0 ? (isStreakActive() ? "filter-none" : "filter grayscale animate-pulse") : "filter grayscale";

  return (
    <>
      <div className={cn("flex justify-center items-center relative hover:scale-105 transition-transform", badgeStyle)}>
        <Image
          draggable={false}
          className="select-none drop-shadow-lg"
          src="/badges/streak_badge.svg"
          alt={`Daily Streak Badge of ${streak} Days`}
          width="125"
          height="125"
        />
        <p
          className="absolute top-1/2 left-1/2 transform -translate-x-[51%] -translate-y-[35%] text-white rounded-full text-5xl font-bold drop-shadow-md select-none"
          style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000" }}
        >
          {streak !== 0 ? streak : ""}
        </p>
      </div>
      {message && (
        <div className="flex justify-center items-center pt-4">
          <p className="text-card-foreground text-xl">{calculateStreakMessage()}</p>
        </div>
      )}
    </>
  );
};

export default LargeStreakBadge;
