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
      return `${user.currentStreak} day${user.currentStreak === 1n ? "" : "s"}`;
    case "level":
      return `Level ${user.level} (${user.currentXP} XP)`;
    case "totalPoints":
      return `${user.totalPointsEarned || 0n} points`;
    default:
      return "";
  }
};

// const getStatLabel = (type: LeaderboardType): string => {
//   switch (type) {
//     case "streak":
//       return "Current Streak";
//     case "level":
//       return "Level & XP";
//     case "totalPoints":
//       return "Total Points";
//     default:
//       return "";
//   }
// };

export function TopThree({ users, type }: TopThreeProps) {
  const topThree = users.slice(0, 3);
  // const statLabel = getStatLabel(type);

  if (topThree.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No users found for this leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-8 hidden w-full max-w-4xl md:block">
      {/* <h2 className="text-2xl font-bold text-center mb-6">Top 3 - {statLabel}</h2> */}
      <div className="mt-24 hidden items-end justify-center gap-4 md:flex md:flex-row">
        {/* Second Place */}
        {topThree[1] && (
          <Card className="flex h-48 w-full flex-col items-center justify-start bg-slate-100 p-6 dark:bg-slate-800 md:w-64">
            <div className="flex -translate-y-20 flex-col items-center">
              <Avatar className="mb-4 h-20 w-20 ring-4 ring-slate-300 dark:ring-slate-600">
                <AvatarImage className="object-cover" src={topThree[1].picture} alt={topThree[1].username} />
                <AvatarFallback>{topThree[1].username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Badge
                variant="secondary"
                className="mb-2 select-none bg-slate-300 hover:bg-slate-300 dark:bg-slate-600 hover:dark:bg-slate-600"
              >
                2nd Place
              </Badge>
              <ProfileHoverCard userID={topThree[1]._id} />
              <p className="mt-2 text-center text-lg font-semibold">{getStatValue(topThree[1], type)}</p>
            </div>
          </Card>
        )}

        {/* First Place */}
        <Card className="flex h-56 w-full flex-col items-center justify-start bg-yellow-100 p-6 dark:bg-yellow-900 md:w-64">
          <div className="flex -translate-y-20 flex-col items-center">
            <Avatar className="mb-4 h-24 w-24 ring-4 ring-yellow-400">
              <AvatarImage className="object-cover" src={topThree[0].picture} alt={topThree[0].username} />
              <AvatarFallback>{topThree[0].username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Badge
              variant="default"
              className="mb-2 select-none bg-yellow-500 text-yellow-900 hover:bg-yellow-500 dark:bg-yellow-400 dark:text-yellow-900 hover:dark:bg-yellow-400"
            >
              🏆 1st Place
            </Badge>
            <ProfileHoverCard userID={topThree[0]._id} />
            <p className="mt-2 text-center text-xl font-bold">{getStatValue(topThree[0], type)}</p>
          </div>
        </Card>

        {/* Third Place */}
        {topThree[2] && (
          <Card className="flex h-44 w-full flex-col items-center justify-start bg-orange-100 p-6 dark:bg-orange-900 md:w-64">
            <div className="flex -translate-y-20 flex-col items-center">
              <Avatar className="mb-4 h-20 w-20 ring-4 ring-orange-400 dark:ring-orange-700">
                <AvatarImage className="object-cover" src={topThree[2].picture} alt={topThree[2].username} />
                <AvatarFallback>{topThree[2].username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Badge
                variant="default"
                className="mb-2 select-none bg-orange-300 text-orange-700 hover:bg-orange-300 dark:bg-orange-700 dark:text-orange-200 hover:dark:bg-orange-700"
              >
                3rd Place
              </Badge>
              <ProfileHoverCard userID={topThree[2]._id} />
              <p className="mt-2 text-center text-lg font-semibold">{getStatValue(topThree[2], type)}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
