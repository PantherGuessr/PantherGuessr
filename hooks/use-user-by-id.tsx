import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const useUserById = (userId?: Id<"users">) => {
  const fetchUser = useQuery(api.users.getUserById, userId ? { id: userId } : "skip");
  return fetchUser ?? null;
};

export default useUserById;
