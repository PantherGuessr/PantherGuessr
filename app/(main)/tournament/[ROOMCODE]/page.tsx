"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SpectatorMap = dynamic(() => import("./_components/spectator-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ),
});

type Props = { params: Promise<{ ROOMCODE: string }> };

function PlayerSlot({
  clerkId,
  label,
  users,
}: {
  clerkId: string | undefined;
  label: string;
  users: Array<{ clerkId: string; username: string; picture: string; level: bigint }>;
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
      <Avatar className="h-[100px] w-[100px] overflow-hidden">
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        <AvatarImage
          src={user.picture}
          alt={`${user.username}'s Profile Picture`}
          className="object-cover"
        />
      </Avatar>
      <span className="font-semibold">{user.username}</span>
      <span className="text-sm text-muted-foreground">Lvl. {Number(user.level)}</span>
    </div>
  );
}

export default function SpectatorPage({ params }: Props) {
  const { ROOMCODE } = use(params);
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

  const isOrganizer = currentUser?.user.clerkId === room?.organizerClerkId;

  const p1Guess = guesses?.find((g) => g.playerClerkId === room?.player1ClerkId);
  const p2Guess = guesses?.find((g) => g.playerClerkId === room?.player2ClerkId);
  const bothSubmitted = !!p1Guess?.hasSubmitted && !!p2Guess?.hasSubmitted;

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <div className="flex flex-row items-center gap-2">
          <Logo logoDimensions={100} textOptions="text-3xl" badge="Tournament" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Room Code</p>
          <p className="text-5xl font-bold tracking-widest">{room.roomCode}</p>
        </div>
        <div className="flex gap-16">
          <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} />
          <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} />
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
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
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-3">
        <PlayerSlot clerkId={room.player1ClerkId} label="Player 1" users={users} />
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center gap-2">
            <Logo logoDimensions={100} textOptions="text-3xl" badge="Tournament" />
          </div>
          <span className="text-sm text-muted-foreground">
            Round {room.currentRound}/5
          </span>
        </div>
        <PlayerSlot clerkId={room.player2ClerkId} label="Player 2" users={users} />
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
        <div className="flex w-64 flex-col gap-4 border-l p-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-secondary">
            {imageSrc ? (
              <Image src={imageSrc} alt="" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between rounded bg-secondary px-3 py-2">
              <span className="text-muted-foreground">
                {users.find((u) => u.clerkId === room.player1ClerkId)?.username ?? "P1"}
              </span>
              <span className="font-bold">{room.player1TotalScore}</span>
            </div>
            <div className="flex justify-between rounded bg-secondary px-3 py-2">
              <span className="text-muted-foreground">
                {users.find((u) => u.clerkId === room.player2ClerkId)?.username ?? "P2"}
              </span>
              <span className="font-bold">{room.player2TotalScore}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span
                className={p1Guess?.hasSubmitted ? "text-green-500" : ""}
              >
                {p1Guess?.hasSubmitted ? "✓" : "○"}{" "}
                {users.find((u) => u.clerkId === room.player1ClerkId)?.username ?? "P1"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={p2Guess?.hasSubmitted ? "text-green-500" : ""}
              >
                {p2Guess?.hasSubmitted ? "✓" : "○"}{" "}
                {users.find((u) => u.clerkId === room.player2ClerkId)?.username ?? "P2"}
              </span>
            </div>
          </div>

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
