"use client";

import { NewUserHeading } from "@/app/(marketing)/_components/new-user-heading";
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth, useQuery } from "convex/react";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import ProfileHoverCard from "@/components/profile-hover-card";
import { WelcomeMessage } from "@/components/text/welcomemessage";

import { api } from "@/convex/_generated/api";

import { useBanCheck } from "@/hooks/use-ban-check";
import { useHasOngoingGame } from "@/hooks/use-has-ongoing-game";
import { useGetSelectedBackground } from "@/hooks/userProfiles/use-get-selected-background";
import { useGetSelectedTagline } from "@/hooks/userProfiles/use-get-selected-tagline";

import DesktopHeading from "./desktop-heading";
import DesktopHeadingLoading from "./desktop-heading-loading";
import "./header-animation.css";
import MobileDrawer from "./mobiledrawer";

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
    <div className="flex flex-col flex-grow space-y-4 w-full">
      {!isAuthenticated && isLoading && (
        <>
          <div className="flex flex-col w-full h-full justify-center items-center pt-48">
            <LoaderCircle className="animate-spin-quick-load h-20 w-20" />
          </div>
          {/*<div className="flex items-center justify-center gap-x-4 w-full blur-md">*/}
          {/*  <Logo badge={false} logoDimensions={80} textOptions="text-2xl sm:text-5xl md:text-7xl font-semibold" />*/}
          {/*</div>*/}
          {/*<div className="flex flex-col text-muted-foreground md:flex-row flex-grow items-center justify-center px-4 sm:px-10 xl:px-20 pt-4 sm:pt-8">*/}
          {/*  <div className="flex flex-col justify-center items-center px-4 basis-1/2 transition-transform duration-300">*/}
          {/*    <h1 className="text-xl sm:text-4xl font-bold pb-2 sm:pb-8 blur-sm">*/}
          {/*      Can you find your way around campus?*/}
          {/*    </h1>*/}
          {/*    <h2 className="text-lg sm:text-xl font-normal pb-4 sm:pb-8 blur-sm">*/}
          {/*      Test your campus knowledge with <span className="font-bold">PantherGuessr</span>, the free game where*/}
          {/*      you identify the locations of photos around Chapman University*/}
          {/*    </h2>*/}
          {/*    <div className="waitlist-button bg-primary h-16 text-primary-foreground shadow-md animate-pulse flex flex-row justify-center items-center">*/}
          {/*      <p className="text-lg pr-1 blur-sm">Join our waitlist</p>*/}
          {/*      <ArrowRight className="transition-transform translate-x-1 blur-sm" />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className="flex flex-col grow px-4 pt-8 md:pt-0 basis-1/2 ">*/}
          {/*    <Skeleton className="object-contain aspect-4/3 bg-primary rounded-md" />*/}
          {/*  </div>*/}
          {/*</div>*/}
        </>
      )}
      {isLoading && isBanCheckLoading && isAuthenticated && (
        <>
          <div className="hidden md:flex flex-col w-full">
            <DesktopHeadingLoading />
          </div>
          {/* mobile loading */}
          <div className={"md:hidden flex flex-col justify-center items-center"}>
            <LoaderCircle className="h-20 w-20 animate-spin-quick-load" />
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
              <div className="flex flex-col flex-grow w-full h-full items-center justify-center pt-10 px-4">
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
                    Welcome back, <ProfileHoverCard username={user.username} showHoverCard={false} />. {welcomeMessage}
                  </h1>
                </div>
                <div className="flex justify-center items-center px-8 animate-fly-in-from-top-delay-1000ms">
                  <MobileDrawer hasOngoingGame={hasOngoingGame ?? false} />
                </div>
              </div>
            )}
          </>
        )}
      {!isAuthenticated && !isLoading && <NewUserHeading />}
    </div>
  );
};
