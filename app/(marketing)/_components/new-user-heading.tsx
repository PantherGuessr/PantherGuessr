import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import DemoRoundPanel from "@/app/(marketing)/_components/_panels/demo-round-panel";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export const NewUserHeading = () => {
  const [signOnButtonHovered, setSignOnButtonHovered] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-x-4 w-full">
        <Logo badge={false} logoDimensions={80} textOptions="text-2xl sm:text-5xl md:text-7xl font-semibold" />
      </div>
      <div className="flex flex-col md:flex-row flex-grow items-center justify-center px-4 sm:px-10 xl:px-20 pt-4 sm:pt-8">
        <div className="flex flex-col justify-center items-center px-4 basis-1/2 transition-transform duration-300">
          <h1 className="text-xl sm:text-4xl font-bold pb-2 sm:pb-8">Can you find your way around campus?</h1>
          <h2 className="text-lg sm:text-xl font-normal pb-4 sm:pb-8">
            Test your campus knowledge with <span className="font-bold">PantherGuessr</span>, the free game where you
            identify the locations of photos around Chapman University
          </h2>
          <Link
            className="w-1/2 transition-all duration-300 ease-in-out hover:w-[53%]"
            href="/waitlist"
            onMouseOver={() => setSignOnButtonHovered(true)}
            onMouseLeave={() => setSignOnButtonHovered(false)}
          >
            <div className="waitlist-button bg-primary h-16 text-primary-foreground shadow-md glow flex flex-row justify-center items-center">
              <p className="text-lg pr-1">Join our waitlist</p>
              <ArrowRight className={cn("transition-transform", signOnButtonHovered && "translate-x-1")} />
            </div>
          </Link>
        </div>
        <div className="flex flex-col px-4 pt-8 md:pt-0 basis-1/2">
          <DemoRoundPanel />
        </div>
      </div>
    </>
  );
};
