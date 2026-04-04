import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useRoleCheck = (role: string, clerkId: string | undefined) => {
  const result = useQuery(api.users.hasRole, clerkId ? { clerkId, role } : "skip");
  return { result, isLoading: result === undefined && clerkId !== undefined };
};
