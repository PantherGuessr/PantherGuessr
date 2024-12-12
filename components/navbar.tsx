"use client";

import React, { useEffect, useState } from "react";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useConvexAuth, useQuery } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useRoleCheck } from "@/hooks/use-role-check";
import { useHasChapmanEmail } from "@/hooks/use-has-chapman-email";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "./ui/menubar";
import { Copy, LogOut, Settings, Shield, User, UserRoundSearch, Wrench } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Toaster } from "./ui/toaster";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import StreakBadge from "./streak-badge";
import { useGetSelectedTagline } from "@/hooks/userProfiles/use-get-selected-tagline";
import LevelBadge from "./level-badge";
import { Badge } from "./ui/badge";

export const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const clerkUser = useUser();
  const user = useQuery(api.users.getUserByUsername, { username: clerkUser.user?.username ?? "" });
  const { isLoading: isProfileTaglineLoading, result: profileTagline } = useGetSelectedTagline(user?.clerkId);
  const { signOut, openUserProfile } = useClerk();

  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer");
  const { result: isTopPlayer, isLoading: topPlayerIsLoading } = useRoleCheck("top_player", user?.clerkId);
  const { result: isModeratorRole, isLoading: moderatorRoleLoading } = useRoleCheck("moderator");
  const { result: isFriendRole, isLoading: friendRoleLoading } = useRoleCheck("friend");
  const {result: isChapmanStudent, isLoading: chapmanRoleLoading } = useHasChapmanEmail();
  const scrolled = useScrollTop();

  const [isUserLoading, setIsUserLoading] = useState(true);
  useEffect(() => {
    if(user !== undefined) {
      setIsUserLoading(false);
    }
  }, [user]);

  return (
    <>
      <div className={cn(
        "z-50 bg-transparent fixed top-0 flex items-center p-6 w-full",
        scrolled && "backdrop-blur-sm border-b-2 border-[#450b0b4c] shadow-md"
      )}>
        <div className="justify-between flex items-center gap-x-2 w-full">
          <div className="flex flex-row mr-2 items-center">
            <Logo href="/" />
            <Badge className="h-8 ml-1 bg-red-800 hover:bg-red-900 text-white cursor-default" >Alpha</Badge>
          </div>
          {
            isLoading
                    || developerRoleLoading
                    || topPlayerIsLoading
                    || moderatorRoleLoading
                    || friendRoleLoading
                    || chapmanRoleLoading
                    || isUserLoading
                    || isProfileTaglineLoading &&
                (
                  <div className="flex justify-end justify-items-end items-center">
                    <Skeleton className="h-6 w-[120px] mr-1" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                )}
          {!isLoading && !isAuthenticated && (
            <>
              <div className="hidden sm:block ml-auto space-x-2">
                <SignInButton mode="modal" fallbackRedirectUrl={window.location.href}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal" fallbackRedirectUrl={window.location.href}>
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
              <div className="block sm:hidden text-muted-foreground">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <SignInButton mode="modal" fallbackRedirectUrl={window.location.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        Login
                      </DropdownMenuItem>
                    </SignInButton>
                    <SignUpButton mode="modal" fallbackRedirectUrl={window.location.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        Sign Up
                      </DropdownMenuItem>
                    </SignUpButton>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
          {
            isAuthenticated 
                    && !isLoading 
                    && !developerRoleLoading
                    && !moderatorRoleLoading
                    && !friendRoleLoading
                    && !chapmanRoleLoading
                    && !isUserLoading 
                    && user?.picture !== undefined &&
                (
                  <>
                    {/* <div className="items-center justify-items-end gap-x-1 mx-auto hidden sm:flex">
                      <NavbarMain />
                    </div>        */}
                    <div className="flex justify-end justify-items-end items-center gap-x-0 ml-2">
                      <Menubar className="flex-1 bg-transparent outline-none p-0 hover:bg-accent focus:bg-accent cursor-pointer">
                        <MenubarMenu>
                          <MenubarTrigger className="bg-transparent outline-none hover:bg-accent focus:bg-accent cursor-pointer">
                            <div className="flex justify-end justify-items-end items-center">
                              <StreakBadge 
                                streak={Number(user.currentStreak)} 
                                lastPlayedTime={Number(user.lastPlayedTimestamp)} />
                              <LevelBadge level={Number(user.level)} />
                              <p className="hidden sm:flex mr-2 font-bold">{user?.username}</p>
                              <Avatar className="w-[25px] h-[25px] overflow-hidden">
                                <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
                                <AvatarImage src={user?.picture} alt={`${user?.username}'s Profile Picture`} className="object-cover" />
                              </Avatar>
                            </div>
                          </MenubarTrigger>
                          <MenubarContent align="end">
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              router.push(`/profile/${user!.username}`);
                            }}>
                              <div className="flex space-x-3">
                                <Avatar>
                                  <AvatarImage src={user.picture} />
                                  <AvatarFallback>{user.username.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 text-left">
                                  <div className="flex md:flex-row flex-col md:items-start">
                                    <div className="flex flex-row">
                                      <h4 className="text-sm font-semibold">@{user.username}</h4>
                                      <div className="flex flex-row items-center gap-x-2 pl-2">
                                        {isDeveloperRole && (
                                          <Image draggable={false} className="select-none" src="/badges/developer_badge.svg" width="15" height="15" alt="Developer Badge" />
                                        )}
                                        {isModeratorRole && (
                                          <Image draggable={false} className="select-none" src="/badges/moderator_badge.svg" width="15" height="15" alt="Moderator Badge" />
                                        )}
                                        {isTopPlayer && (
                                          <Image draggable={false} className="select-none" src="/badges/top_player_badge.svg" width="15" height="15" alt="Top Ranked Player Badge" />
                                        )}
                                        {isFriendRole && (
                                          <Image draggable={false} className="select-none" src="/badges/friend_badge.svg" alt="Friend Badge" width="15" height="15" />
                                        )}
                                        {isChapmanStudent && (
                                          <Image draggable={false} className="select-none" src="/badges/chapman_badge.svg" alt="Chapman Student Badge" width="15" height="15" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground font-semibold italic">{profileTagline?.tagline}</p>
                                </div>
                              </div>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              openUserProfile();
                            }}><Settings className="h-4 w-4 mr-2" /> Account Settings</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              navigator.clipboard.writeText(user!.username);
                              toast({
                                description: `"${user!.username}" has been copied to clipboard!`,
                              });
                            }}><Copy className="h-4 w-4 mr-2" /> Copy Username</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              router.push('/profile');
                            }}><UserRoundSearch className="h-4 w-4 mr-2" /> Search Profiles</MenubarItem>

                            {(isDeveloperRole || isModeratorRole) && (
                              <MenubarSeparator />
                            )}

                            {isDeveloperRole && (
                              <MenubarItem className="cursor-pointer" onClick={() => {
                                router.push('/admin');
                              }}><Wrench className="h-4 w-4 mr-2" />Developer Portal</MenubarItem>
                            )}

                            {(isModeratorRole || isDeveloperRole) && (
                              <MenubarItem className="cursor-pointer" onClick={() => {
                                // router.push('/moderator'); <- TODO: ADD THIS BACK WHEN WE GET THE PAGE WORKING
                                alert("Moderator page coming soon!");
                              }}><Shield className="h-4 w-4 mr-2" />Moderator Portal</MenubarItem>
                            )}
                            <MenubarSeparator />
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              signOut({ redirectUrl: window.location.href });
                            }}><LogOut className="h-4 w-4 mr-2" />Logout</MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  </>
                )}
        </div>
      </div>        
      <Toaster />
    </>
  );
};