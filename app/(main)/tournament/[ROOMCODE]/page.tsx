"use client";

import { use, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Clock, Home, Loader2, LockKeyhole, Search } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { CountdownOverlay } from "../_components/countdown-overlay";
import { SpectatorSounds } from "../_components/spectator-sounds";

const SpectatorMap = dynamic(() => import("./_components/spectator-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ),
});

type Props = { params: Promise<{ ROOMCODE: string }> };

type PlayerStatus = "searching" | "locked_in" | "waiting";

function PlayerStatusBadge({ status }: { status: PlayerStatus }) {
  if (status === "locked_in") {
    return <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium text-green-500">
      <LockKeyhole className="h-4 w-4" />
      <span className="pt-1">Locked In</span>
    </div>;
  }
  if (status === "waiting") {
    return <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium text-yellow-500">
      <Clock className="h-4 w-4" />
      <span className="pt-1">Waiting</span>
    </div>;
  }
  return <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium text-yellow-500">
      <Search className="h-4 w-4" />
      <span className="pt-1">Searching</span>
    </div>;
}

function PlayerSlot({
  clerkId,
  label,
  users,
  size = "default",
  color,
  status,
}: {
  clerkId: string | undefined;
  label: string;
  users: Array<{ clerkId: string; username: string; picture: string; level: bigint }>;
  size?: "default" | "large";
  color?: "p1color" | "p2color";
  status?: PlayerStatus;
}) {
  if (!clerkId) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">Waiting for {label}...</span>
      </div>
    );
  }
  const user = users.find((u) => u.clerkId === clerkId);
  if (!user) return null;
  return (
    <div className="flex flex-col items-center gap-1">
      <Avatar className={cn("overflow-hidden border-4", size === "large" ? "h-[100px] w-[100px]" : "h-[60px] w-[60px]", color === "p1color" ? "border-blue-500" : color === "p2color" ? "border-orange-500" : "border-transparent")}>
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        <AvatarImage
          src={user.picture}
          alt={`${user.username}'s Profile Picture`}
          className="object-cover"
        />
      </Avatar>
      <span className="font-semibold">{user.username}</span>
      {status !== undefined ? (
        <PlayerStatusBadge status={status} />
      ) : (
        <span className="text-sm text-muted-foreground">Lvl. {Number(user.level)}</span>
      )}
    </div>
  );
}

