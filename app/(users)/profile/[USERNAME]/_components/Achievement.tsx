import Image from "next/image";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface IAchievement {
  name: string;
  description: string;
  imageSrc: string;
  unlockedAt?: number;
}

const Achievement = ({ name, description, imageSrc, unlockedAt }: IAchievement) => {
  const unlockedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <HoverCard key={name} openDelay={100} closeDelay={50}>
      <HoverCardTrigger asChild>
        <span className="inline-block cursor-default select-none drop-shadow-md">
          <Image
            src={imageSrc}
            width={80}
            height={80}
            alt={name + " Achievement"}
            className="cursor-default select-none"
            draggable={false}
          />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="z-50 w-80">
        <div className="flex flex-row items-center space-x-4 drop-shadow-md">
          <Image
            src={imageSrc}
            width={80}
            height={80}
            alt={name + " Achievement"}
            className="cursor-default select-none justify-center align-middle"
            draggable={false}
          />
          <div className="flex flex-col justify-center">
            <p className="text-left font-bold">{name}</p>
            <p className="text-left font-normal">{description}</p>
            {unlockedDate && <p className="mt-1 text-left text-xs text-muted-foreground">Unlocked {unlockedDate}</p>}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Achievement;
