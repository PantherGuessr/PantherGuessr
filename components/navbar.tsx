"use client";

import React from "react";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const scrolled = useScrollTop();
    const { toast } = useToast();

    return (
        <div className={cn(
            "z-50 bg-transparent fixed top-0 flex items-center p-6 w-full",
            scrolled && "backdrop-blur-sm border-b-2 border-[#450b0b4c] shadow-md"
        )}>
            <Logo />
            <div className="ml-auto justify-end flex items-center gap-x-2">
                {isLoading && (
                    <>
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    </>
                )}
                {!isLoading && !isAuthenticated && (
                    <>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button variant="default" size="sm">
                                Register
                            </Button>
                        </SignUpButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>                        
                        <div className="flex items-center gap-x-1">

                            { /* email ends in @chapman.edu */
                            user?.emailAddresses?.some((email) => email.emailAddress.endsWith("@chapman.edu")) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Image className="cursor-pointer" src="/PantherGuessrPin.png" alt="PantherGuessr Pin" width="20" height="35" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <p className="text-sm p-2"> Welcome, fellow Chapman student! 😎 </p>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            { /* if user is an admin then display shield */
                            user?.publicMetadata?.role === "admin" && (
                                <Link href="/admin"><Shield fill="#FFD700" /></Link> 
                            )}

                            { /* Toast to copy username to clipboard */}
                            <Toaster />
                            <p title="Copy" className="hidden md:flex cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(user?.username || "")
                                toast({
                                    description: "Username copied to clipboard!",
                                })

                            }}>{user?.username}</p>
                        </div>

                        <UserButton
                            afterSignOutUrl="/"
                        />
                    </>
                )}
            </div>
        </div>
    );
}