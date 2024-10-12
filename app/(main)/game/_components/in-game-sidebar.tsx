"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hash, Loader2, Medal, User } from "lucide-react";
import Image from "next/image";
import { ElementRef, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useGame } from "../_context/GameContext";

const InGameSidebar = () => {
    const isMobile = useMediaQuery("(max-width: 768px");

    const magnifierRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbar = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);

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
    } = useGame()!;
    
    const handleSubmittingGuess = () => {
        if(!markerHasBeenPlaced || !markerPosition) return;
    
        const { lat, lng } = markerPosition;
        submitGuess(lat, lng);
    };
    
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

    const handleMouseLeave = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const magnifier = magnifierRef.current;
        if (magnifier) {
            magnifier.style.display = "none";
        }

        event.currentTarget.classList.remove("hide-cursor");
    };

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if(!isResizingRef.current) return;
        let newWidth = event.clientX;

        // Clamps so that the width of the sidebar
        // can't get too big or too small.
        if(newWidth < 200) newWidth = 200;
        if(newWidth > 600) newWidth = 600;

        if(sidebarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }


    return (
        <>
            <aside ref={sidebarRef} className={cn(
                "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-80 flex-col z-[999]",
                isResetting && "transition-all ease-in-out duration-300"
            )}>
                <div className="flex justify-center p-3">
                    <div className="text-xl flex flex-col items-center mx-4 outline p-4 rounded">
                        <User />
                        <p>Singleplayer</p>
                    </div>
                </div>
                <div className="flex justify-center p-3">
                    <Image
                        src={currentImageSrcUrl}
                        layout="responsive"
                        width="0"
                        height="0"
                        alt=""
                        onMouseEnter={handleMouseEnter}
                        onMouseMove={handleMouseMoveMagnifier}
                        onMouseLeave={handleMouseLeave}
                    />
                </div>
                <div className="mt-4 flex flex-col items-center">
                    <div className="flex justify-center w-full">
                        <div className="text-xl flex flex-col items-center mx-4">
                            <Hash />
                            <p>{currentRound}/{levels.length}</p>
                        </div>
                        <div className="text-xl flex flex-col items-center mx-4">
                            <Medal />
                            <p>{score}</p>
                        </div>
                    </div>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={() => {}}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
                <div className="mt-auto p-4 w-full">
                    {isSubmittingGuess ? (
                        <Button disabled={true} className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SUBMITTING
                        </Button>
                    ) : (
                        <Button disabled={!markerHasBeenPlaced} className="w-full" onClick={handleSubmittingGuess}>
                            SUBMIT
                        </Button>
                    )}
                </div>
            </aside>
            <div ref={magnifierRef} className="magnifier"></div>
        </>
    );
}

export default InGameSidebar;