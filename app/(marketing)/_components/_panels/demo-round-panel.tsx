import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const DemoRoundPanel = () => {
  const theme = useTheme();

  const lightHintIcon = "/new-user-heading/HintCircle.svg";

  const hintOverlayClassName =
    "absolute h-7 duration-300 bg-white text-black text-sm text-center py-1 px-2 rounded-lg transition-opacity rounded-br-none drop-shadow-lg";

  const [hint1Open, setHint1Open] = useState(false);
  // const [hint2Open, setHint2Open] = useState(false);
  // const [hint3Open, setHint3Open] = useState(false);
  // const [hint4Open, setHint4Open] = useState(false);

  return (
    <div className="relative items-center justify-center w-full">
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
        className={cn(hintOverlayClassName, "bottom-[30%] right-[15%]", hint1Open ? "opacity-100" : "opacity-0")}
      >
        Info Booth
      </div>
    </div>
  );
};

export default DemoRoundPanel;
