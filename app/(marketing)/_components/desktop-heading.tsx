import { useState } from "react";
import Link from "next/link";
import { Calendar, Trophy, User } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { Logo } from "@/components/logo";
import ProfileHoverCard from "@/components/profile-hover-card";
import { WelcomeMessage } from "@/components/text/welcomemessage";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import "../../(users)/profile/[USERNAME]/backgrounds.css";

import LargeStreakBadge from "./_panels/large-streak-badge";

import "./heading.css";

interface DesktopHeadingProps {
  username: string;
  picture: string;
  background: string;
  hasOngoingGame: boolean;
  streak: number;
  lastPlayedTime?: number;
}

const DesktopHeading: React.FC<DesktopHeadingProps> = ({
  username,
  picture,
  background,
  hasOngoingGame,
  streak,
  lastPlayedTime,
}) => {
  const [hoveredLeftMain, setHoveredLeftMain] = useState(false);
  const [hoveredCenterMain, setHoveredCenterMain] = useState(false);
  const [hoveredRightMain, setHoveredRightMain] = useState(false);

  const [welcomeMessage] = useState(() => WelcomeMessage());

  const handleGoToUserProfile = () => {
    window.location.href = "/profile/" + username;
  };

  const isLargeDesktop = useMediaQuery("(min-width: 1024px)");

  if (isLargeDesktop) {
    return (
      <div className="flex h-full w-full flex-grow flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center gap-x-4">
          <Logo logoDimensions={160} textOptions="text-2xl sm:text-5xl md:text-7xl font-semibold" />
        </div>
        <div className="mt-10 flex flex-row items-stretch justify-center px-20 pt-4 sm:gap-x-5 sm:pt-8 lg:gap-x-10">
          <div
            className={cn(
              "flex h-full basis-1/3 flex-col items-center justify-between drop-shadow-lg transition-all",
              hoveredLeftMain ? "translate-x-0 skew-y-0 scale-100" : "-translate-x-4 -skew-y-3 scale-90"
            )}
            onMouseEnter={() => setHoveredLeftMain(true)}
            onMouseLeave={() => setHoveredLeftMain(false)}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  "align-center mb-6 flex aspect-video w-full cursor-default flex-col items-center justify-center rounded-lg border-4 border-primary drop-shadow-lg transition-all hover:scale-105",
                  background
                )}
              >
                <Avatar className="my-10 h-28 w-28 cursor-pointer rounded-full border-4 border-primary bg-primary drop-shadow-md transition-all hover:scale-105">
                  <AvatarImage
                    src={picture}
                    className="object-cover"
                    alt="Profile Picture"
                    onClick={handleGoToUserProfile}
                  />
                </Avatar>
              </div>
              <h1 className="cursor-default text-3xl font-bold transition-all hover:scale-105 sm:text-3xl md:text-3xl">
                Welcome back, <ProfileHoverCard username={username} />.{" " + welcomeMessage}
              </h1>
            </div>
            <div className={"mt-12 h-4 w-[90%] rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
          </div>
          <div
            className={cn(
              "flex h-full basis-1/3 flex-col items-center justify-between transition-all",
              hoveredCenterMain ? "" : "-translate-y-8 scale-90"
            )}
            onMouseEnter={() => setHoveredCenterMain(true)}
            onMouseLeave={() => setHoveredCenterMain(false)}
          >
            <ul
              className={cn(
                "grid w-full grid-flow-row grid-cols-2 grid-rows-8 gap-2 p-2 drop-shadow-lg transition-all duration-150"
              )}
            >
              {hasOngoingGame ? (
                <>
                  <li className="col-span-1 row-span-2">
                    <Link href="/game/continue">
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                        Continue
                      </div>
                    </Link>
                  </li>
                  <li className="col-span-1 row-span-2">
                    <Link href="/game">
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                        New Game
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <li className="col-span-2 row-span-2">
                  <Link href="/game">
                    <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                      <User className="h-5 w-5" />
                      Singleplayer
                    </div>
                  </Link>
                </li>
              )}
              <li className="col-span-2 row-span-2">
                <Link href="/weekly">
                  <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                    <Calendar className="h-5 w-5" />
                    Weekly Challenge
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2">
                <Link href="/leaderboard">
                  <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2">
                <Link href="/play">
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary px-8 py-5 text-center transition-all hover:scale-105">
                    All Gamemodes
                  </div>
                </Link>
              </li>
            </ul>
            <div
              className={cn(
                "h-4 w-[90%] rounded-[50%] blur-lg transition-all",
                hoveredCenterMain ? "mt-16 bg-black/20" : "mt-16 bg-black/30"
              )}
            ></div>
          </div>
          <div
            className={cn(
              "flex h-full flex-grow basis-1/3 flex-col items-center justify-between transition-all",
              hoveredRightMain ? "translate-x-0 skew-y-0 scale-100" : "translate-x-4 skew-y-3 scale-90"
            )}
            onMouseEnter={() => setHoveredRightMain(true)}
            onMouseLeave={() => setHoveredRightMain(false)}
          >
            <Card className="dropshadow-lg h-full w-full flex-grow cursor-default py-7">
              <CardHeader>
                <CardTitle>Your Streak</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <LargeStreakBadge streak={streak} lastPlayedTime={lastPlayedTime || 0} />
              </CardContent>
            </Card>
            <div className={"mt-12 h-4 w-[90%] rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex h-full w-full flex-grow flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center gap-x-4">
          <Logo logoDimensions={160} textOptions="text-2xl sm:text-5xl md:text-7xl font-semibold" />
        </div>
        <div className="mt-10 flex w-full flex-row justify-center gap-x-6 px-12 pt-4">
          <div
            className={cn(
              "flex h-full basis-1/2 flex-col items-center justify-between drop-shadow-lg transition-all",
              hoveredLeftMain ? "translate-x-0 skew-y-0 scale-100" : "-translate-x-4 -skew-y-3 scale-90"
            )}
            onMouseEnter={() => setHoveredLeftMain(true)}
            onMouseLeave={() => setHoveredLeftMain(false)}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  "align-center h-75 mb-6 flex w-full cursor-default flex-col items-center justify-center rounded-lg border-4 border-primary drop-shadow-lg transition-all hover:scale-105",
                  background
                )}
              >
                <Avatar className="my-10 h-28 w-28 cursor-pointer rounded-full border-4 border-primary bg-primary drop-shadow-md transition-all hover:scale-105">
                  <AvatarImage
                    src={picture}
                    className="object-cover"
                    alt="Profile Picture"
                    onClick={handleGoToUserProfile}
                  />
                </Avatar>
              </div>
              <h1 className="cursor-default text-3xl font-bold transition-all hover:scale-105 sm:text-3xl md:text-3xl">
                Welcome back, <ProfileHoverCard username={username} />.{" " + welcomeMessage}
              </h1>
            </div>
            <div className={"mt-12 h-4 w-[90%] rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
          </div>
          <div
            className={cn(
              "flex h-full basis-1/2 flex-col items-center justify-between transition-all",
              hoveredRightMain ? "translate-x-0 skew-y-0 scale-100" : "translate-x-4 skew-y-3 scale-90"
            )}
            onMouseEnter={() => setHoveredRightMain(true)}
            onMouseLeave={() => setHoveredRightMain(false)}
          >
            <ul
              className={cn(
                "grid w-full grid-flow-row grid-rows-8 gap-2 p-2 drop-shadow-lg transition-all duration-150"
              )}
            >
              {hasOngoingGame ? (
                <>
                  <li className="col-span-1 row-span-2">
                    <Link href="/game/continue">
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-primary px-5 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                        Continue
                      </div>
                    </Link>
                  </li>
                  <li className="col-span-1 row-span-2">
                    <Link href="/game">
                      <div className="flex h-full w-full items-center justify-center rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                        New
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <li className="col-span-2 row-span-2">
                  <Link href="/game">
                    <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                      <User className="h-5 w-5" />
                      Singleplayer
                    </div>
                  </Link>
                </li>
              )}
              <li className="col-span-2 row-span-2">
                <Link href="/weekly">
                  <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                    <Calendar className="h-5 w-5" />
                    Weekly Challenge
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2">
                <Link href="/leaderboard">
                  <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-105">
                    <Trophy className="h-5 w-5" />
                    Leaderboard
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2">
                <Link href="/play">
                  <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary px-8 py-5 text-center transition-all hover:scale-105">
                    All Gamemodes
                  </div>
                </Link>
              </li>
            </ul>
            <div className={"mt-20 h-4 w-[90%] rounded-[50%] bg-black/30 blur-lg transition-all"}></div>
          </div>
        </div>
      </div>
    );
  }
};

export default DesktopHeading;
