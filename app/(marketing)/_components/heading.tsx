"use client";

import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/clerk-react";
import { WelcomeMessage } from "@/components/text/welcomemessage";

export const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();

    return (
        <div className="max-w-3xl space-y-4">
            {isAuthenticated && !isLoading ? (
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                    Welcome back, <span className="underline">{user?.username}</span>. {WelcomeMessage()}
                </h1>
            ) : (
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                    Can you find your way around Chapman? Find out at <span className="underline">PantherGuessr</span>.
                </h1>
            )}
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                PantherGuessr is the fun game where <br />
                your directional skills are challenged.
            </h3>
            {isLoading && (
                <div className="w-full flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            )}
            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href="/play">
                        Enter PantherGuessr <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading && (
                <SignUpButton mode="modal">
                    <Button>
                        Join for Free <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </SignUpButton>
            )}
        </div>
    )
}