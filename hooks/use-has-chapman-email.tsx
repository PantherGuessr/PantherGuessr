import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useHasChapmanEmail = (clerkId: string | undefined) => {
  const result = useQuery(api.users.hasChapmanEmail, clerkId ? { clerkId } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
