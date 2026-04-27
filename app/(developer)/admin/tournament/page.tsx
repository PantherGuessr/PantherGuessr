"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Copy, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const STATUS_LABELS: Record<string, string> = {
  waiting: "Waiting",
  round_active: "In Progress",
  round_summary: "Round Summary",
  finished: "Finished",
};

export default function TournamentAdminPage() {
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const createRoom = useMutation(api.tournament.createTournamentRoom);
  const deleteRoom = useMutation(api.tournament.deleteTournamentRoom);
  const myRooms = useQuery(api.tournament.getRoomsByOrganizer, {});

  const handleDelete = async (roomId: Id<"tournamentRooms">) => {
    setIsDeletingId(roomId);
    try {
      await deleteRoom({ roomId });
      setConfirmDeleteId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createRoom({ name: roomName || undefined });
      setCreatedCode(result.roomCode);
      setRoomName("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Tournament Rooms</h1>

      <div className="mb-8 rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Create New Room</h2>
        <div className="flex gap-3">
          <Input
            placeholder="Room name (optional)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="flex-1"
          />
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
            Create
          </Button>
        </div>

        {createdCode && (
          <div className="mt-4 rounded-md bg-secondary p-4">
            <p className="mb-1 text-sm text-muted-foreground">Room created! Share this code:</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold tracking-widest">{createdCode}</span>
              <Button variant="ghost" size="sm" onClick={() => copyCode(createdCode)}>
                <Copy className="mr-1 h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Link href={`/tournament/${createdCode}`} target="_blank">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Spectator
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Your Rooms</h2>
        {myRooms === undefined ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : myRooms.length === 0 ? (
          <p className="text-muted-foreground">No rooms created yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {myRooms.map((room) => (
              <div key={room._id} className="flex items-center justify-between rounded-md border bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{room.roomCode}</span>
                    {room.name && <span className="text-muted-foreground">— {room.name}</span>}
                  </div>
                  <span className="text-sm text-muted-foreground">{STATUS_LABELS[room.status] ?? room.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/tournament/${room.roomCode}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Open
                    </Button>
                  </Link>
                  {confirmDeleteId === room._id ? (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeletingId === room._id}
                        onClick={() => handleDelete(room._id)}
                      >
                        {isDeletingId === room._id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setConfirmDeleteId(room._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
