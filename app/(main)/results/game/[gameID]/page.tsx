"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";

import { Footer } from "@/components/footer";
import ProfileHoverCard from "@/components/profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useGameType } from "@/hooks/use-game-type";
import { getTotalScore } from "@/lib/utils";
import { getNextWeeklyResetTimestamp, getNextWeeklyResetUTC } from "@/lib/weeklytimes";

type GameLeaderboardProps = {
  params: Promise<{ gameID: string }>;
};

export default function GameLeaderboardPage({ params }: GameLeaderboardProps) {
  const { gameID } = use(params) as { gameID: string };
  const gameIdAsId = gameID as Id<"games">;

  // Get game type
  const { gameType, loading: gameTypeLoading } = useGameType(gameIdAsId);

  // Fetch all necessary data
  const currentUser = useQuery(api.users.current);
  const leaderboardEntries = useQuery(api.game.getLeaderboardEntriesForGame, gameID ? { gameId: gameIdAsId } : "skip");
  const userEntry = useQuery(
    api.game.getLeaderboardEntryByGameAndUser,
    gameID && currentUser?._id ? { gameId: gameIdAsId, userId: currentUser._id } : "skip"
  );

  // isLoading state
  const isLoading =
    gameTypeLoading ||
    leaderboardEntries === undefined ||
    currentUser === undefined ||
    (currentUser && userEntry === undefined);

  // Countdown state
  const [countdown, setCountdown] = useState<string>("");

  // updates the countdown for weekly challenge refresh
  useEffect(() => {
    if (gameType !== "weekly") return;

    const updateCountdown = () => {
      const now = new Date();
      const resetTime = getNextWeeklyResetTimestamp();
      const diff = resetTime - now.getTime();
      if (diff <= 0) {
        setCountdown("Weekly challenge has reset!");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [gameType]);

  // Top 25 entries
  const topEntries = useMemo(() => {
    if (!leaderboardEntries) return [];
    return leaderboardEntries.slice(0, 25);
  }, [leaderboardEntries]);

  // find user rank
  const userRank = useMemo(() => {
    // return null if still loading
    if (leaderboardEntries === undefined || userEntry === undefined) {
      return null;
    }
    // if done loading but there's no entry for user return -1.
    if (userEntry === null) {
      return -1;
    }
    // find rank of entry
    const idx = leaderboardEntries.findIndex((e) => e._id === userEntry._id);
    return idx >= 0 ? idx + 1 : -1;
  }, [leaderboardEntries, userEntry]);

  // If user is not in top 25, add their entry to the table
  const displayEntries = useMemo(() => {
    // return top entries if not loaded or no user entry
    if (!topEntries || !userEntry) return topEntries;
    const inTop = topEntries.some((e) => e._id === userEntry._id);
    // add in user's entry if not in top
    return inTop ? topEntries : [...topEntries, userEntry];
  }, [topEntries, userEntry]);

  return (
    <div className="flex flex-col w-screen h-full min-h-screen justify-between">
      <div className="w-full max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {gameType === "weekly" ? "Weekly Challenge " : "Game "}Leaderboard
        </h1>
        {gameType === "weekly" && (
          <div className="mb-4 text-center">
            <span className="font-semibold">Weekly Challenge resets in:</span> {countdown}
          </div>
        )}
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="p-2">Rank</TableHead>
              <TableHead className="p-2">User</TableHead>
              <TableHead className="p-2">Round 1</TableHead>
              <TableHead className="p-2">Round 2</TableHead>
              <TableHead className="p-2">Round 3</TableHead>
              <TableHead className="p-2">Round 4</TableHead>
              <TableHead className="p-2">Round 5</TableHead>
              <TableHead className="p-2">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(displayEntries ?? []).map((entry, idx) => {
              const rank = leaderboardEntries ? leaderboardEntries.findIndex((e) => e._id === entry._id) + 1 : idx + 1;
              const isCurrentUser = userEntry && entry._id === userEntry._id;
              return (
                <TableRow key={entry._id} className={isCurrentUser ? "bg-red-600/10 dark:bg-red-600/30" : ""}>
                  <TableCell className="p-2 text-center">{rank}</TableCell>
                  <TableCell className="p-2 flex items-center gap-2">
                    <ProfileHoverCard userID={entry.userId} isUnderlined={true} />
                  </TableCell>
                  <TableCell className="p-2 text-start">
                    <p className="font-bold">{entry.round_1} pts</p>
                    <p>{entry.round_1_distance} ft</p>
                  </TableCell>
                  <TableCell className="p-2 text-start">
                    <p className="font-bold">{entry.round_2} pts</p>
                    <p>{entry.round_2_distance} ft</p>
                  </TableCell>
                  <TableCell className="p-2 text-start">
                    <p className="font-bold">{entry.round_3} pts</p>
                    <p>{entry.round_3_distance} ft</p>
                  </TableCell>
                  <TableCell className="p-2 text-start">
                    <p className="font-bold">{entry.round_4} pts</p>
                    <p>{entry.round_4_distance} ft</p>
                  </TableCell>
                  <TableCell className="p-2 text-start">
                    <p className="font-bold">{entry.round_5} pts</p>
                    <p>{entry.round_5_distance} ft</p>
                  </TableCell>
                  <TableCell className="p-2 text-start font-bold">{getTotalScore(entry)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* This JSX now correctly handles the three states for userRank */}
        {!isLoading && (
          <>
            {userRank && userRank > 0 ? (
              <div className="mt-4 text-center">
                <span className="font-semibold">Your Rank:</span> {userRank}
              </div>
            ) : userRank === -1 ? (
              <div className="flex flex-col items-center justify-center mt-6">
                <p className="mb-2">You are not ranked on this leaderboard.</p>
                <Link href={`/game/${gameID}`}>
                  <Button>
                    Let&apos;s change that! <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
