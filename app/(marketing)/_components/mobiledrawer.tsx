"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import "./header-animation.css";

const MobileDrawer = () => {

    return (

        <Sheet>
        <SheetTrigger asChild>
            <Button className="px-8 py-6">
                Enter PantherGuessr <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </SheetTrigger>
        <SheetContent side={"bottom"}>
            <SheetHeader>
                <SheetTitle className="text-2xl">Gamemode Selection</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-y-4 pt-4">
                <Link href="/play">
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                            <h1 className="text-xl font-bold">Weekly Challenge</h1>
                            <p className="italic text-sm">Compete in the weekly challenge</p>
                        </div>
                    </CardContent>
                </Card>
                </Link>
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-4" onClick={() => {
                        document.body.classList.add("animate-body-opacity-scale");
                        setTimeout(() => {
                            window.location.href="/game";
                        }, 800);
                    }}>
                        <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                            <h1 className="text-xl font-bold">Singleplayer</h1>
                            <p className="italic text-sm">The classic way to play PantherGuessr</p>
                        </div>
                    </CardContent>
                </Card>
                <Link href="/play">
                <Card className="bg-primary text-primary-foreground">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                            <h1 className="text-xl font-bold">Multiplayer</h1>
                            <p className="italic text-sm">Play with friends!</p>
                        </div>
                    </CardContent>
                </Card>
                </Link>
                <Link href="/play">
                <Card className="bg-secondary text-secondary-foreground">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                            <h1 className="text-xl font-bold">Other gamemodes</h1>
                        </div>
                    </CardContent>
                </Card>
                </Link>
            </div>
        </SheetContent>
    </Sheet>
    )
}

export default MobileDrawer;