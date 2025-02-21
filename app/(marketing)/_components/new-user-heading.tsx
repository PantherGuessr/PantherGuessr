import { useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import DemoRoundPanel from "@/app/(marketing)/_components/_panels/demo-round-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const NewUserHeading = () => {
  const [signOnButtonHovered, setSignOnButtonHovered] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-x-4 w-full">
        <Image
          draggable={false}
          src={"/logo.svg"}
          height="60"
          width="60"
          alt="Logo"
          className="dark:hidden select-none"
        />
        <Image
          draggable={false}
          src={"/logo-dark.svg"}
          height="60"
          width="60"
          alt="Logo"
          className="hidden dark:block select-none"
        />
        <h1 className={cn("text-primary text-6xl font-semibold", font.className)}>PantherGuessr</h1>
      </div>
      <div className="flex flex-col md:flex-row flex-grow items-center justify-center px-10 xl:px-20 pt-10">
        <div className="flex flex-col px-4 basis-1/2 -skew-y-3 translate-y-4 transition-transform duration-300">
          <h1 className="text-4xl font-bold pb-8">Can you find your way around campus?</h1>
          <h2 className="text-xl font-normal pb-8">
            Test your campus knowledge with <span className="font-bold">PantherGuessr</span>, the free game where you
            identify the locations of photos around Chapman University
          </h2>
          <Button
            variant="default"
            className="w-full h-16 text-lg transition-transform"
            onMouseOver={() => setSignOnButtonHovered(true)}
            onMouseLeave={() => setSignOnButtonHovered(false)}
          >
            Join the waitlist
            <ArrowRight className={cn("transition-transform", signOnButtonHovered && "translate-x-1")} />
          </Button>
        </div>
        <div className="flex flex-col px-4 basis-1/2">
          <DemoRoundPanel />
        </div>
      </div>
    </>
  );
};
