"use client";

import { ElementRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Hash, Loader2, LogOut, Medal, User } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGame } from "../_context/GameContext";
import { useTournament } from "../_context/TournamentContext";

import "./sidebar-cursor.css";
import "../game.css";

const InGameSidebar = () => {
  const isMobile = useMediaQuery("(max-width: 600px");
  const router = useRouter();

  const magnifierRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const [isResetting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [loadedImageUrl, setLoadedImageUrl] = useState("");

  // Retrieve Game Context
  const {
    levels,
    currentRound,
    score,
    currentImageSrcUrl,
    markerHasBeenPlaced,
    isSubmittingGuess,
    submitGuess,
    markerPosition,
    correctLocation,
    nextRound,
    scoreAwarded,
    distanceFromTarget,
    isLoading,
    gameType,
  } = useGame()!;
  const tournament = useTournament();

  const imageLoaded = !!currentImageSrcUrl && loadedImageUrl === currentImageSrcUrl;

  // Reset sidebar width when switching to mobile
  useEffect(() => {
    if (isMobile && sidebarRef.current) {
      sidebarRef.current.style.width = "";
    }
  }, [isMobile]);

  /**
   * Handles submitting a guess for the current round
   * Only submits if a marker has been placed and there is a valid marker position
   */
  const handleSubmittingGuess = useCallback(() => {
    if (!markerHasBeenPlaced || !markerPosition) return;

    const { lat, lng } = markerPosition;
    submitGuess(lat, lng).then(() => {
      tournament?.onGuessSubmit(lat, lng).catch(console.error);
    });
  }, [markerHasBeenPlaced, markerPosition, submitGuess, tournament]);

  /**
   * Handles advancing to the next round
   * Calls the nextRound function from GameContext
   */
  const handleNextRound = useCallback(() => {
    nextRound();
  }, [nextRound]);

  /**
   * Handles displaying the magnifier when hovering over the image
   */
  const handleMouseEnter = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (isResizingRef.current) return;

    const magnifier = magnifierRef.current;
    if (magnifier) {
      magnifier.style.display = "block";
      magnifier.style.backgroundImage = `url(${event.currentTarget.src})`;
      magnifier.style.backgroundRepeat = "no-repeat";
      magnifier.style.backgroundColor = getComputedStyle(document.querySelector("aside")!).getPropertyValue(
        "background-color"
      );
    }

    event.currentTarget.classList.add("hide-cursor");
  };

  /**
   * Handles moving the magnifier when moving the mouse while hovering over the image
   */
  const handleMouseMoveMagnifier = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (isResizingRef.current) return;

    const magnifier = magnifierRef.current;
    if (magnifier) {
      const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - left;
      const y = event.clientY - top;
      let bgPosX = (x / width) * 100;
      let bgPosY = (y / height) * 100;

      const half = magnifier.offsetWidth / 16;
      const yhalf = half * 1.4;

      magnifier.style.left = `${event.clientX - magnifier.offsetWidth / 2}px`;
      magnifier.style.top = `${event.clientY - magnifier.offsetHeight / 2}px`;

      // Calculate the distance from the center for x and y
      const xDistanceFromCenter = Math.abs(x - width / 2);
      const yDistanceFromCenter = Math.abs(y - height / 2);

      // Calculate the scaling factor (you can adjust the factor as needed)
      const xScalingFactor = xDistanceFromCenter / (width / 2);
      const yScalingFactor = yDistanceFromCenter / (height / 2);

      // if on the right side of the image, move the background position to the left
      if (x > width / 2) {
        bgPosX = bgPosX + half * xScalingFactor;
      } else if (x < width / 2) {
        bgPosX = bgPosX - half * xScalingFactor;
      }

      // Scale the y-offset instead of having a sharp transition
      if (y > height / 2) {
        bgPosY = bgPosY + yhalf * yScalingFactor;
      } else if (y < height / 2) {
        bgPosY = bgPosY - yhalf * yScalingFactor;
      }

      magnifier.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
    }
  };

  /**
   * Handles hiding the magnifier when the mouse leaves the image
   */
  const handleMouseLeave = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const magnifier = magnifierRef.current;
    if (magnifier) {
      magnifier.style.display = "none";
    }

    event.currentTarget.classList.remove("hide-cursor");
  };

  /**
   * Handles resizing the sidebar when clicking and dragging on the right side of the sidebar
   * Only works on desktop
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current || isMobile) return;
    let newWidth = event.clientX;

    // Clamps so that the width of the sidebar
    // can't get too big or too small.
    if (newWidth < 270) newWidth = 270;
    if (newWidth > 600) newWidth = 600;

    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  };

  /**
   * Handles stopping the resizing of the sidebar when releasing the mouse button
   */
  const handleMouseUp = () => {
    isResizingRef.current = false;
    setIsResizing(false);
    document.body.classList.remove("inheritCursorOverride");
    document.body.style.setProperty("cursor", "unset");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  /**
   * Handles starting the resizing of the sidebar when clicking on the right side of the sidebar
   * Only works on desktop
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return; // Prevent resizing on mobile

    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    setIsResizing(true);
    document.body.classList.add("inheritCursorOverride");
    document.body.style.setProperty("cursor", "ew-resize");
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.key === " ") {
        event.preventDefault();

        if (isSubmittingGuess) {
          return;
        } else if (correctLocation && !tournament?.suppressRoundAdvance) {
          handleNextRound();
        } else if (markerHasBeenPlaced && !correctLocation) {
          handleSubmittingGuess();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    isSubmittingGuess,
    correctLocation,
    markerHasBeenPlaced,
    handleNextRound,
    handleSubmittingGuess,
    tournament?.suppressRoundAdvance,
  ]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[999] flex h-full flex-col overflow-y-auto bg-background",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile ? "h-auto w-full" : "w-80 px-1"
        )}
      >
        <div className="flex justify-center px-3 pb-1 pt-4">
          <div className="flex flex-row pr-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" className="h-full text-sm">
                  <LogOut className="rotate-180 text-sm" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to leave the ongoing game?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You may return to the game at any time from the main menu.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Leave Game
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div
            className={cn(
              "flex w-full flex-row items-center justify-center justify-items-center gap-x-2 rounded-md bg-secondary p-4 text-xl text-secondary-foreground",
              isMobile && "basis-1/5"
            )}
          >
            {tournament ? (
              <Medal />
            ) : gameType === "weekly" ? (
              <Calendar />
            ) : gameType === "singleplayer" ? (
              <User />
            ) : (
              <Skeleton className="h-6 w-6 bg-zinc-400 dark:bg-red-900" />
            )}
            <div className={isMobile ? "sr-only" : ""}>
              {tournament ? (
                "Tournament"
              ) : gameType === "weekly" ? (
                "Weekly"
              ) : gameType === "singleplayer" ? (
                "Singleplayer"
              ) : (
                <Skeleton className="h-6 w-20 bg-zinc-400 dark:bg-red-900" />
              )}
            </div>
          </div>
          {isMobile && (
            <>
              <div className="mx-2 flex w-full flex-row items-center justify-center justify-items-center gap-x-2 rounded-md bg-secondary text-xl text-secondary-foreground">
                <Hash />
                <p className="pr-1">
                  {currentRound <= 5 ? currentRound : levels.length}/{levels.length}
                </p>
              </div>
              <div className="flex w-full flex-row items-center justify-center justify-items-center gap-x-2 rounded-md bg-secondary text-xl text-secondary-foreground">
                <Medal />
                <p>{score}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center p-3">
          <div className="relative aspect-4/3 w-full">
            <Skeleton
              className={cn(
                "absolute inset-0 rounded-md bg-zinc-400 transition-opacity duration-300 dark:bg-red-900",
                imageLoaded && !isLoading && currentImageSrcUrl ? "pointer-events-none opacity-0" : "opacity-100"
              )}
            />
            {!isLoading && currentImageSrcUrl && (
              <Image
                src={currentImageSrcUrl}
                fill
                sizes={isMobile ? "250px" : "296px"}
                alt=""
                onLoad={() => setLoadedImageUrl(currentImageSrcUrl)}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMoveMagnifier}
                onMouseLeave={handleMouseLeave}
                draggable={false}
                className={cn(
                  "select-none rounded-md object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        </div>
        {!isMobile && (
          <div className="mt-4 flex flex-col items-center">
            <div className="flex w-full justify-center">
              <div className="mx-4 flex flex-col items-center text-xl">
                {isLoading || !levels || !currentImageSrcUrl ? (
                  <>
                    <Skeleton className="h-6 w-6 bg-zinc-400 dark:bg-red-900" />
                    <Skeleton className="mt-1 h-5 w-8 bg-zinc-400 dark:bg-red-900" />
                  </>
                ) : (
                  <>
                    <Hash />
                    <p>
                      {currentRound <= 5 ? currentRound : levels.length}/{levels.length}
                    </p>
                  </>
                )}
              </div>
              <div className="mx-4 flex flex-col items-center text-xl">
                {isLoading || !levels || !currentImageSrcUrl ? (
                  <>
                    <Skeleton className="h-6 w-6 bg-zinc-400 dark:bg-red-900" />
                    <Skeleton className="mt-1 h-5 w-4 bg-zinc-400 dark:bg-red-900" />
                  </>
                ) : (
                  <>
                    <Medal />
                    <p>{score}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div className={cn("mt-auto w-full px-3", isMobile ? "py-2" : "py-4")}>
          {scoreAwarded !== null && distanceFromTarget !== null && (
            <div className="mb-3 flex w-full flex-col items-center justify-center justify-items-center gap-x-2 rounded-md bg-secondary p-4 text-center text-lg text-secondary-foreground">
              {distanceFromTarget <= 20 ? (
                <p>Spot on! You scored {scoreAwarded} points.</p>
              ) : (
                <p>
                  You scored {scoreAwarded} points from being {distanceFromTarget} feet away from the target.
                </p>
              )}
            </div>
          )}
          {isSubmittingGuess ? (
            <Button disabled={true} className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SUBMITTING
            </Button>
          ) : correctLocation ? (
            tournament?.suppressRoundAdvance ? (
              <div className="w-full rounded-md bg-secondary p-3 text-center text-sm text-secondary-foreground">
                Waiting for organizer...
              </div>
            ) : (
              <Button disabled={false} onClick={handleNextRound} className="w-full">
                {currentRound >= levels.length ? "FINISH GAME" : "NEXT ROUND"}
              </Button>
            )
          ) : (
            <Button disabled={!markerHasBeenPlaced} className="w-full" onClick={handleSubmittingGuess}>
              SUBMIT
            </Button>
          )}
        </div>
        {!isMobile && (
          <div
            onMouseDown={handleMouseDown}
            className={cn(
              "group absolute right-0 top-0 z-10 flex h-full w-3 cursor-ew-resize items-center justify-center",
              "transition-all duration-200",
              isResizing ? "bg-primary/10" : "hover:bg-primary/10"
            )}
            title="Drag to resize sidebar"
          >
            <div
              className={cn(
                "flex flex-col gap-1 transition-all duration-200",
                isResizing ? "scale-110" : "group-hover:scale-110"
              )}
            >
              <div
                className={cn(
                  "h-1 w-1 rounded-full transition-colors duration-200",
                  isResizing ? "bg-primary/80" : "bg-muted-foreground/40 group-hover:bg-primary/80"
                )}
              />
              <div
                className={cn(
                  "h-1 w-1 rounded-full transition-colors duration-200",
                  isResizing ? "bg-primary/80" : "bg-muted-foreground/40 group-hover:bg-primary/80"
                )}
              />
              <div
                className={cn(
                  "h-1 w-1 rounded-full transition-colors duration-200",
                  isResizing ? "bg-primary/80" : "bg-muted-foreground/40 group-hover:bg-primary/80"
                )}
              />
            </div>
          </div>
        )}
      </aside>
      <div ref={magnifierRef} className="magnifier"></div>
    </>
  );
};

export default InGameSidebar;
