import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import LargeStreakBadge from "./_panels/large-streak-badge";

const DesktopHeadingLoading = () => {
  return (
    <>
      <div className={cn("mt-20 hidden flex-row items-center justify-center px-20 sm:gap-x-5 lg:flex lg:gap-x-10")}>
        <div
          className={
            "flex h-full basis-1/3 -translate-x-4 scale-90 -skew-y-3 flex-col items-center justify-between drop-shadow-lg transition-all"
          }
        >
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-6 flex w-full cursor-default flex-col items-center justify-center transition-all">
              <Skeleton className="border-primary/50 aspect-video w-full rounded-lg border-4 transition-all" />
              <Image
                src="/profile-banner-images/chapmanpantherwaving.gif"
                className="border-primary hidden rounded-lg border-4 transition-all"
                alt="Chapman Panther Waving"
                width={400}
                height={225}
              />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-y-2">
              <Skeleton className="bg-primary/50 h-8 w-[95%]" />
              <Skeleton className="bg-primary/50 h-8 w-[90%]" />
              <Skeleton className="bg-primary/50 h-8 w-[80%]" />
            </div>
          </div>
          <div className={"mt-16 h-4 w-72 rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
        </div>
        <div
          className={cn(
            "flex h-full basis-1/3 -translate-y-8 scale-90 flex-col items-center justify-between transition-all"
          )}
        >
          <ul
            className={cn("grid w-full grid-flow-col grid-rows-8 gap-2 p-2 drop-shadow-lg transition-all duration-150")}
          >
            <li className="row-span-2 w-full">
              <Skeleton className="bg-primary text-primary-foreground flex h-16 w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="bg-secondary flex h-full w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
          </ul>
          <div className={cn("mt-16 h-4 w-72 rounded-[50%] bg-black/30 blur-lg transition-all")}></div>
        </div>
        <div className="flex h-full basis-1/3 translate-x-4 scale-90 skew-y-3 flex-col items-center justify-between transition-all">
          <Card className="dropshadow-lg h-full w-full flex-grow animate-pulse cursor-default py-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Skeleton className="h-8 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <LargeStreakBadge streak={0} lastPlayedTime={0} message={false} />
              <div className="flex items-center justify-center pt-4">
                <Skeleton className="h-8 w-[95%]" />
              </div>
            </CardContent>
          </Card>
          <div className={"mt-12 h-4 w-72 rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
        </div>
      </div>
      <div className={cn("mt-24 flex w-full flex-row justify-center gap-x-6 px-12 lg:hidden")}>
        <div
          className={
            "flex h-full basis-1/2 -translate-x-4 scale-90 -skew-y-3 flex-col items-center justify-between drop-shadow-lg transition-all"
          }
        >
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-6 flex w-full cursor-default flex-col items-center justify-center transition-all">
              <Skeleton className="border-primary/50 aspect-video w-full rounded-lg border-4 transition-all" />
              <Image
                src="/profile-banner-images/chapmanpantherwaving.gif"
                className="border-primary hidden rounded-lg border-4 transition-all"
                alt="Chapman Panther Waving"
                width={400}
                height={225}
              />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-y-2">
              <Skeleton className="bg-primary/50 h-8 w-[95%]" />
              <Skeleton className="bg-primary/50 h-8 w-[90%]" />
              <Skeleton className="bg-primary/50 h-8 w-[80%]" />
            </div>
          </div>
          <div className={"mt-16 h-4 w-72 rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
        </div>
        <div
          className={cn(
            "flex h-full w-full basis-1/2 translate-x-4 scale-90 skew-y-3 flex-col items-center justify-between transition-all"
          )}
        >
          <ul
            className={cn("grid w-full grid-flow-col grid-rows-8 gap-2 p-2 drop-shadow-lg transition-all duration-150")}
          >
            <li className="row-span-2 w-full">
              <Skeleton className="bg-primary text-primary-foreground flex h-16 w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="bg-secondary flex h-full w-full items-center justify-center rounded-md px-8 py-5 text-center transition-all hover:scale-95" />
            </li>
          </ul>
          <div className={cn("mt-16 h-4 w-72 rounded-[50%] bg-black/30 blur-lg transition-all")}></div>
        </div>
      </div>
    </>
  );
};

export default DesktopHeadingLoading;
