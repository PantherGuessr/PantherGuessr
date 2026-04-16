import { useState } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import DemoRoundPanel from "@/app/(marketing)/_components/_panels/demo-round-panel";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export const NewUserHeading = () => {
  const [signOnButtonHovered, setSignOnButtonHovered] = useState(false);

  const isLarge = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <div className="flex w-full items-center justify-center gap-x-4">
        {isLarge ? (
          <Logo badge={false} logoDimensions={160} textOptions="text-2xl sm:text-5xl md:text-7xl font-semibold" />
        ) : (
          <Logo badge={false} logoDimensions={80} textOptions="text-2xl sm:text-5xl md:text-7xl font-semibold" />
        )}
      </div>
      <div className="flex flex-grow flex-col items-center justify-center px-4 pt-4 sm:px-10 sm:pt-8 md:flex-row xl:px-20">
        <div className="flex basis-1/2 flex-col items-center justify-center px-4 transition-transform duration-300">
          <h1 className="pb-2 text-xl font-bold sm:pb-8 sm:text-4xl">Can you find your way around campus?</h1>
          <h2 className="pb-4 text-lg font-normal sm:pb-8 sm:text-xl">
            Test your campus knowledge with <span className="font-bold">PantherGuessr</span>, the free game where you
            identify the locations of photos around Chapman University
          </h2>
          <SignUpButton mode="modal" fallbackRedirectUrl={window.location.href}>
            <div
              className="w-[88%] cursor-pointer transition-all duration-300 ease-in-out hover:w-[100%] sm:w-3/4 sm:hover:w-[80%]"
              onMouseOver={() => setSignOnButtonHovered(true)}
              onMouseLeave={() => setSignOnButtonHovered(false)}
            >
              <div className="waitlist-button glow flex h-16 flex-row items-center justify-center bg-primary text-primary-foreground shadow-md">
                <p className="pr-1 text-lg">Sign up to play</p>
                <ArrowRight className={cn("transition-transform", signOnButtonHovered && "translate-x-1")} />
              </div>
            </div>
          </SignUpButton>
        </div>
        <div className="flex basis-1/2 flex-col px-4 pt-8 md:pt-0">
          <DemoRoundPanel />
        </div>
      </div>
    </>
  );
};
