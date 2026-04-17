"use client";

import { createContext, ReactNode, useContext } from "react";
import { useConvexAuth, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

type UserProfile = NonNullable<typeof api.users.getCurrentUserProfile._returnType>;

interface CurrentUserContextType {
  data: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const CurrentUserContext = createContext<CurrentUserContextType>({
  data: null,
  isLoading: true,
  isAuthenticated: false,
});

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const profile = useQuery(api.users.getCurrentUserProfile, isAuthenticated ? {} : "skip");

  const value: CurrentUserContextType = {
    data: profile ?? null,
    isLoading: authLoading || (isAuthenticated && profile === undefined),
    isAuthenticated,
  };

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
};

export const useCurrentUser = () => useContext(CurrentUserContext);
