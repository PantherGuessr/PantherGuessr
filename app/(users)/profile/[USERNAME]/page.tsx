"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Check, ChevronsUpDown, Loader2, Save, SearchX, ShieldX, SquarePen, UserSearch, X } from "lucide-react";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import "./backgrounds.css";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBanCheck } from "@/hooks/use-ban-check";
import { useHasChapmanEmail } from "@/hooks/use-has-chapman-email";
import { useRoleCheck } from "@/hooks/use-role-check";
import { useGetRecentGames } from "@/hooks/userProfiles/use-get-recent-games";
import { useGetSelectedBackground } from "@/hooks/userProfiles/use-get-selected-background";
import { useGetSelectedTagline } from "@/hooks/userProfiles/use-get-selected-tagline";
import { useAchievementCheck } from "@/hooks/userProfiles/use-get-unlocked-achievements";
import { useGetUnlockedBackgrounds } from "@/hooks/userProfiles/use-get-unlocked-backgrounds";
import { useGetUnlockedTaglines } from "@/hooks/userProfiles/use-get-unlocked-taglines";
import { cn } from "@/lib/utils";
import ProfileAdministrativeActions from "./_components/AdministrativeActions";
import BanAppeal from "./_components/BanAppeal";
import GameHistory from "./_components/GameHistory";
import { LevelProgress } from "./_components/LevelProgress";
import ProfileAchievements from "./_components/ProfileAchievements";
import ProfileActions from "./_components/ProfileActions";
import ProfileBackground from "./_components/ProfileBackground";

type Props = {
  params: Promise<{ USERNAME: string }>;
};

