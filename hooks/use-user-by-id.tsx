import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface GameData {
  gameContent: Doc<"games">;
  startingRound?: number;
  startingScores?: number[];
  startingDistances?: number[];
}

const useUserById = (userId?: Id<"users">) => {
  const [userData, setUserData] = useState<Doc<"users"> | null>(null);

  const fetchUser = useQuery(api.users.getUserById, userId ? { id: userId } : "skip");

  useEffect(() => {
    if (fetchUser) {
      setUserData(fetchUser);
    }
  }, [fetchUser]);

  return userData;
};

export default useUserById;