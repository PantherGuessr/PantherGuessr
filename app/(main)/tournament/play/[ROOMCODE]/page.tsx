"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { DoorOpen, Home, Loader2 } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import InGameSidebar from "@/app/(main)/game/_components/in-game-sidebar";
import DynamicInteractableMap from "@/app/(main)/game/_components/map-wrapper";
import { GameProvider } from "@/app/(main)/game/_context/GameContext";
import { TournamentProvider } from "@/app/(main)/game/_context/TournamentContext";
import { CountdownOverlay } from "@/app/(main)/tournament/_components/countdown-overlay";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { PlayerGameOver } from "./_components/player-game-over";
import { RoundSummaryOverlay } from "./_components/round-summary-overlay";
import { RoundTracker } from "./_components/round-tracker";
import { WaitingScreen } from "./_components/waiting-screen";

import "@/app/(main)/game/_components/game-animations.css";

type Props = { params: Promise<{ ROOMCODE: string }> };

export default function TournamentPlayPage({ params }: Props) {
  const { ROOMCODE } = use(params);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { data: currentUser } = useCurrentUser();

  const room = useQuery(api.tournament.getTournamentRoomByCode, { roomCode: ROOMCODE });

  const clerkIds = [room?.player1ClerkId, room?.player2ClerkId].filter(Boolean) as string[];
  const rawUsers = useQuery(api.tournament.getUsersByClerkIds, clerkIds.length > 0 ? { clerkIds } : "skip");
  const users = (rawUsers ?? []).map((u) => ({
    clerkId: u!.clerkId,
    username: u!.username,
    picture: u!.picture,
    level: u!.level,
  }));

  const [gameKey, setGameKey] = useState(0);
  const [localRound, setLocalRound] = useState(1);

  const clerkId = currentUser?.user.clerkId ?? "";
  const showSummaryOverlay = room?.status === "round_summary";

  const handleRoundAdvance = () => {
    setLocalRound((r) => r + 1);
    setGameKey((k) => k + 1);
  };

  if (room === undefined || currentUser === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 pb-10 pt-40 text-center">
          <h1 className="text-4xl font-bold">Room Not Found</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            This tournament room doesn&apos;t exist or has already been closed.
          </p>
          <div className="mt-4 flex gap-4">
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Home
              </Button>
            </Link>
            <Link href="/tournament/join">
              <Button>
                <DoorOpen className="mr-2 h-4 w-4" /> Join a Room
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (room.status === "waiting") {
    return <WaitingScreen roomCode={ROOMCODE} roomId={room._id} room={room} users={users} />;
  }

  if (room.status === "finished") {
    return <PlayerGameOver room={room} users={users} clerkId={clerkId} roomCode={ROOMCODE} />;
  }

  if (!room.currentGameId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <TournamentProvider roomId={room._id} roomCode={ROOMCODE}>
      {/* key forces fresh mount on each new countdown so useState initializer always runs */}
      <CountdownOverlay key={room.countdownStartedAt} countdownStartedAt={room.countdownStartedAt} />
      <GameProvider key={gameKey} gameId={room.currentGameId} startingRound={room.currentRound}>
        <RoundTracker roomId={room._id} localRound={localRound} onRoundAdvance={handleRoundAdvance} />
        <div className="relative">
          <RoundSummaryOverlay visible={showSummaryOverlay} />
          <div
            className={cn(
              "animate-body-opacity-scale-in flex h-screen w-full overflow-y-auto",
              isMobile ? "flex-col" : "flex-row"
            )}
          >
            <InGameSidebar />
            <div className={cn("flex grow rounded-sm", isMobile ? "p-3" : "py-4 pl-0 pr-4")}>
              <DynamicInteractableMap />
            </div>
          </div>
        </div>
      </GameProvider>
    </TournamentProvider>
  );
}
