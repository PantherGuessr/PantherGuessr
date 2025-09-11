"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileDrawerProps {
  hasOngoingGame: boolean;
}

const MobileDrawer = ({ hasOngoingGame }: MobileDrawerProps) => {
  const router = useRouter();

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
          {hasOngoingGame ? (
            <>
              <Link href="/game/continue">
                <Card className="bg-primary text-primary-foreground cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                      <h1 className="text-xl font-bold">Continue Game</h1>
                      <p className="italic text-sm">Pick up where you left off!</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/game">
                <Card className="bg-primary text-primary-foreground cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                      <h1 className="text-xl font-bold">New Game</h1>
                      <p className="italic text-sm">Start a new classic PantherGuessr game</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </>
          ) : (
            <Link href="/game">
              <Card className="bg-primary text-primary-foreground cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                    <h1 className="text-xl font-bold">Singleplayer</h1>
                    <p className="italic text-sm">The classic way to play PantherGuessr</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
          {/* <!-- Multiplayer link -->
          <Link href="/play">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-4">
                <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                  <h1 className="text-xl font-bold">Multiplayer</h1>
                  <p className="italic text-sm">Play with friends!</p>
                </div>
              </CardContent>
            </Card>
          </Link> */}
          <Link href="/weekly">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-4">
                <div className="flex flex-col gap-x-2 align-center text-center justify-center">
                  <h1 className="text-xl font-bold">Weekly Challenge</h1>
                  <p className="italic text-sm">Compete in the weekly challenge</p>
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
  );
};

export default MobileDrawer;
