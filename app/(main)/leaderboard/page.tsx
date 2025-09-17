"use client";

import { useState } from "react";

import { Footer } from "@/components/footer";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";

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
    description: "Users with the longest current daily streaks" 
  },
  { 
    key: "level", 
    label: "Level & XP", 
    description: "Users with the highest levels and experience points" 
  },
  { 
    key: "totalPoints", 
    label: "Total Points", 
    description: "Users with the most total points earned across all games" 
  },
];

export default function LeaderboardPage() {
  const [selectedType, setSelectedType] = useState<LeaderboardType>("streak");
  const { topUsers, currentUser, userRank, displayEntries, isLoading } = useLeaderboard(selectedType);

  const selectedTypeInfo = LEADERBOARD_TYPES.find(t => t.key === selectedType);

  if (isLoading) {
    return (
      <div className="flex flex-col w-screen h-full min-h-screen justify-center items-center">
        <Spinner />
        <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-full min-h-screen justify-between">
      <div className="w-full max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Global Leaderboard</h1>
          <p className="text-muted-foreground mb-6">
            {selectedTypeInfo?.description}
          </p>
          
          {/* Leaderboard Type Selection Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {LEADERBOARD_TYPES.map((type) => (
              <Button
                key={type.key}
                variant={selectedType === type.key ? "default" : "outline"}
                onClick={() => setSelectedType(type.key)}
                className="min-w-32"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Top 3 Users Display */}
        <TopThree users={topUsers} type={selectedType} />
        
        {/* Full Rankings Table */}
        <RemainingTable 
          users={displayEntries} 
          type={selectedType}
          currentUser={currentUser}
          userRank={userRank}
        />

        {/* User's Current Rank Display */}
        {userRank !== null && userRank > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-block p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Your Current Rank</p>
              <p className="text-2xl font-bold">#{userRank}</p>
            </div>
          </div>
        )}

        {/* No rank message */}
        {userRank === -1 && (
          <div className="mt-6 text-center">
            <div className="inline-block p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                You're not ranked on this leaderboard yet. Play some games to get started!
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
