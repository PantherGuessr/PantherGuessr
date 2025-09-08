"use client";
import { use, useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileHoverCard from "@/components/profile-hover-card";
import { Id } from "@/convex/_generated/dataModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTotalScore } from "@/lib/utils";
import { Footer } from "@/components/footer";
import { useIsGameWeekly } from "@/hooks/use-is-game-weekly";
import { getNextWeeklyResetTimestamp, getNextWeeklyResetUTC } from "@/lib/weeklytimes";


type GameLeaderboardProps = {
  params: Promise<{ gameID: string }>;
};

export default function GameLeaderboardPage({ params }: GameLeaderboardProps) {
  const { gameID } = use(params) as { gameID: string };
  const gameIdAsId = gameID as Id<"games">;
  const currentUser = useQuery(api.users.current);

  // Weekly challenge check
  const { isWeekly, loading: weeklyLoading } = useIsGameWeekly(gameIdAsId);

  // Countdown state
  const [countdown, setCountdown] = useState<string>("");

  // Calculate next Monday 17:00 UTC
  useEffect(() => {
    if (!isWeekly) return;

    // Helper to check if a date is in daylight savings for Pacific Time
    function isPacificDaylightTime(date: Date) {
      // DST starts second Sunday in March, ends first Sunday in November
      const year = date.getUTCFullYear();
      // Second Sunday in March
      const march = new Date(Date.UTC(year, 2, 1));
      const marchDay = march.getUTCDay();
      const dstStart = new Date(Date.UTC(year, 2, 8 - marchDay));
      // First Sunday in November
      const november = new Date(Date.UTC(year, 10, 1));
      const novDay = november.getUTCDay();
      const dstEnd = new Date(Date.UTC(year, 10, 1 - novDay));
      return date >= dstStart && date < dstEnd;
    }

    const getNextMondayResetUTC = () => {
      const now = new Date();
      // Determine if we're in PDT (UTC-7) or PST (UTC-8)
      const resetHourUTC = isPacificDaylightTime(now) ? 16 : 17;
      // Find this week's Monday at resetHourUTC
      const thisMonday = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - ((now.getUTCDay() + 6) % 7), // go back to Monday
        resetHourUTC, 0, 0, 0
      ));
      if (now.getTime() < thisMonday.getTime()) {
        return thisMonday;
      } else {
        // Next Monday
        const nextMonday = new Date(thisMonday);
        nextMonday.setUTCDate(thisMonday.getUTCDate() + 7);
        return nextMonday;
      }
    };

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
  }, [isWeekly]);

  // Fetch all leaderboard entries for this game
  const leaderboardEntries = useQuery(
    api.game.getLeaderboardEntriesForGame,
    gameID ? { gameId: gameIdAsId } : "skip"
  );

  // Fetch current user's entry for this game using Convex user _id
  const userEntry = useQuery(
    api.game.getLeaderboardEntryByGameAndUser,
    gameID && currentUser?._id ? { gameId: gameIdAsId, userId: currentUser._id } : "skip"
  );

  // Top 25 entries
  const topEntries = useMemo(() => {
    if (!leaderboardEntries) return [];
    return leaderboardEntries.slice(0, 25);
  }, [leaderboardEntries]);

  // Find user's rank
  const userRank = useMemo(() => {
    if (!leaderboardEntries || !userEntry) return null;
    const idx = leaderboardEntries.findIndex(e => e._id === userEntry._id);
    return idx >= 0 ? idx + 1 : null;
  }, [leaderboardEntries, userEntry]);

  // If user is not in top 25, add their entry to the table
  const displayEntries = useMemo(() => {
    if (!topEntries || !userEntry) return topEntries;
    const inTop = topEntries.some(e => e._id === userEntry._id);
    return inTop ? topEntries : [...topEntries, userEntry];
  }, [topEntries, userEntry]);

  return (
    <div className="flex flex-col w-screen h-full min-h-screen justify-between">
      <div className="w-full max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isWeekly ? "Weekly Challenge " : "Game "}Leaderboard
        </h1>
        {isWeekly && (
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
            {displayEntries.map((entry, idx) => {
              const rank = leaderboardEntries
                ? leaderboardEntries.findIndex(e => e._id === entry._id) + 1
                : idx + 1;
              const isCurrentUser = userEntry && entry._id === userEntry._id;
              return (
                <TableRow
                  key={entry._id}
                  className={
                    isCurrentUser
                      ? "bg-red-600/10 dark:bg-red-600/30"
                      : ""
                  }
                >
                  <TableCell className="p-2 text-center">{rank}</TableCell>
                  <TableCell className="p-2 flex items-center gap-2">
                    {/* TODO: Implement avatars for users later */}
                    {/* <Avatar className="w-[32px] h-[32px]">
                      <AvatarFallback>
                        {entry.username ? entry.username[0].toUpperCase() : "U"}
                      </AvatarFallback>
                      <AvatarImage
                        alt={`${entry.username}'s Profile Picture`}
                        className="object-cover"
                      />
                    </Avatar> */}
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
        {userRank && (
          <div className="mt-4 text-center">
            <span className="font-semibold">Your Rank:</span> {userRank}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
