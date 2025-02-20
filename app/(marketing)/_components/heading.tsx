"use client";

import Image from "next/image";
import { SignUpButton, useUser } from "@clerk/clerk-react";
import { useConvexAuth, useQuery } from "convex/react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import MobileDrawer from "./mobiledrawer";

import "./header-animation.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { WelcomeMessage } from "@/components/text/welcomemessage";
import { api } from "@/convex/_generated/api";
import { useBanCheck } from "@/hooks/use-ban-check";
import { useHasOngoingGame } from "@/hooks/use-has-ongoing-game";
import { useGetSelectedBackground } from "@/hooks/userProfiles/use-get-selected-background";
import { useGetSelectedTagline } from "@/hooks/userProfiles/use-get-selected-tagline";
import DesktopHeading from "./desktop-heading";
import DesktopHeadingLoading from "./desktop-heading-loading";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const clerkUser = useUser();
  const user = useQuery(api.users.getUserByUsername, { username: clerkUser.user?.username ?? "" });
  const { result: isBanned, isLoading: isBanCheckLoading } = useBanCheck(user?.clerkId);
  const { result: profileTagline } = useGetSelectedTagline(user?.clerkId);
  const { result: profileBackground, isLoading: profileBackgroundLoading } = useGetSelectedBackground(user?.clerkId);
  const { result: hasOngoingGame, isLoading: hasOngoingGameLoading } = useHasOngoingGame(user?.clerkId);

  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    setWelcomeMessage(WelcomeMessage());
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${user?.username}`);
    }
  }, [user?.username, isBanned, router]);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <div className="space-y-4 w-full">
      {isLoading && isBanCheckLoading && (
        <>
          <div className="hidden md:flex flex-col w-full">
            <DesktopHeadingLoading />
          </div>
          {/* mobile loading */}
          <div className={"md:hidden flex flex-col justify-center items-center"}>
            <LoaderCircle className="h-20 w-20 animate-spin" />
          </div>
        </>
      )}
      {isAuthenticated &&
        !isLoading &&
        user &&
        clerkUser.user &&
        profileTagline &&
        !profileBackgroundLoading &&
        !hasOngoingGameLoading && (
          <>
            {isDesktop ? (
              <DesktopHeading
                username={user.username || "Guest"}
                picture={clerkUser.user.imageUrl}
                background={profileBackground!.backgroundCSS}
                hasOngoingGame={hasOngoingGame ?? false}
                streak={Number(user.currentStreak)}
                lastPlayedTime={Number(user.lastPlayedTimestamp)}
              />
            ) : (
              <>
                <div className="flex flex-col justify-center items-center basis-1/2 px-8 mb-4">
                  <Image
                    src="/logo.svg"
                    height="120"
                    width="120"
                    alt="Logo"
                    className="dark:hidden animate-fly-in-from-top-delay-0ms"
                  />
                  <Image
                    src="/logo-dark.svg"
                    height="120"
                    width="120"
                    alt="Logo"
                    className="hidden dark:block animate-fly-in-from-top-delay-0ms"
                  />
                  <h1
                    className={
                      "text-2xl sm:text-3xl md:text-3xl font-bold transition-all drop-shadow-lg px-2 mb-3 mt-6 animate-fly-in-from-top-delay-500ms"
                    }
                  >
                    Welcome back, <span className="underline">{user.username}</span>. {welcomeMessage}
                  </h1>
                </div>
                <div className="flex justify-center items-center px-8 animate-fly-in-from-top-delay-1000ms">
                  <MobileDrawer hasOngoingGame={hasOngoingGame ?? false} />
                </div>
              </>
            )}
          </>
        )}
      {!isAuthenticated && !isLoading && (
        <>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
            Can you find your way around Chapman? Find out at <span className="underline">PantherGuessr</span>.
          </h1>
          <h3 className="text-base sm:text-xl md:text-2xl font-medium">
            PantherGuessr is the fun game where <br />
            your directional skills are challenged.
          </h3>

          <SignUpButton mode="modal" fallbackRedirectUrl={window.location.href}>
            <Button>
              Join for Free <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </SignUpButton>
        </>
      )}
    </div>
  );
};
