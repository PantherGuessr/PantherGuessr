"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/clerk-react";
import { WelcomeMessage } from "@/components/text/welcomemessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "usehooks-ts";
import MobileDrawer from "./mobiledrawer";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";


export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const [hoveredMain, setHoveredMain] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 640px)");

    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            setWelcomeMessage(WelcomeMessage());
        }
    }, [isAuthenticated, isLoading, WelcomeMessage]);

    return (
        <div className="space-y-4">
            {isLoading && (
                <div className="flex flex-col justify-center items-center">
                    <Skeleton className="justify-self-center m-1 h-16 w-[400px]" />
                    <Skeleton className="justify-self-center m-1 h-16 w-[80vw]" />
                    <Skeleton className="justify-self-center m-1 h-16 w-[75vw]" />
                    <Skeleton className="justify-self-center mt-6 h-8 w-[40vw]" />
                    <Skeleton className="justify-self-center mt-2 h-8 w-[40vw]" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <>
                <div className="flex flex-row justify-center items-center gap-x-20 pt-20 px-20">
                    <div className="flex flex-col justfy-center items-center basis-1/2">
                        <div className={
                            cn("flex flex-col transition-all justify-center items-center drop-shadow-lg rounded-lg bg-gradient-to-b from-transparent to-primary/50 mb-6",
                                hoveredMain ? "skew-y-0 translate-x-0 scale-100" : "-skew-y-3 -translate-x-4 scale-90")
                            }>
                        <Image src="/profile-banner-images/chapmanpantherwaving.gif"
                            className="rounded-lg transition-all border-primary border-4"
                             alt="Chapman Panther Waving" width={400} height={400} />
                        </div>
                        <h1 className={
                            cn("text-3xl sm:text-3xl md:text-3xl font-bold transition-all drop-shadow-lg",
                                hoveredMain ? "skew-y-0 translate-x-0 scale-100" : "-skew-y-3 -translate-x-4 scale-90"
                            )}>
                            Welcome back, <span className="underline">{user?.username}</span>. {welcomeMessage}
                        </h1>
                    </div>
                    <div className="flex flex-col justfy-center items-center basis-1/2">
                    <ul className={
                        cn("grid grid-rows-8 p-2 grid-flow-col gap-2 w-full duration-150 transition-all drop-shadow-lg",
                         hoveredMain ? "skew-y-0 translate-x-0 scale-100" : "skew-y-3 translate-x-4 scale-90")
                     } onMouseEnter={() => setHoveredMain(true)} onMouseLeave={() => setHoveredMain(false)}>
                            <li className="row-span-2 w-full">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                        Weekly Challenge
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2 w-full">
                                <Link href="/game">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                        Singleplayer
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2 w-full">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                        Multiplayer
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2 w-full">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md">
                                        All Gamemodes
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                {!isDesktop && (
                    <MobileDrawer />
                )}
                </>
            )}
            {!isAuthenticated && !isLoading && (
                <>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Can you find your way around Chapman? Find out at <span className="underline">PantherGuessr</span>.
                </h1>
                <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                PantherGuessr is the fun game where <br />
                your directional skills are challenged.
                </h3>

                <SignUpButton mode="modal">
                    <Button>
                        Join for Free <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </SignUpButton>
                </>
            )}
        </div>
    )
}