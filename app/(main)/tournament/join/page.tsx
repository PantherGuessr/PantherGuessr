"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Loader2, Shield } from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function TournamentJoinPage() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const [code, setCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinRoom = useMutation(api.tournament.joinTournamentRoom);
  const isDeveloper = currentUser?.roles.isDeveloper ?? false;

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setIsJoining(true);
    setError(null);
    try {
      await joinRoom({ roomCode: trimmed });
      router.push(`/tournament/play/${trimmed}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to join room");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pt-24">
        <h1 className="text-3xl font-bold">Join a Tournament</h1>
        <p className="text-muted-foreground">Enter the room code provided by the organizer.</p>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input
            placeholder="e.g. PG-4X2K"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            className="text-center font-mono text-lg tracking-widest"
            maxLength={7}
          />
          {error && <p className="text-center text-sm text-destructive">{error}</p>}
          <Button onClick={handleJoin} disabled={isJoining || !code.trim()} className="w-full">
            {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Join Room
          </Button>
        </div>
        {isDeveloper && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">Organizer access</p>
            <Link href="/admin/tournament">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Host a Tournament
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
