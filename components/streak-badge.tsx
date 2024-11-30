import Image from "next/image";

interface StreakBadgeProps {
  streak: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => {
  return ( 
    <div className="hidden xs:flex items-center gap-x-2 mr-2 relative">
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