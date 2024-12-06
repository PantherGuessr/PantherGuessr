import { cn } from "@/lib/utils";
import Image from "next/image";

interface StreakBadgeProps {
  streak: number;
  lastPlayedTime: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, lastPlayedTime }) => {

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
    <div className={cn("hidden xs:flex items-center gap-x-2 mr-1 relative",
      badgeStyle
    )}>
      <Image
        draggable={false} className="select-none"
        src="/badges/streak_badge.svg"
        alt={`Daily Streak Badge of ${streak} Days`}
        width="25"
        height="25" 
      />
      <p
        className="absolute top-1/2 left-1/2 transform -translate-x-[50%] -translate-y-[40%] text-white rounded-full px-1 text-sm font-bold drop-shadow-md"
        style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000' }}>
        {streak}
      </p>
    </div>
  );
};
 
export default StreakBadge;