import Link from "next/link";
import { ArrowRight, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";

interface GameHistoryProps {
  recentGames: Doc<"leaderboardEntries">[] | undefined | null;
  isCurrentUser: boolean;
}

const GameHistory = ({ recentGames, isCurrentUser }: GameHistoryProps) => {
  // Calculate the time since a game was played
  const calculateTimeSince = (creationTime: number) => {
    // separate by minutes, hours, days, weeks, or months
    const time = new Date(creationTime);
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    // calculate string to return
    /* if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else 
     */
    if (weeks > 0) {
      return `${weeks}w${weeks > 1 ? "" : ""} ago`;
    } else if (days > 0) {
      return `${days}d${days > 1 ? "" : ""} ago`;
    } else if (hours > 0) {
      return `${hours}h${hours > 1 ? "" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes}m${minutes > 1 ? "" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Calculate the total score for a game
  const calculateGameTotalScore = (game: Doc<"leaderboardEntries">) => {
    return Number(game.round_1 + game.round_2 + game.round_3 + game.round_4 + game.round_5) | 0;
  };

  // Redirect to the leaderboard page for the game
  const handleLeaderboardRedirect = (gameId: string) => {
    window.location.href = `/results/${gameId}`;
  };

  return (
    <>
      <Card className="w-full mt-4 md:mt-2">
        <CardHeader>
          <CardTitle className="text-xl text-primary text-start font-bold">Game History</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGames && recentGames.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="hidden md:table-cell">XP Earned</TableHead>
                  <TableHead className="hidden sm:table-cell">Played</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentGames &&
                  recentGames.map((game, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-start font-bold">
                        Singleplayer {/* TODO: Implement game type recognition */}
                      </TableCell>
                      <TableCell className="text-start">{calculateGameTotalScore(game)}</TableCell>
                      <TableCell className="text-start hidden md:table-cell">{game.xpGained}</TableCell>
                      <TableCell className="text-start hidden sm:table-cell">
                        {calculateTimeSince(game._creationTime)}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleLeaderboardRedirect(game._id)}>
                          <ReceiptText />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <>
              {isCurrentUser ? (
                <>
                  <p className="text-center">You don&apos;t have any recent games...</p>
                  <Link href="/">
                    <Button className="mt-4 mb-2 px-8">
                      Let&apos;s change that! <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-center">This user doesn&apos;t have any recent games.</p>
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default GameHistory;
