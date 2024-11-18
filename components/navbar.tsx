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
import { Copy, LogOut, Settings, Shield, UserRound, UserRoundSearch, Wrench } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Toaster } from "./ui/toaster";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const clerkUser = useUser();
  const user = useQuery(api.users.getUserByUsername, { username: clerkUser.user?.username ?? "" });
  const { signOut, openUserProfile } = useClerk();

  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer");
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
          <div className="mr-2"><Logo href="/" /></div>
          {
            isLoading
                    || developerRoleLoading
                    || moderatorRoleLoading
                    || friendRoleLoading
                    || chapmanRoleLoading
                    || isUserLoading &&
                (
                  <div className="flex justify-end justify-items-end items-center">
                    <Skeleton className="h-6 w-[120px] mr-1" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                )}
          {!isLoading && !isAuthenticated && (
            <div className="ml-auto space-x-2">
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
                              <div className="hidden xs:flex items-center gap-x-2 mr-2">
                                { /* email ends in @chapman.edu */
                                  isChapmanStudent && (
                                    <Image draggable={false} className="select-none" src="/badges/chapman_badge.svg" alt="Chapman Student Badge" width="25" height="25" />
                                  )}

                                { /* user has the friend role */
                                  isFriendRole && (
                                    <Image draggable={false} className="select-none" src="/badges/friend_badge.svg" alt="Friend Badge" width="25" height="25" />
                                  )}

                                { /* if user is an admin then display shield */
                                  isModeratorRole && (
                                    <Image draggable={false} className="select-none" src="/badges/moderator_badge.svg" width="25" height="25" alt="Developer Badge" />
                                  )}

                                { /* if user is an admin then display shield */
                                  isDeveloperRole && (
                                    <Image draggable={false} className="select-none" src="/badges/developer_badge.svg" width="25" height="25" alt="Developer Badge" />
                                  )}
                              </div>
                              { /* Toast to copy username to clipboard */}
                              <p className="hidden sm:flex mr-2 font-bold">{user?.username}</p>
                              <Avatar className="w-[25px] h-[25px] overflow-hidden">
                                <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
                                <AvatarImage src={user?.picture} alt={`${user?.username}'s Profile Picture`} className="object-cover" />
                              </Avatar>
                            </div>
                          </MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              navigator.clipboard.writeText(user!.username);
                              toast({
                                description: `"${user!.username}" has been copied to clipboard!`,
                              });
                            }}><Copy className="h-4 w-4 mr-2" /> Copy Username</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              router.push('/profile');
                            }}><UserRoundSearch className="h-4 w-4 mr-2" /> Search Profiles</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              router.push(`/profile/${user!.username}`);
                            }}><UserRound className="h-4 w-4 mr-2" /> My Profile</MenubarItem>
                            <MenubarItem className="cursor-pointer" onClick={() => {
                              openUserProfile();
                            }}><Settings className="h-4 w-4 mr-2" /> Account Settings</MenubarItem>

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