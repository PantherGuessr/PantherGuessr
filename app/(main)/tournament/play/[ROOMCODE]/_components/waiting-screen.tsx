"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";

import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type WaitingUser = { clerkId: string; username: string; picture: string };

function PlayerSlotMini({
  clerkId,
  label,
  users,
}: {
  clerkId: string | undefined;
  label: string;
  users: WaitingUser[];
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
          <AvatarImage src={user.picture} alt={`${user.username}'s Profile Picture`} className="object-cover" />
        </Avatar>
      )}
      <span className="font-medium">{user?.username ?? clerkId.slice(0, 8)}</span>
    </div>
  );
}

export function WaitingScreen({
  roomCode,
  roomId,
  room,
  users,
}: {
  roomCode: string;
  roomId: Id<"tournamentRooms">;
  room: { player1ClerkId?: string; player2ClerkId?: string };
  users: WaitingUser[];
}) {
  const leaveRoom = useMutation(api.tournament.leaveTournamentRoom);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-row items-center gap-2">
        <Logo logoDimensions={100} textOptions="text-2xl" badge="Tournament" stackOnMobile={true} />
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
    </div>
  );
}
