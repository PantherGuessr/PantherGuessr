"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useClerk } from "@clerk/nextjs";
import { Bug, Copy, LogOut, Settings, Shield, User, UserRoundSearch, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import LevelBadge from "../level-badge";
import { Logo } from "../logo";
import StreakBadge from "../streak-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "../ui/menubar";
import { Toaster } from "../ui/toaster";

import "./navbar.css";

export const Navbar = () => {
  const router = useRouter();
  const { data: currentUser, isLoading, isAuthenticated } = useCurrentUser();
  const { signOut, openUserProfile } = useClerk();
  const scrolled = useScrollTop();

  const user = currentUser?.user;

  return (
    <>
      <div
        className={cn(
          "fixed top-0 z-50 flex w-full items-center bg-transparent p-6",
          scrolled && "border-b-2 border-[#450b0b4c] shadow-md backdrop-blur-sm"
        )}
      >
        <div className="flex w-full items-center justify-between gap-x-2">
          <div className="mr-2 flex flex-row items-center">
            <Logo href="/" />
          </div>
          {isLoading && (
            <div className="flex items-center justify-end justify-items-end">
              <Skeleton className="mr-1 h-6 w-[120px]" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          )}
          {!isLoading && !isAuthenticated && (
            <>
              <div className="ml-auto hidden space-x-2 sm:block">
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
              <div className="block text-muted-foreground sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <SignInButton mode="modal" fallbackRedirectUrl={window.location.href}>
                      <DropdownMenuItem className="cursor-pointer">Login</DropdownMenuItem>
                    </SignInButton>
                    <SignUpButton mode="modal" fallbackRedirectUrl={window.location.href}>
                      <DropdownMenuItem className="cursor-pointer">Sign Up</DropdownMenuItem>
                    </SignUpButton>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
          {isAuthenticated && !isLoading && user && (
            <>
              <div className="ml-2 flex items-center justify-end justify-items-end gap-x-0">
                <Menubar className="flex-1 cursor-pointer bg-transparent p-0 outline-none hover:bg-accent focus:bg-accent">
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer bg-transparent outline-none hover:bg-accent focus:bg-accent">
                      <div className="flex items-center justify-end justify-items-end">
                        <StreakBadge
                          streak={Number(user.currentStreak)}
                          lastPlayedTime={Number(user.lastPlayedTimestamp)}
                        />
                        <LevelBadge level={Number(user.level)} />
                        <p className="mr-2 hidden font-bold sm:flex">@{user.username}</p>
                        <Avatar className="h-[25px] w-[25px] overflow-hidden">
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                          <AvatarImage
                            src={user.picture}
                            alt={`${user.username}'s Profile Picture`}
                            className="object-cover"
                          />
                        </Avatar>
                      </div>
                    </MenubarTrigger>
                    <MenubarContent align="end">
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          router.push(`/profile/${user.username}`);
                        }}
                      >
                        <div className="flex space-x-3">
                          <Avatar>
                            <AvatarImage src={user.picture} />
                            <AvatarFallback>{user.username.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 text-left">
                            <div className="flex flex-col md:flex-row md:items-start">
                              <div className="flex flex-row">
                                <h4 className="text-sm font-semibold">@{user.username}</h4>
                                <div className="flex flex-row items-center gap-x-2 pl-2">
                                  {currentUser.roles.isDeveloper && (
                                    <Image
                                      draggable={false}
                                      className="select-none"
                                      src="/badges/developer_badge.svg"
                                      width="15"
                                      height="15"
                                      alt="Developer Badge"
                                    />
                                  )}
                                  {currentUser.roles.isModerator && (
                                    <Image
                                      draggable={false}
                                      className="select-none"
                                      src="/badges/moderator_badge.svg"
                                      width="15"
                                      height="15"
                                      alt="Moderator Badge"
                                    />
                                  )}
                                  {currentUser.roles.isContributor && (
                                    <Image
                                      draggable={false}
                                      className="select-none"
                                      src="/badges/contributor_badge.svg"
                                      width="15"
                                      height="15"
                                      alt="Contributor Badge"
                                    />
                                  )}
                                  {currentUser.roles.isTopPlayer && (
                                    <Image
                                      draggable={false}
                                      className="select-none"
                                      src="/badges/top_player_badge.svg"
                                      width="15"
                                      height="15"
                                      alt="Top Ranked Player Badge"
                                    />
                                  )}
                                  {currentUser.roles.isFriend && (
                                    <Image
                                      draggable={false}
                                      className="select-none"
                                      src="/badges/friend_badge.svg"
                                      alt="Friend Badge"
                                      width="15"
                                      height="15"
                                    />
                                  )}
                                  {currentUser.hasChapmanEmail && (
                                    <Image
                                      draggable={false}
                                      className="select-none"
                                      src="/badges/chapman_badge.svg"
                                      alt="Chapman Student Badge"
                                      width="15"
                                      height="15"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm font-semibold italic text-muted-foreground">
                              {currentUser.selectedTagline?.tagline}
                            </p>
                          </div>
                        </div>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          openUserProfile();
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" /> Account Settings
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(user.username);
                          toast({
                            description: `"${user.username}" has been copied to clipboard!`,
                          });
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" /> Copy Username
                      </MenubarItem>
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          router.push("/profile");
                        }}
                      >
                        <UserRoundSearch className="mr-2 h-4 w-4" /> Search Profiles
                      </MenubarItem>

                      {(currentUser.roles.isDeveloper || currentUser.roles.isModerator) && <MenubarSeparator />}

                      {currentUser.roles.isDeveloper && (
                        <MenubarItem
                          className="cursor-pointer"
                          onClick={() => {
                            router.push("/admin");
                          }}
                        >
                          <Wrench className="mr-2 h-4 w-4" />
                          Developer Portal
                        </MenubarItem>
                      )}

                      {(currentUser.roles.isModerator || currentUser.roles.isDeveloper) && (
                        <MenubarItem
                          className="cursor-pointer"
                          onClick={() => {
                            // router.push('/moderator'); <- TODO: ADD THIS BACK WHEN WE GET THE PAGE WORKING
                            alert("Moderator page coming soon!");
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Moderator Portal
                        </MenubarItem>
                      )}
                      <MenubarSeparator />
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          window.open("https://github.com/PantherGuessr/PantherGuessr/issues/new/choose", "_blank");
                        }}
                      >
                        <Bug className="mr-2 h-4 w-4" />
                        Report a Bug
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          signOut({ redirectUrl: window.location.href });
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </MenubarItem>
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
