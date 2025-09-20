import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

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
