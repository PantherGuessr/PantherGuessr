import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  lastPlayedTime: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, lastPlayedTime }) => {
  const [streakBadgeWidth, setStreakBadgeWidth] = useState(0);

  useEffect(() => {
    // update streak badge width based on text width
    const textWidth = streak.toString().length * 8;
    setStreakBadgeWidth(textWidth > 25 ? textWidth : 25);
  }, [streak]);

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

  const badgeStyle = isStreakActive() ? "filter-none" : "filter grayscale animate-pulse";

  if (streak === 0) {
    return null;
  }

  return (
    <div
      className={cn("relative mr-1 hidden items-center xs:flex xs:justify-center", badgeStyle)}
      style={{ width: streakBadgeWidth }}
    >
      <Image
        draggable={false}
        className="transform-gpu cursor-default select-none drop-shadow"
        src="/badges/streak_badge.svg"
        alt={`Daily Streak Badge of ${streak} Days`}
        width="25"
        height="25"
      />
      <p
        className="absolute left-1/2 top-1/2 -translate-x-[51%] -translate-y-[45%] transform rounded-full text-sm font-bold text-white drop-shadow-md"
        style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000" }}
      >
        {streak}
      </p>
    </div>
  );
};

export default StreakBadge;
