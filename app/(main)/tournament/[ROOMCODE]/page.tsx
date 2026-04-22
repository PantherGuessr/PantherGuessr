"use client";

import { use, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CountdownOverlay } from "../_components/countdown-overlay";
import { SpectatorSounds } from "../_components/spectator-sounds";
import { SpectatorWaitingLobby } from "./_components/waiting-lobby";
import { SpectatorGameOver } from "./_components/game-over-screen";
import { ScoreBars } from "./_components/score-bars";
import { SpectatorHeader } from "./_components/spectator-header";
import { OrganizerControls } from "./_components/organizer-controls";
import { PlayerStatus } from "../_components/player-slot";

const SpectatorMap = dynamic(() => import("./_components/spectator-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ),
});

type Props = { params: Promise<{ ROOMCODE: string }> };

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
    (currentGameQuery[`round_${room.currentRound}` as keyof typeof currentGameQuery] as
      | string
      | undefined);
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

  // Win sound — only fires on the status transition to "finished"
  const prevStatusRef = useRef<string | null>(null);
  useEffect(() => {
    if (!room) return;
    const prev = prevStatusRef.current;
    prevStatusRef.current = room.status;
    if (prev === null || prev === room.status) return;
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
      <SpectatorWaitingLobby
        room={room}
        users={users}
        isOrganizer={isOrganizer}
        onStartGame={() => startGame({ roomId: room._id })}
      />
    );
  }

  if (room.status === "finished") {
    return (
      <SpectatorGameOver
        room={room}
        users={users}
        isOrganizer={isOrganizer}
        onPlayAgain={() => resetRoom({ roomId: room._id })}
        onNewLobby={async () => {
          const result = await createNewLobby({ roomId: room._id });
          router.push(`/tournament/${result.roomCode}`);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* key forces fresh mount on each new countdown so useState initializer always runs */}
      <CountdownOverlay key={room.countdownStartedAt} countdownStartedAt={room.countdownStartedAt} />
      <SpectatorSounds
        countdownStartedAt={room.countdownStartedAt}
        p1Submitted={!!p1Guess?.hasSubmitted}
        p2Submitted={!!p2Guess?.hasSubmitted}
      />
      <SpectatorHeader
        room={room}
        users={users}
        p1Status={playerStatus(p1Guess)}
        p2Status={playerStatus(p2Guess)}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1">
          <SpectatorMap room={room} p1Guess={p1Guess ?? null} p2Guess={p2Guess ?? null} />
        </div>
        <div className="flex w-[600px] max-w-[50%] flex-col gap-4 border-l p-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-md bg-secondary">
            {imageSrc ? (
              <Image src={imageSrc} alt="" fill className="aspect-4/3 object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          <ScoreBars room={room} users={users} />
          {isOrganizer && (
            <OrganizerControls
              room={room}
              bothSubmitted={bothSubmitted}
              onShowRoundSummary={() => showRoundSummary({ roomId: room._id })}
              onAdvanceToNextRound={() => advanceToNextRound({ roomId: room._id })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
