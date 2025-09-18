import ProfileHoverCard from "@/components/profile-hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Doc } from "@/convex/_generated/dataModel";
import { LeaderboardType } from "@/convex/leaderboard";

type RemainingTableProps = {
  users: Doc<"users">[];
  description: string;
  type: LeaderboardType;
  currentUser?: Doc<"users"> | null;
  userRank?: number | null;
};

const getStatValue = (user: Doc<"users">, type: LeaderboardType): string => {
  switch (type) {
    case "streak":
      return `${user.currentStreak} day${user.currentStreak === 1n ? "" : "s"}`;
    case "level":
      return `Level ${user.level}`;
    case "totalPoints":
      return `${user.totalPointsEarned || 0n}`;
    default:
      return "";
  }
};

const getSecondaryStatValue = (user: Doc<"users">, type: LeaderboardType): string => {
  switch (type) {
    case "streak":
      return `Level ${user.level}`;
    case "level":
      return `${user.currentXP} XP`;
    case "totalPoints":
      return `Level ${user.level}`;
    default:
      return "";
  }
};

const getStatHeader = (type: LeaderboardType): string => {
  switch (type) {
    case "streak":
      return "Current Streak";
    case "level":
      return "Level";
    case "totalPoints":
      return "Total Points";
    default:
      return "";
  }
};

const getSecondaryStatHeader = (type: LeaderboardType): string => {
  switch (type) {
    case "streak":
      return "Level";
    case "level":
      return "Experience";
    case "totalPoints":
      return "Level";
    default:
      return "";
  }
};

const getAlignmentClass = (type: LeaderboardType): [string, string] => {
  switch (type) {
    case "streak":
      return ["text-center", "text-start"];
    case "level":
      return ["text-start", "text-center"];
    case "totalPoints":
      return ["text-center", "text-start"];
    default:
      return ["text-start", "text-start"];
  }
};

export function RemainingTable({ users, type, description, currentUser, userRank }: RemainingTableProps) {
  // const remainingUsers = users.slice(3); // Skip top 3 for the table
  const statHeader = getStatHeader(type);
  const secondaryStatHeader = getSecondaryStatHeader(type);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="hidden md:block text-xl font-semibold mb-2">Full Rankings</h3>
      <p className="text-muted-foreground mb-4">{description}</p>

      <Table className="w-full border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 text-center">Rank</TableHead>
            <TableHead className="p-2">User</TableHead>
            <TableHead className={`p-2 ${getAlignmentClass(type)[0]}`}>{statHeader}</TableHead>
            <TableHead className={`p-2 ${getAlignmentClass(type)[1]}`}>{secondaryStatHeader}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = currentUser && user._id === currentUser._id;

            return (
              <TableRow key={user._id} className={isCurrentUser ? "bg-red-600/10 dark:bg-red-600/30" : ""}>
                <TableCell className="p-2 text-center font-semibold">
                  {rank <= 3 ? (
                    <span className="text-lg">
                      {rank === 1 && "🥇"}
                      {rank === 2 && "🥈"}
                      {rank === 3 && "🥉"}
                    </span>
                  ) : (
                    rank
                  )}
                </TableCell>
                <TableCell className="p-2 text-start">
                  <ProfileHoverCard userID={user._id} isUnderlined={true} />
                </TableCell>
                <TableCell className={`p-2 font-semibold ${getAlignmentClass(type)[0]}`}>
                  {getStatValue(user, type)}
                </TableCell>
                <TableCell className={`p-2 text-muted-foreground ${getAlignmentClass(type)[1]}`}>
                  {getSecondaryStatValue(user, type)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Show user rank if they're not in the displayed list */}
      {currentUser && userRank && userRank > users.length && (
        <div className="mt-4 p-3 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Your rank: <span className="font-semibold">{userRank}</span>
          </p>
        </div>
      )}
    </div>
  );
}
