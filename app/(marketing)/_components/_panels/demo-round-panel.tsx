import Image from "next/image";

import "./flipcard.css";

import { useState } from "react";
import { ImageIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DemoRoundPanel = () => {
  const lightHintIcon = "/new-user-heading/HintCircle.svg";
  const [isFlipped, setIsFlipped] = useState(false);
  const [hint1Open, setHint1Open] = useState(false);
  const [hint2Open, setHint2Open] = useState(false);
  const [hint3Open, setHint3Open] = useState(false);
  const [hint4Open, setHint4Open] = useState(false);

  const hintOverlayClassName =
    "absolute h-7 duration-300 bg-white text-black text-sm text-center py-1 px-2 rounded-lg transition-opacity drop-shadow-lg cursor-default";

  return (
    <div className={cn("flip-card-container", isFlipped && "flipped")}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="relative flex grow justify-center w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/new-user-heading/CampusDemoImage.jpeg"}
              alt={"PantherGuessr Demo Image 1"}
              className={"object-contain aspect-4/3 rounded-lg border-4 border-primary bg-primary"}
            />
            <Image
              className="absolute bottom-[25%] right-[11%] cursor-pointer hover:scale-125 transition-all drop-shadow-lg"
              src={lightHintIcon}
              alt={"Hint 1"}
              onMouseOver={() => setHint1Open(true)}
              onMouseOut={() => setHint1Open(false)}
              height={20}
              width={20}
            />
            <div
              id="hint1"
              className={cn(
                hintOverlayClassName,
                " rounded-br-none bottom-[30%] right-[15%]",
                hint1Open ? "opacity-100" : "opacity-0"
              )}
            >
              Info Booth
            </div>
            <Image
              className="absolute bottom-[66%] right-[27%] cursor-pointer hover:scale-125 transition-all drop-shadow-lg"
              src={lightHintIcon}
              alt={"Hint 2"}
              onMouseOver={() => setHint2Open(true)}
              onMouseOut={() => setHint2Open(false)}
              height={20}
              width={20}
            />
            <div
              id="hint2"
              className={cn(
                hintOverlayClassName,
                "rounded-tr-none top-[34%] right-[31%]",
                hint2Open ? "opacity-100" : "opacity-0"
              )}
            >
              Bertea Hall
            </div>
            <Image
              className="absolute left-[15%] top-[53%] cursor-pointer hover:scale-125 transition-all drop-shadow-lg"
              src={lightHintIcon}
              alt={"Hint 3"}
              onMouseOver={() => setHint3Open(true)}
              onMouseOut={() => setHint3Open(false)}
              height={20}
              width={20}
            />
            <div
              id="hint3"
              className={cn(
                hintOverlayClassName,
                "rounded-tl-none top-[58%] left-[19%]",
                hint3Open ? "opacity-100" : "opacity-0"
              )}
            >
              Waltmar Theater
            </div>
            <Image
              className="absolute left-[48%] top-[50%] cursor-pointer hover:scale-125 transition-all drop-shadow-lg"
              src={lightHintIcon}
              alt={"Hint 4"}
              onMouseOver={() => setHint4Open(true)}
              onMouseOut={() => setHint4Open(false)}
              height={20}
              width={20}
            />
            <div
              id="hint4"
              className={cn(
                hintOverlayClassName,
                "rounded-tl-none top-[55%] left-[52%]",
                hint4Open ? "opacity-100" : "opacity-0"
              )}
            >
              North Grand Street
            </div>
            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              className={"absolute right-[3%] bottom-[3%] px-2 aspect-square"}
              title="Reveal Answer"
            >
              <MapPin className="mx-0" />
            </Button>
          </div>
        </div>
        <div className="flip-card-back" id="flip-card-back">
          <div className="relative flex grow justify-center w-full h-full bg-primary rounded-lg border-4 border-primary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/new-user-heading/MapAnswerReveal.jpeg"}
              alt={"PantherGuessr Demo Image 1"}
              className={"object-contain aspect-4/3 rounded-xl border-4 border-primary bg-primary"}
              draggable={false}
            />
            <Image
              className="absolute top-[calc(50%-32px)] right-[calc(50%-24px)]]"
              src={"/CorrectPin.svg"}
              alt={"Hint 1"}
              height={48}
              width={48}
            />
            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              className={"absolute right-[3%] bottom-[3%] px-2 aspect-square bg-black text-white hover:bg-black/80"}
            >
              <ImageIcon className="mx-0" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRoundPanel;
