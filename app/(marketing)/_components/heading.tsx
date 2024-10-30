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
import './header-animation.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";


export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const [hoveredMain, setHoveredMain] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 900px)");

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

                {isDesktop ?
                (
                <div className="flex flex-row justify-center items-center lg:gap-x-20 sm:gap-x-5 mt-20 px-20" onMouseEnter={() => setHoveredMain(true)} onMouseLeave={() => setHoveredMain(false)}>
                    <div className={
                            cn("flex flex-col justify-between h-full items-center basis-1/3 transition-all drop-shadow-lg",
                                hoveredMain ? "skew-y-0 translate-x-0 scale-100" : "-skew-y-3 -translate-x-4 scale-90"
                            )}>
                        <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-col transition-all justify-center items-center drop-shadow-lg rounded-lg bg-gradient-to-b from-transparent to-primary/50 mb-6">
                        <Image src="/profile-banner-images/chapmanpantherwaving.gif"
                            className="rounded-lg transition-all border-primary border-4"
                             alt="Chapman Panther Waving" width={400} height={400} />
                        </div>
                        <h1 className="text-3xl sm:text-3xl md:text-3xl font-bold">
                            Welcome back, <span className="underline">{user?.username}</span>. {welcomeMessage}
                        </h1>
                        </div>
                        <div className={"w-72 h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
                    </div>
                    <div className={cn("flex flex-col justify-between items-center basis-1/3 transition-all h-full",
                        hoveredMain ? "" : "-translate-y-8 scale-90"
                    )}>
                    <ul className={
                        cn("grid grid-rows-8 p-2 grid-flow-col gap-2 w-full duration-150 transition-all drop-shadow-lg")
                     }>
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
                        <div className={cn("w-72 h-4 bg-black/30 rounded-[50%] blur-lg transition-all",
                            hoveredMain ? "mt-20" : "mt-12"
                        )}></div>
                    </div>
                    <div className={
                            cn("flex flex-col justify-between h-full items-center basis-1/3 transition-all",
                                hoveredMain ? "skew-y-0 translate-x-0 scale-100" : "skew-y-3 translate-x-4 scale-90")}>
                        <Card className="w-full dropshadow-lg">
                            <CardHeader>
                                <CardTitle className="mb-2">
                                    Last Active Friends
                                </CardTitle>
                                <CardContent className="flex flex-col gap-y-2">
                                    <Separator />
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center gap-x-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">dylan</h3>
                                        </div>
                                        <h2 className="text-sm font-bold text-muted-foreground">1m ago</h2>
                                    </div>
                                    <Separator />
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center gap-x-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">jake</h3>
                                        </div>
                                        <h2 className="text-sm font-bold text-muted-foreground">5m ago</h2>
                                    </div>
                                    <Separator />
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center gap-x-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">dan</h3>
                                        </div>
                                        <h2 className="text-sm font-bold text-muted-foreground">16m ago</h2>
                                    </div>
                                    <Separator />
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="flex flex-row items-center gap-x-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold">pete</h3>
                                        </div>
                                        <h2 className="text-sm font-bold text-muted-foreground">2h ago</h2>
                                    </div>
                                </CardContent>
                            </CardHeader>

                        </Card>
                        <div className={"w-72 h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
                    </div>
                </div>) : (
                    <>
                    <div className="flex flex-col justify-center items-center basis-1/2 px-8 mb-4">
                        {/* <div className={"flex flex-col transition-all justify-center items-center drop-shadow-lg rounded-lg bg-gradient-to-b from-transparent to-primary/50 mb-6"}>
                        <Image src="/profile-banner-images/chapmanpantherwaving.gif"
                            className="rounded-lg transition-all border-primary border-4"
                            alt="Chapman Panther Waving" width={400} height={400} />
                        </div> */}
                        <Image 
                            src="/logo.svg"
                            height="120"
                            width="120"
                            alt="Logo"
                            className="dark:hidden animate-fly-in-from-top-delay-0ms"
                        />
                        <Image 
                            src="/logo-dark.svg"
                            height="120"
                            width="120"
                            alt="Logo"
                            className="hidden dark:block animate-fly-in-from-top-delay-0ms"
                        />
                        <h1 className={"text-2xl sm:text-3xl md:text-3xl font-bold transition-all drop-shadow-lg px-2 mb-3 mt-6 animate-fly-in-from-top-delay-500ms"}>
                            Welcome back, <span className="underline">{user?.username}</span>. {welcomeMessage}
                        </h1>
                    </div>
                    <div className="flex justify-center items-center px-8 animate-fly-in-from-top-delay-1000ms">
                        <MobileDrawer />
                    </div>
                    </>
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