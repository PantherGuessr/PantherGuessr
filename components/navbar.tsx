"use client";

import React from "react";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useQuery } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import NavbarMain from "./navbar-main";
import { api } from "@/convex/_generated/api";
import { useRoleCheck } from "@/hooks/use-role-check";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const { result: isDeveloper } = useRoleCheck("developer");
    const { result: isModerator } = useRoleCheck("moderator");
    const { result: isFriend } = useRoleCheck("friend");
    const isChapmanStudent = useQuery(api.users.hasChapmanEmail, { clerkId: user?.id || "" });
    const scrolled = useScrollTop();
    const { toast } = useToast();

    return (
        <div className={cn(
            "z-50 bg-transparent fixed top-0 flex items-center p-6 w-full",
            scrolled && "backdrop-blur-sm border-b-2 border-[#450b0b4c] shadow-md"
        )}>
            <div className="justify-between flex items-center gap-x-2 w-full">
                <div className="mr-2"><Logo clickable={true} href="/" /></div>
                {isLoading && (
                    <div className="flex justify-end justify-items-end items-center">
                    <Skeleton className="h-6 w-[120px] mr-1" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                )}
                {!isLoading && !isAuthenticated && (
                    <div className="ml-auto">
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button variant="default" size="sm">
                                Sign Up
                            </Button>
                        </SignUpButton>
                    </div>
                )}
                {isAuthenticated && !isLoading && (
                    <>  
                        <div className="items-center justify-items-end gap-x-1 mx-auto hidden sm:flex">
                            <NavbarMain />
                        </div>                      
                        <div className="flex justify-end justify-items-end items-center gap-x-0 ml-2">
                            <div className="flex items-center gap-x-2 mr-2">
                                { /* email ends in @chapman.edu */
                                isChapmanStudent && (
                                    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Image src="/badges/chapman_badge.svg" alt="Chapman Student Badge" width="25" height="25" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-sm p-2"> Welcome, fellow Chapman student! 😎 </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                { /* user has the friend role */
                                isFriend && (
                                    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Image src="/badges/friend_badge.svg" alt="Friend Badge" width="25" height="25" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-sm p-2"> You are a friend of PantherGuessr! </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                { /* if user is an admin then display shield */
                                isModerator && (
                                    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Link href="/moderator" onClick={(e) => {e.preventDefault(); alert("MODERATOR PAGE COMING SOON")}}>
                                                    <Image src="/badges/moderator_badge.svg" width="25" height="25" alt="Developer Badge" />
                                                </Link> 
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-sm p-2"> Click to visit the Moderator Page. </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                { /* if user is an admin then display shield */
                                isDeveloper && (
                                    <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Link href="/admin">
                                                    <Image src="/badges/developer_badge.svg" width="25" height="25" alt="Developer Badge" />
                                                </Link> 
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-sm p-2"> Click to visit the Developer Page. </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>

                            { /* Toast to copy username to clipboard */}
                            <Toaster />
                            <p title="Copy" className="hidden sm:flex cursor-pointer mr-2" onClick={() => {
                                navigator.clipboard.writeText(user?.username || "")
                                toast({
                                    description: "Username copied to clipboard!",
                                })

                            }}>{user?.username}</p>

                            <UserButton
                                afterSignOutUrl="/"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}