"use client";

import { NewUserHeading } from "@/app/(marketing)/_components/new-user-heading";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import ProfileHoverCard from "@/components/profile-hover-card";
import { WelcomeMessage } from "@/components/text/welcomemessage";

import { useCurrentUser } from "@/hooks/use-current-user";

import DesktopHeading from "./desktop-heading";
import DesktopHeadingLoading from "./desktop-heading-loading";
import "./header-animation.css";
import MobileDrawer from "./mobiledrawer";

export const Heading = () => {
  const { data: currentUser, isLoading, isAuthenticated } = useCurrentUser();

  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    setWelcomeMessage(WelcomeMessage());
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  return (
    <div className="flex flex-col flex-grow space-y-4 w-full">
      {!isAuthenticated && isLoading && (
        <>
          <div className="flex flex-col w-full h-full justify-center items-center pt-48">
            <LoaderCircle className="animate-spin-quick-load h-20 w-20" />
          </div>
        </>
      )}
      {isLoading && isAuthenticated && (
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
                  Welcome back, <ProfileHoverCard username={currentUser.user.username} showHoverCard={false} />.{" "}
                  {welcomeMessage}
                </h1>
              </div>
              <div className="flex justify-center items-center px-8 animate-fly-in-from-top-delay-1000ms">
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
