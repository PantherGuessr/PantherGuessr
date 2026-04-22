"use client";

import { Clock, Loader2, LockKeyhole, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type PlayerStatus = "searching" | "locked_in" | "waiting";

export type TournamentUser = {
  clerkId: string;
  username: string;
  picture: string;
  level?: bigint;
};

export function PlayerStatusBadge({ status }: { status: PlayerStatus }) {
  if (status === "locked_in") {
    return (
      <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium text-green-500">
        <LockKeyhole className="h-4 w-4" />
        <span className="pt-1">Locked In</span>
      </div>
    );
  }
  if (status === "waiting") {
    return (
      <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium text-yellow-500">
        <Clock className="h-4 w-4" />
        <span className="pt-1">Waiting</span>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center justify-center gap-2 text-sm font-medium text-yellow-500">
      <Search className="h-4 w-4" />
      <span className="pt-1">Searching</span>
    </div>
  );
}

export function PlayerSlot({
  clerkId,
  label,
  users,
  size = "default",
  color,
  status,
}: {
  clerkId: string | undefined;
  label: string;
  users: TournamentUser[];
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
      <Avatar
        className={cn(
          "overflow-hidden border-4",
          size === "large" ? "h-[100px] w-[100px]" : "h-[60px] w-[60px]",
          color === "p1color" ? "border-blue-500" : color === "p2color" ? "border-orange-500" : "border-transparent"
        )}
      >
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
        <AvatarImage src={user.picture} alt={`${user.username}'s Profile Picture`} className="object-cover" />
      </Avatar>
      <span className="font-semibold">{user.username}</span>
      {status !== undefined ? (
        <PlayerStatusBadge status={status} />
      ) : user.level !== undefined ? (
        <span className="text-sm text-muted-foreground">Lvl. {Number(user.level)}</span>
      ) : null}
    </div>
  );
}
