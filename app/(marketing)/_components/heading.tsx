"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/clerk-react";
import { WelcomeMessage } from "@/components/text/welcomemessage";
import { Skeleton } from "@/components/ui/skeleton";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();

    return (
        <div className="max-w-3xl space-y-4">
            {isLoading && (
                <div className="grid">
                <Skeleton className="justify-self-center m-1 h-16 w-[70vw]" />
                <Skeleton className="justify-self-center m-1 h-16 w-[80vw]" />
                <Skeleton className="justify-self-center m-1 h-16 w-[75vw]" />
                <Skeleton className="justify-self-center mt-6 h-8 w-[40vw]" />
                <Skeleton className="justify-self-center mt-2 h-8 w-[40vw]" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                    Welcome back, <span className="underline">{user?.username}</span>. {WelcomeMessage()}
                </h1>
                <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                    PantherGuessr is the fun game where <br />
                    your directional skills are challenged.
                </h3>
                </>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/play">
                        Enter PantherGuessr <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
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