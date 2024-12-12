import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StreakBadgeProps {
  streak: number;
  lastPlayedTime: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, lastPlayedTime }) => {

  const [streakBadgeWidth, setStreakBadgeWidth] = useState(0);

  useEffect(() => {
    // update streak badge width based on text width
    const textWidth = streak.toString().length * 6 + 10;
    setStreakBadgeWidth(textWidth);
  }, [streak]);

  // If the user has not played today, the streak badge will be greyed out and pulse
  function isStreakActive() {
    const now = new Date();
    const lastPlayedDate = new Date(lastPlayedTime);

    // Reset time part of the dates to midnight
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastPlayedMidnight = new Date(lastPlayedDate.getFullYear(), lastPlayedDate.getMonth(), lastPlayedDate.getDate()).getTime();

    return nowMidnight === lastPlayedMidnight;
  }

  const badgeStyle = isStreakActive() ? 'filter-none' : 'filter grayscale animate-pulse';

  if (streak === 0) {
    return null;
  }

  return ( 
    <div 
      className={cn("hidden xs:flex xs:justify-center items-center gap-x-2 mr-1 relative",
        badgeStyle
      )}
      style={{ width: streakBadgeWidth }}
    >
      <Image
        draggable={false} className="select-none"
        src="/badges/streak_badge.svg"
        alt={`Daily Streak Badge of ${streak} Days`}
        width="25"
        height="25" 
      />
      <p
        className="absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[45%] text-white rounded-full px-1 text-sm font-bold drop-shadow-md"
        style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000' }}>
        {streak}
      </p>
    </div>
  );
};
 
export default StreakBadge;