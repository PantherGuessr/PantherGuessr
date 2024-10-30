"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "usehooks-ts";
import MobileDrawer from "./mobiledrawer";
import Image from "next/image";
import './header-animation.css';
import DesktopHeading from "./desktop-heading";
import { useEffect, useState } from "react";
import { WelcomeMessage } from "@/components/text/welcomemessage";


export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();

    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        setWelcomeMessage(WelcomeMessage());
    }, [WelcomeMessage]);

    const isDesktop = useMediaQuery("(min-width: 640px)");
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
                    <DesktopHeading username={user!.username || "Guest"} />
                ) : (
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