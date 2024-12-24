"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hash, Loader2, LogOut, Medal, User } from "lucide-react";
import Image from "next/image";
import { ElementRef, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useGame } from "../_context/GameContext";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import "./sidebar-cursor.css";

const InGameSidebar = () => {
  const isMobile = useMediaQuery("(max-width: 600px");
  const router = useRouter();

  const magnifierRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const [isResetting] = useState(false);

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
    isLoading
  } = useGame()!;
    
  /**
   * Handles submitting a guess for the current round
   * Only submits if a marker has been placed and there is a valid marker position
   */
  const handleSubmittingGuess = () => {
    if(!markerHasBeenPlaced || !markerPosition) return;
    
    const { lat, lng } = markerPosition;
    submitGuess(lat, lng);
  };

  /**
   * Handles advancing to the next round
   * Calls the nextRound function from GameContext
   */
  const handleNextRound = () => {
    nextRound();
  };

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
      magnifier.style.backgroundColor = getComputedStyle(document.querySelector("aside")!).getPropertyValue("background-color");
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
   * Handles starting the resizing of the sidebar when clicking on the right side of the sidebar
   */
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.body.classList.add("inheritCursorOverride");
    document.body.style.cursor = "ew-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  /**
   * Handles resizing the sidebar when clicking and dragging on the right side of the sidebar
   */
  const handleMouseMove = (event: MouseEvent) => {
    if(!isResizingRef.current) return;
    let newWidth = event.clientX;

    // Clamps so that the width of the sidebar
    // can't get too big or too small.
    if(newWidth < 270) newWidth = 270;
    if(newWidth > 600) newWidth = 600;

    if(sidebarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
    }
  };

  /**
   * Handles stopping the resizing of the sidebar when releasing the mouse button
   */
  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.body.classList.remove("inheritCursorOverride");
    document.body.style.cursor = "unset";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  /*TODO: Comment this back in when ready

    function preventUnload(event: BeforeUnloadEvent) {
        event.preventDefault();
    }

    window.addEventListener("beforeunload", preventUnload);

    */

  return (
    <>
      <aside ref={sidebarRef} className={cn(
        "group/sidebar h-full bg-background overflow-y-auto relative flex flex-col z-[999]",
        isResetting && "transition-all ease-in-out duration-300",
        isMobile ? "w-full h-auto" : "w-80 px-1",
      )}>
        <div className="flex justify-center pt-4 px-3 pb-1">
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
                  <AlertDialogAction onClick={() => {
                    router.push("/");
                  }}>Leave Game</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className={
            cn("text-xl flex flex-row bg-secondary text-secondary-foreground justify-items-center justify-center items-center p-4 w-full rounded-md gap-x-2",
              isMobile && "basis-1/5"
            )}>
            <User />
            {!isMobile && (<p>Singleplayer</p>)}
          </div>
          {isMobile && (
            <>
              <div className="text-xl flex flex-row bg-secondary text-secondary-foreground justify-items-center justify-center items-center mx-2 w-full rounded-md gap-x-2">
                <Hash />
                <p className="pr-1">{(currentRound <= 5) ? currentRound : levels.length}/{levels.length}</p>
              </div>
              <div className="text-xl flex flex-row bg-secondary text-secondary-foreground justify-items-center justify-center items-center w-full rounded-md gap-x-2">
                <Medal />
                <p>{score}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center p-3">
          { (isLoading) ? (
            <Skeleton className="bg-zinc-400 dark:bg-red-900 w-full aspect-4/3" />
          ) : (
            <Image
              src={currentImageSrcUrl}
              layout="responsive"
              width={isMobile ? 250 : 296}
              height={isMobile ? 188 : 222}
              alt=""
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMoveMagnifier}
              onMouseLeave={handleMouseLeave}
              className="rounded-md"
            />
          )}
        </div>
        {!isMobile && (
          <div className="mt-4 flex flex-col items-center">
            <div className="flex justify-center w-full">
              <div className="text-xl flex flex-col items-center mx-4">
                { (isLoading && currentRound == 0) ? (
                  <>
                    <Skeleton className="w-6 h-6 bg-zinc-400 dark:bg-red-900" />
                    <Skeleton className="w-8 h-5 mt-1 bg-zinc-400 dark:bg-red-900" />
                  </>
                ) : (
                  <>
                    <Hash />
                    <p>{(currentRound <= 5) ? currentRound : levels.length}/{levels.length}</p>
                  </>
                )}
              </div>
              <div className="text-xl flex flex-col items-center mx-4">
                { (isLoading && currentRound == 0) ? (
                  <>
                    <Skeleton className="w-6 h-6 bg-zinc-400 dark:bg-red-900" />
                    <Skeleton className="w-4 h-5 mt-1 bg-zinc-400 dark:bg-red-900" />
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
        <div className={
          cn(
            "mt-auto px-3 w-full",
            isMobile ? "py-2" : "py-4"

          )
        }>
          {scoreAwarded!== null && distanceFromTarget !== null && (
            <div className="text-lg flex flex-col bg-secondary text-center text-secondary-foreground justify-items-center justify-center items-center p-4 mb-3 w-full rounded-md gap-x-2">
              {distanceFromTarget <= 20 ? (
                <p>Spot on! You scored {scoreAwarded} points.</p>
              ) : (
                <p>You scored {scoreAwarded} points from being {distanceFromTarget} feet away from the target.</p>
              )}
            </div>
          )}
          {isSubmittingGuess ? (
            <Button disabled={true} className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SUBMITTING
            </Button>
          ) : correctLocation ? (
            <Button disabled={false} onClick={handleNextRound} className="w-full">
              {currentRound >= levels.length ? 'FINISH GAME' : 'NEXT ROUND'}
            </Button>
          ) : (
            <Button disabled={!markerHasBeenPlaced} className="w-full" onClick={handleSubmittingGuess}>
              SUBMIT
            </Button>
          )}
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={() => {}}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 right-0 top-0"
        />
      </aside>
      <div ref={magnifierRef} className="magnifier"></div>
    </>
  );
};

export default InGameSidebar;