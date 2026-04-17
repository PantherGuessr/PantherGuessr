import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetSelectedTagline = (clerkId: string | undefined) => {
  const result = useQuery(api.users.getSelectedTagline, clerkId ? { clerkId } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
