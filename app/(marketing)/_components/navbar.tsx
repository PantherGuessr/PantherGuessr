"use client";

import React from "react";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "../../../components/logo";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const scrolled = useScrollTop();

    const { toast } = useToast();

    return (
        <div className={cn(
            "z-50 bg-background fixed top-0 flex items-center p-6 w-full",
            scrolled && "border-b shadow-sm"
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
                    <>                        {user?.publicMetadata?.role === "admin" ? (
                        <div className="flex items-center justify- gap-x-1">
                            <Toaster />
                            <Shield fill="#FFD700" /> <p className="hidden md:flex" onClick={() => {
                                navigator.clipboard.writeText(user?.username || "")
                                toast({
                                    description: "Username copied to clipboard!",
                                })

                            }}>{user?.username}</p>
                        </div>
                    ) : (
                        <p className="hidden md:flex">{user?.username}</p>
                    )}

                        <UserButton
                            afterSignOutUrl="/"
                        />
                    </>
                )}
            </div>
        </div>
    );
}