export default function SpectatorPage({ params }: Props) {
  const { ROOMCODE } = use(params);
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const room = useQuery(api.tournament.getTournamentRoomByCode, { roomCode: ROOMCODE });
  const guesses = useQuery(
    api.tournament.getTournamentGuessesForRound,
    room ? { roomId: room._id, round: room.currentRound } : "skip"
  );

  const clerkIds = [room?.player1ClerkId, room?.player2ClerkId].filter(Boolean) as string[];
  const rawUsers = useQuery(
    api.tournament.getUsersByClerkIds,
    clerkIds.length > 0 ? { clerkIds } : "skip"
  );
  const users = (rawUsers ?? []).map((u) => ({
    clerkId: u!.clerkId,
    username: u!.username,
    picture: u!.picture,
    level: u!.level,
  }));

  const currentGameQuery = useQuery(
    api.game.getGameById,
    room?.currentGameId ? { id: room.currentGameId } : "skip"
  );
  const levelId =
    currentGameQuery &&
    room &&
    (currentGameQuery[`round_${room.currentRound}` as keyof typeof currentGameQuery] as string | undefined);
  const imageSrc = useQuery(
    api.game.getImageSrc,
    levelId ? { id: levelId as Id<"levels"> } : "skip"
  );

  const showRoundSummary = useMutation(api.tournament.showRoundSummary);
  const advanceToNextRound = useMutation(api.tournament.advanceToNextRound);
  const startGame = useMutation(api.tournament.startTournamentGame);
  const resetRoom = useMutation(api.tournament.resetTournamentRoom);
  const createNewLobby = useMutation(api.tournament.createNewLobbyFromExisting);

  const isOrganizer = currentUser?.user.clerkId === room?.organizerClerkId;

  // Win sound — track status transitions so we only fire on the change, not on initial load
  const prevStatusRef = useRef<string | null>(null);
  useEffect(() => {
    if (!room) return;
    const prev = prevStatusRef.current;
    prevStatusRef.current = room.status;
    if (prev === null || prev === room.status) return; // initial load or no change
    if (room.status === "finished") {
      const p1Wins = room.player1TotalScore > room.player2TotalScore;
      const tied = room.player1TotalScore === room.player2TotalScore;
      if (!tied) {
        new Audio(`/audio/tournament/${p1Wins ? "p1-wins.mp3" : "p2-wins.mp3"}`).play().catch(() => {});
      }
    }
  }, [room?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const p1Guess = guesses?.find((g) => g.playerClerkId === room?.player1ClerkId);
  const p2Guess = guesses?.find((g) => g.playerClerkId === room?.player2ClerkId);
  const bothSubmitted = !!p1Guess?.hasSubmitted && !!p2Guess?.hasSubmitted;

  function playerStatus(guess: typeof p1Guess): PlayerStatus {
    if (room!.status === "round_summary") return "waiting";
    if (guess?.hasSubmitted) return "locked_in";
    return "searching";
  }

  if (room === undefined) {
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

  if (!isOrganizer && currentUser !== undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-destructive">Access Denied</p>
      </div>
    );
  }

  if (room.status === "waiting") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <Link href="/" className="absolute left-4 top-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <div className="flex flex-row items-center gap-2">
          <Logo logoDimensions={100} textOptions="text-3xl" badge="Tournament" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Room Code</p>
          <p className="text-5xl font-bold tracking-widest">{room.roomCode}</p>
        </div>
        <div className="flex gap-16">
          <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} size="large" />
          <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} size="large" />
        </div>
        {isOrganizer && room.player1ClerkId && room.player2ClerkId && (
          <Button onClick={() => startGame({ roomId: room._id })} size="lg">
            Start Game
          </Button>
        )}
      </div>
    );
  }

  if (room.status === "finished") {
    const p1User = users.find((u) => u.clerkId === room.player1ClerkId);
    const p2User = users.find((u) => u.clerkId === room.player2ClerkId);
    const p1Wins = room.player1TotalScore > room.player2TotalScore;
    const tied = room.player1TotalScore === room.player2TotalScore;

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
        <Link href="/" className="absolute left-4 top-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Game Over</h1>
        {tied ? (
          <p className="text-xl">It&apos;s a tie!</p>
        ) : (
          <p className="text-xl font-semibold">
            {(p1Wins ? p1User : p2User)?.username ?? "Winner"} wins!
          </p>
        )}
        <div className="flex gap-16 text-center">
          <div>
            <p className="text-sm text-muted-foreground">{p1User?.username}</p>
            <p className="text-4xl font-bold">{room.player1TotalScore}</p>
          </div>
          <div className="self-center text-2xl font-bold text-muted-foreground">vs</div>
          <div>
            <p className="text-sm text-muted-foreground">{p2User?.username}</p>
            <p className="text-4xl font-bold">{room.player2TotalScore}</p>
          </div>
        </div>
        {isOrganizer && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => resetRoom({ roomId: room._id })}
            >
              Play Again
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={async () => {
                const result = await createNewLobby({ roomId: room._id });
                router.push(`/tournament/${result.roomCode}`);
              }}
            >
              New Lobby
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <CountdownOverlay countdownStartedAt={room.countdownStartedAt} />
      <SpectatorSounds
        countdownStartedAt={room.countdownStartedAt}
        p1Submitted={!!p1Guess?.hasSubmitted}
        p2Submitted={!!p2Guess?.hasSubmitted}
      />
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} status={playerStatus(p1Guess)} color={"p1color"} />
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center gap-2">
            <Logo logoDimensions={100} textOptions="text-3xl" badge="Tournament" />
          </div>
          <span className="text-sm text-muted-foreground">
            Round {room.currentRound}/5
          </span>
        </div>
        <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} status={playerStatus(p2Guess)} color={"p2color"} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="relative flex-1">
          <SpectatorMap
            room={room}
            p1Guess={p1Guess ?? null}
            p2Guess={p2Guess ?? null}
          />
        </div>

        {/* Right panel: image + controls */}
        <div className="flex w-[600px] max-w-[50%] flex-col gap-4 border-l p-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-secondary">
            {imageSrc ? (
              <Image src={imageSrc} alt="" fill className="object-cover aspect-4/3" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            {(() => {
              const maxScore = Math.max(room.player1TotalScore, room.player2TotalScore, 1);
              const p1Pct = (room.player1TotalScore / maxScore) * 100;
              const p2Pct = (room.player2TotalScore / maxScore) * 100;
              return (
                <>
                  <div className="relative flex w-full items-center justify-start overflow-hidden rounded bg-secondary px-3 py-2">
                    <div className="relative z-10 flex w-full justify-between">
                      <span className="font-medium text-white">
                        {users.find((u) => u.clerkId === room.player1ClerkId)?.username ?? "P1"}
                      </span>
                      <span className="font-bold text-white">{room.player1TotalScore}</span>
                    </div>
                    <div
                      className="absolute left-0 top-0 h-full rounded bg-blue-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${p1Pct}%` }}
                    />
                  </div>
                  <div className="relative flex w-full items-center justify-start overflow-hidden rounded bg-secondary px-3 py-2">
                    <div className="relative z-10 flex w-full justify-between">
                      <span className="font-medium text-white">
                        {users.find((u) => u.clerkId === room.player2ClerkId)?.username ?? "P2"}
                      </span>
                      <span className="font-bold text-white">{room.player2TotalScore}</span>
                    </div>
                    <div
                      className="absolute left-0 top-0 h-full rounded bg-orange-500 transition-[width] duration-700 ease-out"
                      style={{ width: `${p2Pct}%` }}
                    />
                  </div>
                </>
              );
            })()}</div>

          {isOrganizer && (
            <div className="mt-auto flex flex-col gap-2">
              {room.status === "round_active" && (
                <Button
                  onClick={() => showRoundSummary({ roomId: room._id })}
                  disabled={!bothSubmitted}
                  size="sm"
                >
                  Show Results
                </Button>
              )}
              {room.status === "round_summary" && (
                <Button
                  onClick={() => advanceToNextRound({ roomId: room._id })}
                  size="sm"
                >
                  {room.currentRound >= 5 ? "End Tournament" : "Next Round"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
