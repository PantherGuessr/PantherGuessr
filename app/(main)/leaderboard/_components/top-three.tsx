import ProfileHoverCard from "@/components/profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { Doc } from "@/convex/_generated/dataModel";
import { LeaderboardType } from "@/convex/leaderboard";

type TopThreeProps = {
  users: Doc<"users">[];
  type: LeaderboardType;
};

const getStatValue = (user: Doc<"users">, type: LeaderboardType): string => {
  switch (type) {
    case "streak":
      return `${user.currentStreak} day${user.currentStreak === 1n ? '' : 's'}`;
    case "level":
      return `Level ${user.level} (${user.currentXP} XP)`;
    case "totalPoints":
      return `${user.totalPointsEarned || 0n} points`;
    default:
      return "";
  }
};

const getStatLabel = (type: LeaderboardType): string => {
  switch (type) {
    case "streak":
      return "Current Streak";
    case "level":
      return "Level & XP";
    case "totalPoints":
      return "Total Points";
    default:
      return "";
  }
};

export function TopThree({ users, type }: TopThreeProps) {
  const topThree = users.slice(0, 3);
  const statLabel = getStatLabel(type);

  if (topThree.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No users found for this leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Top 3 - {statLabel}</h2>
      <div className="flex flex-col md:flex-row items-end justify-center gap-4">
        {/* Second Place */}
        {topThree[1] && (
          <Card className="flex flex-col items-center p-6 w-full md:w-64 h-72 justify-center bg-slate-100 dark:bg-slate-800">
            <Badge variant="secondary" className="mb-2 bg-slate-300 dark:bg-slate-600">
              2nd Place
            </Badge>
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={topThree[1].picture} alt={topThree[1].username} />
              <AvatarFallback>{topThree[1].username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <ProfileHoverCard userID={topThree[1]._id} isUnderlined={true} />
            <p className="text-lg font-semibold text-center mt-2">
              {getStatValue(topThree[1], type)}
            </p>
          </Card>
        )}

        {/* First Place */}
        <Card className="flex flex-col items-center p-6 w-full md:w-64 h-80 justify-center bg-yellow-100 dark:bg-yellow-900">
          <Badge variant="default" className="mb-2 bg-yellow-500 text-yellow-900 dark:bg-yellow-400 dark:text-yellow-900">
            🏆 1st Place
          </Badge>
          <Avatar className="w-24 h-24 mb-4 ring-4 ring-yellow-400">
            <AvatarImage src={topThree[0].picture} alt={topThree[0].username} />
            <AvatarFallback>{topThree[0].username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <ProfileHoverCard userID={topThree[0]._id} isUnderlined={true} />
          <p className="text-xl font-bold text-center mt-2">
            {getStatValue(topThree[0], type)}
          </p>
        </Card>

        {/* Third Place */}
        {topThree[2] && (
          <Card className="flex flex-col items-center p-6 w-full md:w-64 h-72 justify-center bg-orange-100 dark:bg-orange-900">
            <Badge variant="outline" className="mb-2 border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-300">
              3rd Place
            </Badge>
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={topThree[2].picture} alt={topThree[2].username} />
              <AvatarFallback>{topThree[2].username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <ProfileHoverCard userID={topThree[2]._id} isUnderlined={true} />
            <p className="text-lg font-semibold text-center mt-2">
              {getStatValue(topThree[2], type)}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
