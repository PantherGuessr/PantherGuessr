"use client";

import { useClerk } from "@clerk/clerk-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Bug, Copy, LogOut, Settings, Shield, User, UserRoundSearch, Wrench } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
          "z-50 bg-transparent fixed top-0 flex items-center p-6 w-full",
          scrolled && "backdrop-blur-sm border-b-2 border-[#450b0b4c] shadow-md"
        )}
      >
        <div className="justify-between flex items-center gap-x-2 w-full">
          <div className="flex flex-row mr-2 items-center">
            <Logo href="/" />
          </div>
          {isLoading && (
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
              <div className="flex justify-end justify-items-end items-center gap-x-0 ml-2">
                <Menubar className="flex-1 bg-transparent outline-none p-0 hover:bg-accent focus:bg-accent cursor-pointer">
                  <MenubarMenu>
                    <MenubarTrigger className="bg-transparent outline-none hover:bg-accent focus:bg-accent cursor-pointer">
                      <div className="flex justify-end justify-items-end items-center">
                        <StreakBadge
                          streak={Number(user.currentStreak)}
                          lastPlayedTime={Number(user.lastPlayedTimestamp)}
                        />
                        <LevelBadge level={Number(user.level)} />
                        <p className="hidden sm:flex mr-2 font-bold">@{user.username}</p>
                        <Avatar className="w-[25px] h-[25px] overflow-hidden">
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
                            <div className="flex md:flex-row flex-col md:items-start">
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
                            <p className="text-sm text-muted-foreground font-semibold italic">
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
                        <Settings className="h-4 w-4 mr-2" /> Account Settings
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
                        <Copy className="h-4 w-4 mr-2" /> Copy Username
                      </MenubarItem>
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          router.push("/profile");
                        }}
                      >
                        <UserRoundSearch className="h-4 w-4 mr-2" /> Search Profiles
                      </MenubarItem>

                      {(currentUser.roles.isDeveloper || currentUser.roles.isModerator) && <MenubarSeparator />}

                      {currentUser.roles.isDeveloper && (
                        <MenubarItem
                          className="cursor-pointer"
                          onClick={() => {
                            router.push("/admin");
                          }}
                        >
                          <Wrench className="h-4 w-4 mr-2" />
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
                          <Shield className="h-4 w-4 mr-2" />
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
                        <Bug className="h-4 w-4 mr-2" />
                        Report a Bug
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem
                        className="cursor-pointer"
                        onClick={() => {
                          signOut({ redirectUrl: window.location.href });
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
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
