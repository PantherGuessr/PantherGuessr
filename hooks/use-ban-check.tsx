import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useBanCheck = (userClerkId: string | null = null) => {
  const { user } = useUser();
  const clerkId = userClerkId || user?.id || "";
  const queryResult = useQuery(api.users.isUserBanned, { clerkId });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (queryResult !== undefined) {
      setIsLoading(false);
    }
  }, [queryResult]);

  return {
    result: queryResult?.result,
    banReason: queryResult?.banReason,
    appealActive: queryResult?.appealSubmitted,
    isLoading,
  };
};