const ProfilePage = ({ params }: Props) => {
  const { USERNAME: usernameSubPage } = use(params);
  const router = useRouter();

  if (usernameSubPage !== usernameSubPage.toLowerCase()) {
    router.push(`/profile/${usernameSubPage.toLowerCase()}`);
  }

  const clerkUser = useUser();
  const user = useQuery(api.users.getUserByUsername, { username: usernameSubPage });
  const viewingUser = useQuery(api.users.current);
  const { result: isBanned, banReason, appealActive, isLoading: isBanCheckLoading } = useBanCheck(user?.clerkId);
  const { result: isViewerDeveloperRole, isLoading: viewerDeveloperRoleLoading } = useRoleCheck(
    "developer",
    viewingUser?.clerkId
  );
  const { result: isViewerModeratorRole, isLoading: viewerModeratorRoleLoading } = useRoleCheck(
    "moderator",
    viewingUser?.clerkId
  );
  const { result: isChapmanStudent, isLoading: isChapmanStudentLoading } = useHasChapmanEmail(user?.clerkId);
  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer", user?.clerkId);
  const { result: isContributorRole, isLoading: contributorRoleLoading } = useRoleCheck("contributor", user?.clerkId);
  const { result: isTopPlayer, isLoading: topPlayerIsLoading } = useRoleCheck("top_player", user?.clerkId);
  const { result: isModeratorRole, isLoading: moderatorRoleLoading } = useRoleCheck("moderator", user?.clerkId);
  const { result: isFriendRole, isLoading: friendRoleLoading } = useRoleCheck("friend", user?.clerkId);
  const { result: unlockedProfileTaglines, isLoading: unlockedProfileTaglinesLoading } = useGetUnlockedTaglines();
  const { result: profileTagline, isLoading: profileTaglineLoading } = useGetSelectedTagline(user?.clerkId);
  const { result: unlockedProfileBackgrounds, isLoading: unlockedProfileBackgroundsLoading } =
    useGetUnlockedBackgrounds();
  const { result: profileBackground, isLoading: profileBackgroundLoading } = useGetSelectedBackground(user?.clerkId);

  // gets profile achievements
  const {
    result: hasEarlyAdopter,
    description: earlyAdopterDescription,
    isLoading: isEarlyAdopterLoading,
  } = useAchievementCheck("Early Adopter", user?.clerkId);
  const {
    result: hasFirstSteps,
    description: firstStepsDescription,
    isLoading: isFirstStepsLoading,
  } = useAchievementCheck("First Steps", user?.clerkId);
  const {
    result: hasMapMaster,
    description: mapMasterDescription,
    isLoading: isMapMasterLoading,
  } = useAchievementCheck("Map Master", user?.clerkId);
  const {
    result: hasOnFire,
    description: onFireDescription,
    isLoading: isOnFireLoading,
  } = useAchievementCheck("On Fire", user?.clerkId);
  const {
    result: hasSniped,
    description: snipedDescription,
    isLoading: isSnipedLoading,
  } = useAchievementCheck("Sniped", user?.clerkId);
  const {
    result: hasPhotoScout,
    description: photoScoutDescription,
    isLoading: isPhotoScoutLoading,
  } = useAchievementCheck("Photo Scout", user?.clerkId);

  // mutations for updating user data
  const updateSelectedTagline = useMutation(api.users.updateSelectedTagline);
  const updateSelectedBackground = useMutation(api.users.updateSelectedBackground);

  // username editing
  const [usernameForUpdate, setUsernameForUpdate] = useState(user?.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [userNameInputWidth, setUserNameInputWidth] = useState(0);

  // tagline editing
  const [taglineForUpdate, setTaglineForUpdate] = useState(profileTagline?.tagline);
  const [taglineIdForUpdate, setTaglineIdForUpdate] = useState(profileTagline?._id);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [taglinePopoverOpen, setTaglinePopoverOpen] = useState(false);

  // background editing
  const [isEditingBackground, setIsEditingBackground] = useState(false);
  const [backgroundCSSValue, setBackgroundCSSValue] = useState<string | undefined>(profileBackground?.backgroundCSS);
  const [backgroundIdForUpdate, setBackgroundIdForUpdate] = useState(profileBackground?._id);

  // recent games
  const { result: recentGames, isLoading: recentGamesLoading } = useGetRecentGames(user?.clerkId);

  // page reloading effect that is just a CSS class change
  const [taglineReloadingEffect, setTaglineReloadingEffect] = useState(false);

  // recalculate the width of the input based on the username length
  useEffect(() => {
    if (!usernameForUpdate) {
      setUserNameInputWidth(48);
    } else {
      if (usernameForUpdate.length > 32) {
        setUsernameForUpdate(usernameForUpdate.slice(0, 32));
      }
      const width = usernameForUpdate.length * 19 + 48;
      if (width < 48) {
        setUserNameInputWidth(48);
      } else {
        setUserNameInputWidth(width);
      }
    }
  }, [usernameForUpdate]);

  // useEffect to select the user's current background to ensure that the selected text is correct
  useEffect(() => {
    if (profileBackground) {
      setBackgroundCSSValue(profileBackground.backgroundCSS);
      setBackgroundIdForUpdate(profileBackground._id);
    }
  }, [profileBackground]);

  // get media query screen size
  const isLargerScreen = useMediaQuery("(min-width: 1024px)");

  if (
    // All the following elements need to load before
    // rendering page.
    user === undefined ||
    isBanCheckLoading ||
    viewerDeveloperRoleLoading ||
    viewerModeratorRoleLoading ||
    isChapmanStudentLoading ||
    developerRoleLoading ||
    contributorRoleLoading ||
    topPlayerIsLoading ||
    moderatorRoleLoading ||
    friendRoleLoading ||
    unlockedProfileTaglinesLoading ||
    profileTaglineLoading ||
    unlockedProfileBackgroundsLoading ||
    profileBackgroundLoading ||
    isEarlyAdopterLoading ||
    isFirstStepsLoading ||
    isMapMasterLoading ||
    isOnFireLoading ||
    isSnipedLoading ||
    isPhotoScoutLoading ||
    recentGamesLoading
  ) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="animate-spin w-20 h-20" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isBanned && user?.clerkId !== viewingUser?.clerkId && !isViewerDeveloperRole && !isViewerModeratorRole) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <ShieldX className="w-12 h-12 sm:w-24 sm:h-24" />
          <h1 className="text-3xl sm:text-5xl font-bold">@{usernameSubPage} is suspended.</h1>
          <Button asChild>
            <Link href="/profile">
              <UserSearch className="h-4 w-4 mr-2" /> Search Different User
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isBanned && user?.clerkId === viewingUser?.clerkId && !isViewerDeveloperRole && !isViewerModeratorRole) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <ShieldX className="w-12 h-12 sm:w-24 sm:h-24" />
          <h1 className="text-3xl sm:text-5xl font-bold">Your account has been suspended.</h1>
          <p className="text-md sm:text-xl">
            <span className="font-semibold">Reason for Suspension:</span> {banReason ?? "None Provided"}
          </p>
          <BanAppeal profileUsername={user!.username} banReason={banReason} hasActiveAppeal={appealActive ?? false} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <SearchX className="w-12 h-12 sm:w-24 sm:h-24" />
          <h1 className="text-3xl sm:text-5xl font-bold">@{usernameSubPage} not found!</h1>
          <Button asChild>
            <Link href="/profile">
              <UserSearch className="h-4 w-4 mr-2" /> Search Different User
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // checks if the current user is the same as the user being viewed
  const isCurrentUser = clerkUser.user?.id === user.clerkId;

  // Determine the XP required for the next level
  // !!! MAKE SURE THAT THIS MATCHES WHAT IS ON THE BACKEND
  const xpForLevels = [25, 50, 75, 100];
  const xpForMaxLevel = 100;
  const xpForNextLevel = user.level < xpForLevels.length + 1 ? xpForLevels[Number(user.level) - 1] : xpForMaxLevel;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className={cn("h-full flex flex-col")}>
            <ProfileBackground
              backgroundCSSValue={backgroundCSSValue}
              isCurrentUser={isCurrentUser}
              isEditingBackground={isEditingBackground}
              setIsEditingBackground={setIsEditingBackground}
              unlockedProfileBackgrounds={unlockedProfileBackgrounds}
              userClerkId={user.clerkId}
              setBackgroundCSSValue={setBackgroundCSSValue}
              setBackgroundIdForUpdate={setBackgroundIdForUpdate}
              backgroundIdForUpdate={backgroundIdForUpdate}
              updateSelectedBackground={updateSelectedBackground}
            />
            <div className="flex flex-col items-center justify-center text-center gap-y-2 flex-1 px-6 pb-4 bg-background">
              <div className="flex w-full lg:flex-row flex-col lg:items-start items-center justify-between px-4 lg:px-10 xl:px-20">
                <div className="flex flex-col w-full lg:mr-8">
                  <div className="flex lg:flex-row flex-col items-center lg:items-start lg:pt-4 lg:mb-[-4em]">
                    <Avatar className="flex-col translate-y-[-5em] w-[200px] h-[200px] mb-[-5em] lg:mb-0 border-8 border-background bg-background overflow-hidden">
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      <AvatarImage
                        src={user.picture}
                        alt={`${user.username}'s Profile Picture`}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex flex-col items-center text-center lg:text-start lg:items-start justify-center gap-y-1">
                      <div className="flex lg:flex-row flex-col items-center lg:items-start">
                        <div className="flex flex-row items-center">
                          {isCurrentUser ? (
                            isEditingUsername ? (
                              <>
                                <Input
                                  type="text"
                                  value={usernameForUpdate}
                                  onChange={(e) => setUsernameForUpdate(e.target.value)}
                                  className="text-4xl font-bold md:ml-4 mt-2 md:mt-0 transition-all duration-[25] ease-in-out"
                                  style={{ width: userNameInputWidth }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      setIsEditingUsername(false);
                                    }
                                  }}
                                />
                                <X
                                  className="h-7 w-7 ml-1 mt-1 cursor-pointer"
                                  onClick={() => {
                                    setIsEditingUsername(false);
                                  }}
                                />
                                <Save
                                  className="h-7 w-7 ml-1 mt-1 cursor-pointer"
                                  onClick={() => {
                                    // update username and close input
                                    setIsEditingUsername(false);
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <h1 className="text-4xl font-bold md:pl-4 cursor-default">{user.username}</h1>
                                {/* //TODO: make username editing possible with clerk hook, then uncomment the code below
                                        <SquarePen className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                                            // setIsEditingUsername(true)
                                            // setUsernameForUpdate(user.username);

                                        }} />
                                         */}
                              </>
                            )
                          ) : (
                            <h1 className="text-4xl font-bold md:pl-4">{user.username}</h1>
                          )}
                        </div>
                        <div className="flex flex-row items-center lg:items-start gap-x-2 pl-0 pt-2 sm:md:pl-3 sm:md:pt-2">
                          {isDeveloperRole && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="select-none cursor-default"
                                    src="/badges/developer_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Developer Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1"> Developer </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isModeratorRole && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="select-none cursor-default"
                                    src="/badges/moderator_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Moderator Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1">Moderator</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isContributorRole && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="select-none cursor-default"
                                    src="/badges/contributor_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Contributor Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1">Contributor</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isTopPlayer && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="select-none cursor-default"
                                    src="/badges/top_player_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Top Ranked Player Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1"> Top Ranked Player </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isFriendRole && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="select-none cursor-default"
                                    src="/badges/friend_badge.svg"
                                    alt="Friend Badge"
                                    width="25"
                                    height="25"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1"> Friend of a Developer </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {(isChapmanStudent || user.username === "pete") && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="select-none cursor-default"
                                    src="/badges/chapman_badge.svg"
                                    alt="Chapman Student Badge"
                                    width="25"
                                    height="25"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1"> Chapman Community </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex flex-row items-center transition-all duration-100",
                          taglineReloadingEffect && "page-fade-out-and-in"
                        )}
                      >
                        {isCurrentUser ? (
                          isEditingTagline ? (
                            <>
                              <Popover open={taglinePopoverOpen} onOpenChange={setTaglinePopoverOpen}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={taglinePopoverOpen}
                                    className="w-auto justify-between transition-all ml-4"
                                  >
                                    {taglineForUpdate
                                      ? unlockedProfileTaglines?.find(
                                          (tagline) => tagline?.tagline === taglineForUpdate
                                        )?.tagline
                                      : "Select tagline..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 transition-all">
                                  <Command>
                                    <CommandInput placeholder="Search tagline..." />
                                    <CommandList>
                                      <CommandEmpty>No tagline found.</CommandEmpty>
                                      <CommandGroup>
                                        {unlockedProfileTaglines?.map((tagline) => (
                                          <CommandItem
                                            key={tagline?._id}
                                            value={tagline?.tagline}
                                            onSelect={(currentValue) => {
                                              setTaglineForUpdate(
                                                currentValue === taglineForUpdate ? "" : currentValue
                                              );
                                              setTaglineIdForUpdate(tagline?._id);
                                              setTaglinePopoverOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                taglineForUpdate === tagline?.tagline ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {tagline?.tagline}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <X
                                className="h-5 w-5 ml-1 mt-1 cursor-pointer"
                                onClick={() => {
                                  setIsEditingTagline(false);
                                }}
                              />
                              <Save
                                className="h-5 w-5 ml-1 mt-1 cursor-pointer"
                                onClick={() => {
                                  // update tagline and close input
                                  // Checks if IDs are not the same to avoid unnecessary updates
                                  if (taglineIdForUpdate !== profileTagline?._id) {
                                    updateSelectedTagline({
                                      clerkId: user.clerkId,
                                      taglineId: taglineIdForUpdate!,
                                    });
                                  }
                                  setTaglineReloadingEffect(true);
                                  setTimeout(() => {
                                    setTaglineReloadingEffect(false);
                                  }, 2000);
                                  setTimeout(() => {
                                    setIsEditingTagline(false);
                                  }, 250);
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <p className="text-md lg:pl-4 font-bold text-muted-foreground italic cursor-default">
                                {profileTagline?.tagline}
                              </p>
                              <SquarePen
                                className="h-4 w-4 ml-1 cursor-pointer"
                                onClick={() => {
                                  setTaglineForUpdate(profileTagline?.tagline);
                                  setIsEditingTagline(true);
                                }}
                              />
                            </>
                          )
                        ) : (
                          <p className="text-md lg:pl-4 font-bold text-muted-foreground italic">
                            {profileTagline?.tagline}
                          </p>
                        )}
                      </div>
                      <p className="text-md lg:pl-4 font-bold text-muted-foreground/60 italic">
                        Guessr since{" "}
                        {new Date(user._creationTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {isLargerScreen && <GameHistory isCurrentUser={isCurrentUser} recentGames={recentGames} />}
                </div>
                <div className="flex flex-col w-full lg:w-auto space-y-10 items-start pt-4">
                  <div className="flex flex-col w-full">
                    <ProfileActions username={user.username} userClerkId={user.clerkId} isCurrentUser={isCurrentUser} />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-md font-bold mr-4">Level {Number(user.level)}</p>
                      <p className="text-md text-muted-foreground font-bold">
                        {Number(user.currentXP)}/{xpForNextLevel || 0} XP
                      </p>
                    </div>
                    <LevelProgress
                      className="w-full lg:w-64 mt-1"
                      value={Number(user.currentXP)}
                      max={xpForNextLevel}
                    />
                  </div>
                  <ProfileAchievements
                    hasEarlyAdopter={hasEarlyAdopter}
                    earlyAdopterDescription={earlyAdopterDescription}
                    hasFirstSteps={hasFirstSteps}
                    firstStepsDescription={firstStepsDescription}
                    hasMapMaster={hasMapMaster}
                    mapMasterDescription={mapMasterDescription}
                    hasOnFire={hasOnFire}
                    onFireDescription={onFireDescription}
                    hasSniped={hasSniped}
                    snipedDescription={snipedDescription}
                    hasPhotoScout={hasPhotoScout}
                    photoScoutDescription={photoScoutDescription}
                  />
                  <ProfileAdministrativeActions
                    profileUsername={user.username}
                    isProfileDeveloper={!!isDeveloperRole}
                    isProfileModerator={!!isModeratorRole}
                    isViewerDeveloper={!!isViewerDeveloperRole}
                    isViewerModerator={!!isViewerModeratorRole}
                    isUserBanned={!!isBanned}
                    banReason={banReason}
                  />
                </div>
              </div>
              {!isLargerScreen && (
                <div className="flex w-full flex-col md:items-start items-center justify-between px-4 lg:px-20">
                  <GameHistory isCurrentUser={isCurrentUser} recentGames={recentGames} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default ProfilePage;
