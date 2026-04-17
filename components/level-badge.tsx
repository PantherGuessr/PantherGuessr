import Image from "next/image";

interface LevelBadgeProps {
  level: number;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => {
  const textWidth = level.toString().length * 8;
  const levelBadgeWidth = textWidth > 25 ? textWidth : 25;

  return (
    <div
      className="relative mr-1 hidden items-center gap-x-2 xs:flex xs:justify-center"
      style={{ width: levelBadgeWidth }}
    >
      <Image
        draggable={false}
        className="transform-gpu cursor-default select-none drop-shadow"
        src="/badges/level_badge.svg"
        alt={`Account Level of ${level}`}
        width="25"
        height="25"
      />
      <p
        className="absolute left-1/2 top-1/2 -translate-x-[51%] -translate-y-[45%] transform rounded-full px-1 text-sm font-bold text-white drop-shadow-md"
        style={{ textShadow: "1px 1px 0 #000, -1px -1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000" }}
      >
        {level}
      </p>
    </div>
  );
};

export default LevelBadge;
