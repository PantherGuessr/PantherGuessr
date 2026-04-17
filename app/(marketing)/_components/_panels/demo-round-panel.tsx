import { useState } from "react";
import Image from "next/image";
import { ImageIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "./flipcard.css";

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
          <div className="relative flex w-full grow justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/new-user-heading/CampusDemoImage.jpeg"}
              alt={"PantherGuessr Demo Image 1"}
              className={"aspect-4/3 rounded-lg border-4 border-primary bg-primary object-contain"}
            />
            <Image
              className="absolute bottom-[25%] right-[11%] cursor-pointer drop-shadow-lg transition-all hover:scale-125"
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
                "bottom-[30%] right-[15%] rounded-br-none",
                hint1Open ? "opacity-100" : "opacity-0"
              )}
            >
              Info Booth
            </div>
            <Image
              className="absolute bottom-[66%] right-[27%] cursor-pointer drop-shadow-lg transition-all hover:scale-125"
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
                "right-[31%] top-[34%] rounded-tr-none",
                hint2Open ? "opacity-100" : "opacity-0"
              )}
            >
              Bertea Hall
            </div>
            <Image
              className="absolute left-[15%] top-[53%] cursor-pointer drop-shadow-lg transition-all hover:scale-125"
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
                "left-[19%] top-[58%] rounded-tl-none",
                hint3Open ? "opacity-100" : "opacity-0"
              )}
            >
              Waltmar Theatre
            </div>
            <Image
              className="absolute left-[48%] top-[50%] cursor-pointer drop-shadow-lg transition-all hover:scale-125"
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
                "left-[52%] top-[55%] rounded-tl-none",
                hint4Open ? "opacity-100" : "opacity-0"
              )}
            >
              North Grand Street
            </div>
            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              className={"absolute bottom-[3%] right-[3%] aspect-square px-2"}
              title="Reveal Answer"
            >
              <MapPin className="mx-0" />
            </Button>
          </div>
        </div>
        <div className="flip-card-back" id="flip-card-back">
          <div className="relative flex h-full w-full grow justify-center rounded-lg border-4 border-primary bg-primary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={"/new-user-heading/MapAnswerReveal.jpeg"}
              alt={"PantherGuessr Demo Image 1"}
              className={"aspect-4/3 rounded-xl border-4 border-primary bg-primary object-contain"}
              draggable={false}
            />
            <Image
              className="right-[calc(50%-24px)]] absolute top-[calc(50%-32px)]"
              src={"/CorrectPin.svg"}
              alt={"Hint 1"}
              height={48}
              width={48}
            />
            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              className={"absolute bottom-[3%] right-[3%] aspect-square bg-black px-2 text-white hover:bg-black/80"}
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
