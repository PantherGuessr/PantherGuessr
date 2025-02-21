import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const DemoRoundPanel = () => {
  const theme = useTheme();

  const darkHintIcon = "/new-user-heading/HintCircleDark.svg";
  const lightHintIcon = "/new-user-heading/HintCircle.svg";

  const hintOverlayClassName =
    "absolute h-7 bottom-[60%] right-[26%] duration-300 bg-primary text-primary-foreground text-sm text-center py-1 px-2 rounded-lg transition-opacity rounded-br-none drop-shadow-lg";

  const [hint1Open, setHint1Open] = useState(false);
  // const [hint2Open, setHint2Open] = useState(false);
  // const [hint3Open, setHint3Open] = useState(false);
  // const [hint4Open, setHint4Open] = useState(false);

  return (
    <div className="relative items-center justify-center w-full">
      <img
        src={"/new-user-heading/Sammy.jpeg"}
        alt={"PantherGuessr Demo Image 1"}
        className={"object-contain aspect-4/3 rounded-lg border-4 border-primary"}
      />
      <Image
        className="absolute top-[42%] left-[75%] cursor-pointer hover:scale-125 transition-all drop-shadow-lg"
        src={theme.theme == "dark" ? lightHintIcon : darkHintIcon}
        alt={"Hint 1"}
        onMouseOver={() => setHint1Open(true)}
        onMouseOut={() => setHint1Open(false)}
        height={20}
        width={20}
      />
      <div className={cn(hintOverlayClassName, hint1Open ? "opacity-100" : "opacity-0")}>DeMille Hall</div>
    </div>
  );
};

export default DemoRoundPanel;
