import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

export const useGetListOfProfiles = () => {
  const result = useQuery(api.users.getListOfProfiles);
  return { result, isLoading: result === undefined };
};
