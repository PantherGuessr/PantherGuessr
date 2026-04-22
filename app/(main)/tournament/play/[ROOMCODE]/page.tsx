"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

import { GameProvider } from "@/app/(main)/game/_context/GameContext";
import { TournamentProvider } from "@/app/(main)/game/_context/TournamentContext";
import InGameSidebar from "@/app/(main)/game/_components/in-game-sidebar";
import DynamicInteractableMap from "@/app/(main)/game/_components/map-wrapper";

import "@/app/(main)/game/_components/game-animations.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { CountdownOverlay } from "@/app/(main)/tournament/_components/countdown-overlay";

type Props = { params: Promise<{ ROOMCODE: string }> };

function PlayerSlotMini({
  clerkId,
  label,
  users,
}: {
  clerkId: string | undefined;
  label: string;
  users: Array<{ clerkId: string; username: string; picture: string }>;
}) {
  if (!clerkId) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Waiting for {label}...</span>
      </div>
    );
  }
  const user = users.find((u) => u.clerkId === clerkId);
  return (
    <div className="flex items-center gap-2">
      {user?.picture && (
        <Avatar className="h-[28px] w-[28px] overflow-hidden">
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        <AvatarImage
          src={user.picture}
          alt={`${user.username}'s Profile Picture`}
          className="object-cover"
        />
      </Avatar>
      )}
      <span className="font-medium">{user?.username ?? clerkId.slice(0, 8)}</span>
    </div>
  );
}

function WaitingScreen({
  roomCode,
  room,
  users,
}: {
  roomCode: string;
  room: {
    player1ClerkId?: string;
    player2ClerkId?: string;
    status: string;
  };
  users: Array<{ clerkId: string; username: string; picture: string }>;
}) {
  const leaveRoom = useMutation(api.tournament.leaveTournamentRoom);
  const router = useRouter();
  const roomQuery = useQuery(api.tournament.getTournamentRoomByCode, { roomCode });
  const roomId = roomQuery?._id;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-row items-center gap-2">
        <Logo logoDimensions={100} textOptions="text-3xl" badge="Tournament" />
      </div>
      <h1 className="text-2xl font-bold">Room {roomCode}</h1>
      <div className="flex gap-12">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Player 1</span>
          <PlayerSlotMini clerkId={room.player1ClerkId} label="Player 1" users={users} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Player 2</span>
          <PlayerSlotMini clerkId={room.player2ClerkId} label="Player 2" users={users} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Waiting for the organizer to start...</span>
      </div>
      {roomId && (
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await leaveRoom({ roomId });
            router.push("/");
          }}
        >
          Leave Room
        </Button>
      )}
    </div>
  );
}

function RoundSummaryOverlay({ onWait }: { onWait: boolean }) {
  if (!onWait) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-3 rounded-lg bg-card p-6 text-card-foreground shadow-xl">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p className="text-sm font-medium">Waiting for next round...</p>
      </div>
    </div>
  );
}

type RoundTrackerProps = {
  roomId: Id<"tournamentRooms">;
  localRound: number;
  onRoundAdvance: () => void;
};

function RoundTracker({ roomId, localRound, onRoundAdvance }: RoundTrackerProps) {
  const room = useQuery(api.tournament.getTournamentRoomById, { roomId });
  const prevRound = useRef(localRound);

  useEffect(() => {
    if (!room) return;
    if (room.currentRound > prevRound.current) {
      prevRound.current = room.currentRound;
      onRoundAdvance();
    }
  }, [room?.currentRound, onRoundAdvance, room]);

  return null;
}

export default function TournamentPlayPage({ params }: Props) {
  const { ROOMCODE } = use(params);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { data: currentUser } = useCurrentUser();

  const room = useQuery(api.tournament.getTournamentRoomByCode, { roomCode: ROOMCODE });

  const clerkIds = [room?.player1ClerkId, room?.player2ClerkId].filter(Boolean) as string[];
  const rawUsers = useQuery(
    api.tournament.getUsersByClerkIds,
    clerkIds.length > 0 ? { clerkIds } : "skip"
  );
  const users = (rawUsers ?? []).map((u) => ({
    clerkId: u!.clerkId,
    username: u!.username,
    picture: u!.picture,
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Room not found.</p>
      </div>
    );
  }

  if (room.status === "waiting") {
    return (
      <WaitingScreen
        roomCode={ROOMCODE}
        room={room}
        users={users}
      />
    );
  }

  if (room.status === "finished") {
    const p1User = users.find((u) => u.clerkId === room.player1ClerkId);
    const p2User = users.find((u) => u.clerkId === room.player2ClerkId);
    const isP1 = clerkId === room.player1ClerkId;
    const myScore = isP1 ? room.player1TotalScore : room.player2TotalScore;
    const theirScore = isP1 ? room.player2TotalScore : room.player1TotalScore;
    const won = myScore > theirScore;
    const tied = myScore === theirScore;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-3xl font-bold">
          {tied ? "It&apos;s a tie!" : won ? "You win! 🎉" : "You lose"}
        </h1>
        <div className="flex gap-12 text-center">
          <div>
            <p className="text-xs text-muted-foreground">{p1User?.username ?? "P1"}</p>
            <p className="text-4xl font-bold">{room.player1TotalScore}</p>
          </div>
          <div className="self-center text-xl text-muted-foreground">vs</div>
          <div>
            <p className="text-xs text-muted-foreground">{p2User?.username ?? "P2"}</p>
            <p className="text-4xl font-bold">{room.player2TotalScore}</p>
          </div>
        </div>
        <Button onClick={() => router.push("/")} variant="outline">
          Back to Home
        </Button>
      </div>
    );
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
      <CountdownOverlay countdownStartedAt={room.countdownStartedAt} />
      <GameProvider key={gameKey} gameId={room.currentGameId} startingRound={room.currentRound}>
        <RoundTracker
          roomId={room._id}
          localRound={localRound}
          onRoundAdvance={handleRoundAdvance}
        />
        <div className="relative">
          {showSummaryOverlay && <RoundSummaryOverlay onWait={true} />}
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
