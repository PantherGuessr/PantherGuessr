import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetRecentGames = (clerkId: string | undefined, numberOfGames: number = 5) => {
  const result = useQuery(api.users.getLastNPlayedGames, clerkId ? { clerkId, n: numberOfGames } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
