"use client";
import { use, useEffect, useMemo } from "react";
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


type GameLeaderboardProps = {
  params: Promise<{ gameID: string }>;
};

export default function GameLeaderboardPage({ params }: GameLeaderboardProps) {
  const { gameID } = use(params);
  const gameIdAsId = gameID as Id<"games">;
  const currentUser = useQuery(api.users.current);

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
        <h1 className="text-3xl font-bold mb-6 text-center">Game Leaderboard</h1>
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
