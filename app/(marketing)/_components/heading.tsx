"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Can you find your way around Chapman? Find out at <span className="underline">PantherGuessr</span>.
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">
                PantherGuessr is the fun game where <br />
                your directional skills are challenged.
            </h3>
            <Button>
                Enter PantherGuessr
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}