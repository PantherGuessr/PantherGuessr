"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { NewUserHeading } from "@/app/(marketing)/_components/new-user-heading";
import ProfileHoverCard from "@/components/profile-hover-card";
import { WelcomeMessage } from "@/components/text/welcomemessage";
import { useCurrentUser } from "@/hooks/use-current-user";
import DesktopHeading from "./desktop-heading";
import DesktopHeadingLoading from "./desktop-heading-loading";

import "./header-animation.css";

import MobileDrawer from "./mobiledrawer";

export const Heading = () => {
  const { data: currentUser, isLoading, isAuthenticated } = useCurrentUser();

  const [welcomeMessage] = useState(() => WelcomeMessage());

  const router = useRouter();

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <div className="flex w-full flex-grow flex-col space-y-4">
      {!isAuthenticated && isLoading && (
        <>
          <div className="flex h-full w-full flex-col items-center justify-center pt-48">
            <LoaderCircle className="animate-spin-quick-load h-20 w-20" />
          </div>
        </>
      )}
      {isLoading && isAuthenticated && (
        <>
          <div className="hidden w-full flex-col md:flex">
            <DesktopHeadingLoading />
          </div>
          {/* mobile loading */}
          <div className={"flex flex-col items-center justify-center md:hidden"}>
            <LoaderCircle className="animate-spin-quick-load h-20 w-20" />
          </div>
        </>
      )}
      {isAuthenticated && !isLoading && currentUser && (
        <>
          {isDesktop ? (
            <DesktopHeading
              username={currentUser.user.username || "Guest"}
              picture={currentUser.user.picture}
              background={currentUser.selectedBackground!.backgroundCSS}
              hasOngoingGame={currentUser.hasOngoingGame}
              streak={Number(currentUser.user.currentStreak)}
              lastPlayedTime={Number(currentUser.user.lastPlayedTimestamp)}
            />
          ) : (
            <div className="flex h-full w-full flex-grow flex-col items-center justify-center px-4 pt-10">
              <div className="mb-4 flex basis-1/2 flex-col items-center justify-center px-8">
                <Image
                  src="/pantherguessr_logo.svg"
                  height="180"
                  width="180"
                  alt="Logo"
                  className="animate-fly-in-from-top-delay-0ms"
                />
                <h1
                  className={
                    "animate-fly-in-from-top-delay-500ms mb-3 mt-6 px-2 text-2xl font-bold drop-shadow-lg transition-all sm:text-3xl md:text-3xl"
                  }
                >
                  Welcome back, <ProfileHoverCard username={currentUser.user.username} showHoverCard={false} />.{" "}
                  {welcomeMessage}
                </h1>
              </div>
              <div className="animate-fly-in-from-top-delay-1000ms flex items-center justify-center px-8">
                <MobileDrawer hasOngoingGame={currentUser.hasOngoingGame} />
              </div>
            </div>
          )}
        </>
      )}
      {!isAuthenticated && !isLoading && <NewUserHeading />}
    </div>
  );
};
