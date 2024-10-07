"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { ElementRef, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const InGameSidebar = () => {
    const isMobile = useMediaQuery("(max-width: 768px");

    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbar = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResetting] = useState(false);

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
        if(newWidth < 300) newWidth = 300;
        if(newWidth > 500) newWidth = 500;

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
                    <Image src="/TESTING_IMAGE.jpg" layout="responsive" width="0" height="0" alt="test" />
                </div>
                <div className="mt-4">
                    <p>Round #</p>
                    <p>Score</p>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={() => {}}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
        </>
    );
}
 
export default InGameSidebar;