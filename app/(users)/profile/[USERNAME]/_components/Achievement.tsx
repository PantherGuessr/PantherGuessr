import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface IAchievement {
  name: string;
  description: string;
  imageSrc: string;
};

const Achievement = ({ name, description, imageSrc }: IAchievement) => {
  return (
    <HoverCard key={name} openDelay={0} closeDelay={50}>
      <HoverCardTrigger asChild>
        <Image src={imageSrc} width={80} height={80} alt={name + " Achievement"} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 z-50">
        <div className="flex flex-row space-x-4 items-center">
          <Image src={imageSrc} width={80} height={80} alt={name + " Achievement"} className="justify-center align-middle" />
          <div className="flex flex-col justify-center">
            <p className="font-bold text-left">{name}</p>
            <p className="font-normal text-left">{description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Achievement;