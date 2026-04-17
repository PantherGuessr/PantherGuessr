import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetSelectedBackground = (clerkId: string | undefined) => {
  const result = useQuery(api.users.getSelectedBackground, clerkId ? { clerkId } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
