"use client";

import { useState } from "react";

import { Footer } from "@/components/footer";
import Spinner from "@/components/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardType } from "@/convex/leaderboard";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { RemainingTable } from "./_components/remaining-table";
import { TopThree } from "./_components/top-three";

const LEADERBOARD_TYPES: {
  key: LeaderboardType;
  label: string;
  description: string;
}[] = [
  {
    key: "streak",
    label: "Longest Streak",
    description: "The top 25 players with the longest current daily streaks",
  },
  {
    key: "level",
    label: "Level & XP",
    description: "The top 25 players with the highest levels and experience points",
  },
  {
    key: "totalPoints",
    label: "Total Points",
    description: "The top 25 players with the most total points earned across all games",
  },
];

export default function LeaderboardPage() {
  const [selectedType, setSelectedType] = useState<LeaderboardType>("level");
  const { topUsers, currentUser, userRank, displayEntries, isLoading } = useLeaderboard(selectedType);

  const selectedTypeInfo = LEADERBOARD_TYPES.find((t) => t.key === selectedType);

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-between">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Global Leaderboard</h1>

          {/* Leaderboard Type Selection Tabs */}
          <Tabs
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as LeaderboardType)}
            className="w-full"
          >
            <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
              {LEADERBOARD_TYPES.map((type) => (
                <TabsTrigger key={type.key} value={type.key} className="text-sm">
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {LEADERBOARD_TYPES.map((type) => (
              <TabsContent key={type.key} value={type.key} className="mt-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Spinner />
                    <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
                  </div>
                ) : (
                  <>
                    {/* Top 3 Users Display */}
                    <TopThree users={topUsers} type={selectedType} />

                    {/* Full Rankings Table */}
                    <RemainingTable
                      users={displayEntries}
                      description={selectedTypeInfo?.description || ""}
                      type={selectedType}
                      currentUser={currentUser}
                      userRank={userRank}
                    />

                    {/* User's Current Rank Display */}
                    {userRank !== null && userRank > 0 && (
                      <div className="mt-6 text-center">
                        <div className="inline-block rounded-lg bg-muted p-4">
                          <p className="mb-1 text-sm text-muted-foreground">Your Current Rank</p>
                          <p className="text-2xl font-bold">#{userRank}</p>
                        </div>
                      </div>
                    )}

                    {/* No rank message */}
                    {userRank === -1 && (
                      <div className="mt-6 text-center">
                        <div className="inline-block rounded-lg bg-muted p-4">
                          <p className="text-sm text-muted-foreground">
                            You're not ranked on this leaderboard yet. Play some games to get started!
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
