import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import LargeStreakBadge from "./_panels/large-streak-badge";

const DesktopHeadingLoading = () => {

  return ( 
    <>
      <div className={
        cn("lg:flex hidden flex-row justify-center items-center lg:gap-x-10 sm:gap-x-5 mt-20 px-20")
      }>
        <div className={"flex flex-col justify-between h-full items-center basis-1/3 transition-all drop-shadow-lg -skew-y-3 -translate-x-4 scale-90"}>
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col transition-all justify-center w-full items-center mb-6 cursor-default">
              <Skeleton className="rounded-lg transition-all border-primary/50 border-4 w-full aspect-video" />
              <Image src="/profile-banner-images/chapmanpantherwaving.gif"
                className="rounded-lg transition-all border-primary border-4 hidden"
                alt="Chapman Panther Waving" width={400} height={225} />
            </div>
            <div className="flex flex-col w-full gap-y-2 justify-center items-center">
              <Skeleton className="h-8 w-[95%] bg-primary/50" />
              <Skeleton className="h-8 w-[90%] bg-primary/50" />
              <Skeleton className="h-8 w-[80%] bg-primary/50" />
            </div>
          </div>
          <div className={"w-72 h-4 mt-16 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
        </div>
        <div className={cn("flex flex-col justify-between items-center basis-1/3 transition-all h-full -translate-y-8 scale-90")}>
          <ul className={
            cn("grid grid-rows-8 p-2 grid-flow-col gap-2 w-full duration-150 transition-all drop-shadow-lg")
          }>
            <li className="row-span-2 w-full">
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-16 bg-primary text-primary-foreground rounded-md" />
            </li>
            <li className="row-span-2 w-full">  
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md" />
            </li>
          </ul>
          <div className={cn("w-72 h-4 rounded-[50%] blur-lg transition-all mt-16 bg-black/30")}></div>
        </div>
        <div className="flex flex-col justify-between h-full items-center basis-1/3 transition-all skew-y-3 translate-x-4 scale-90">
          <Card className="w-full h-full py-6 flex-grow dropshadow-lg cursor-default animate-pulse">
            <CardHeader>
              <CardTitle className="flex justify-center items-center">
                <Skeleton className="h-8 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <LargeStreakBadge streak={0} lastPlayedTime={0} message={false} />
              <div className="flex justify-center items-center pt-4">
                <Skeleton className="h-8 w-[95%]" />
              </div>
            </CardContent>
          </Card>
          <div className={"w-72 h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
        </div>
      </div>
      <div className={
        cn("lg:hidden flex flex-row justify-center gap-x-6 mt-24 px-12 w-full")
      }>
        <div className={"flex flex-col justify-between h-full items-center basis-1/2 transition-all drop-shadow-lg -skew-y-3 -translate-x-4 scale-90"}>
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col transition-all justify-center items-center w-full mb-6 cursor-default">
              <Skeleton className="rounded-lg transition-all border-primary/50 border-4 aspect-video w-full" />
              <Image src="/profile-banner-images/chapmanpantherwaving.gif"
                className="rounded-lg transition-all border-primary border-4 hidden"
                alt="Chapman Panther Waving" width={400} height={225} />
            </div>
            <div className="flex flex-col w-full gap-y-2 justify-center items-center">
              <Skeleton className="h-8 w-[95%] bg-primary/50" />
              <Skeleton className="h-8 w-[90%] bg-primary/50" />
              <Skeleton className="h-8 w-[80%] bg-primary/50" />
            </div>
          </div>
          <div className={"w-72 h-4 mt-16 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
        </div>
        <div className={cn("flex flex-col w-full justify-between items-center basis-1/2 transition-all h-full skew-y-3 translate-x-4 scale-90")}>
          <ul className={
            cn("grid grid-rows-8 p-2 grid-flow-col gap-2 w-full duration-150 transition-all drop-shadow-lg")
          }>
            <li className="row-span-2 w-full">
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-16 bg-primary text-primary-foreground rounded-md" />
            </li>
            <li className="row-span-2 w-full">  
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md" />
            </li>
            <li className="row-span-2 w-full">
              <Skeleton className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md" />
            </li>
          </ul>
          <div className={cn("w-72 h-4 rounded-[50%] blur-lg transition-all mt-16 bg-black/30")}></div>
        </div>
      </div>
    </>
  );
};
 
export default DesktopHeadingLoading;