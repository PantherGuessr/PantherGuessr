"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Check, ChevronsUpDown, Loader2, Save, SearchX, ShieldX, SquarePen, UserSearch, X } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useGetRecentGames } from "@/hooks/userProfiles/use-get-recent-games";
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

import "./backgrounds.css";

type Props = {
  params: Promise<{ USERNAME: string }>;
};

const ProfilePage = ({ params }: Props) => {
  const { USERNAME: usernameSubPage } = use(params);
  const router = useRouter();

  if (usernameSubPage !== usernameSubPage.toLowerCase()) {
    router.push(`/profile/${usernameSubPage.toLowerCase()}`);
  }

  // Current viewer's data from context (1 query, shared)
  const { data: viewerProfile, isLoading: viewerLoading } = useCurrentUser();

  // Viewed user's basic doc (needed to get clerkId for profile query)
  const user = useQuery(api.users.getUserByUsername, { username: usernameSubPage });

  // Viewed user's full profile (1 consolidated query)
  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.clerkId);

  // Editing data — only needed for current user's own profile
  const isCurrentUser = viewerProfile?.user.clerkId === user?.clerkId;
  const { result: unlockedProfileTaglines, isLoading: unlockedProfileTaglinesLoading } = useGetUnlockedTaglines(
    isCurrentUser ? user?.clerkId : undefined
  );
  const { result: unlockedProfileBackgrounds, isLoading: unlockedProfileBackgroundsLoading } =
    useGetUnlockedBackgrounds(isCurrentUser ? user?.clerkId : undefined);
  const { result: recentGames, isLoading: recentGamesLoading } = useGetRecentGames(user?.clerkId);

  // mutations for updating user data
  const updateSelectedTagline = useMutation(api.users.updateSelectedTagline);
  const updateSelectedBackground = useMutation(api.users.updateSelectedBackground);

  // username editing
  const [usernameForUpdate, setUsernameForUpdate] = useState(user?.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [userNameInputWidth, setUserNameInputWidth] = useState(0);

  // tagline editing
  const [taglineForUpdate, setTaglineForUpdate] = useState(profile?.selectedTagline?.tagline);
  const [taglineIdForUpdate, setTaglineIdForUpdate] = useState(profile?.selectedTagline?._id);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [taglinePopoverOpen, setTaglinePopoverOpen] = useState(false);

  // background editing
  const [isEditingBackground, setIsEditingBackground] = useState(false);
  const [backgroundCSSValue, setBackgroundCSSValue] = useState<string | undefined>(
    profile?.selectedBackground?.backgroundCSS
  );
  const [backgroundIdForUpdate, setBackgroundIdForUpdate] = useState(profile?.selectedBackground?._id);

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

  // sync background state when profile loads
  useEffect(() => {
    if (profile?.selectedBackground) {
      setBackgroundCSSValue(profile.selectedBackground.backgroundCSS);
      setBackgroundIdForUpdate(profile.selectedBackground._id);
    }
  }, [profile?.selectedBackground]);

  const isLargerScreen = useMediaQuery("(min-width: 1024px)");

  const isLoading =
    user === undefined ||
    profileLoading ||
    viewerLoading ||
    recentGamesLoading ||
    (isCurrentUser && (unlockedProfileTaglinesLoading || unlockedProfileBackgroundsLoading));

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  const isBanned = profile?.isBanned;
  const banReason = profile?.banReason;
  const appealActive = profile?.appealSubmitted;

  if (
    isBanned &&
    user?.clerkId !== viewerProfile?.user.clerkId &&
    !viewerProfile?.roles.isDeveloper &&
    !viewerProfile?.roles.isModerator
  ) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <ShieldX className="h-12 w-12 sm:h-24 sm:w-24" />
          <h1 className="text-3xl font-bold sm:text-5xl">@{usernameSubPage} is suspended.</h1>
          <Button asChild>
            <Link href="/profile">
              <UserSearch className="mr-2 h-4 w-4" /> Search Different User
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (
    isBanned &&
    user?.clerkId === viewerProfile?.user.clerkId &&
    !viewerProfile?.roles.isDeveloper &&
    !viewerProfile?.roles.isModerator
  ) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <ShieldX className="h-12 w-12 sm:h-24 sm:w-24" />
          <h1 className="text-3xl font-bold sm:text-5xl">Your account has been suspended.</h1>
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
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <SearchX className="h-12 w-12 sm:h-24 sm:w-24" />
          <h1 className="text-3xl font-bold sm:text-5xl">@{usernameSubPage} not found!</h1>
          <Button asChild>
            <Link href="/profile">
              <UserSearch className="mr-2 h-4 w-4" /> Search Different User
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isDeveloperRole = profile?.roles.isDeveloper;
  const isContributorRole = profile?.roles.isContributor;
  const isTopPlayer = profile?.roles.isTopPlayer;
  const isModeratorRole = profile?.roles.isModerator;
  const isFriendRole = profile?.roles.isFriend;
  const isChapmanStudent = profile?.hasChapmanEmail;
  const profileTagline = profile?.selectedTagline;
  const profileBackground = profile?.selectedBackground;

  const hasEarlyAdopter = profile?.achievements["Early Adopter"]?.unlocked;
  const earlyAdopterDescription = profile?.achievements["Early Adopter"]?.description;
  const hasFirstSteps = profile?.achievements["First Steps"]?.unlocked;
  const firstStepsDescription = profile?.achievements["First Steps"]?.description;
  const hasMapMaster = profile?.achievements["Map Master"]?.unlocked;
  const mapMasterDescription = profile?.achievements["Map Master"]?.description;
  const hasOnFire = profile?.achievements["On Fire"]?.unlocked;
  const onFireDescription = profile?.achievements["On Fire"]?.description;
  const hasSniped = profile?.achievements["Sniped"]?.unlocked;
  const snipedDescription = profile?.achievements["Sniped"]?.description;
  const hasPhotoScout = profile?.achievements["Photo Scout"]?.unlocked;
  const photoScoutDescription = profile?.achievements["Photo Scout"]?.description;

  const xpForLevels = [25, 50, 75, 100];
  const xpForMaxLevel = 100;
  const xpForNextLevel = user.level < xpForLevels.length + 1 ? xpForLevels[Number(user.level) - 1] : xpForMaxLevel;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className={cn("flex h-full flex-col")}>
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
            <div className="flex flex-1 flex-col items-center justify-center gap-y-2 bg-background px-6 pb-4 text-center">
              <div className="flex w-full flex-col items-center justify-between px-4 lg:flex-row lg:items-start lg:px-10 xl:px-20">
                <div className="flex w-full flex-col lg:mr-8">
                  <div className="flex flex-col items-center lg:mb-[-4em] lg:flex-row lg:items-start lg:pt-4">
                    <Avatar className="mb-[-5em] h-[200px] w-[200px] translate-y-[-5em] flex-col overflow-hidden border-8 border-background bg-background lg:mb-0">
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      <AvatarImage
                        src={user.picture}
                        alt={`${user.username}'s Profile Picture`}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex flex-col items-center justify-center gap-y-1 text-center lg:items-start lg:text-start">
                      <div className="flex flex-col items-center lg:flex-row lg:items-start">
                        <div className="flex flex-row items-center">
                          {isCurrentUser ? (
                            isEditingUsername ? (
                              <>
                                <Input
                                  type="text"
                                  value={usernameForUpdate}
                                  onChange={(e) => setUsernameForUpdate(e.target.value)}
                                  className="mt-2 text-4xl font-bold transition-all duration-200 ease-in-out md:ml-4 md:mt-0"
                                  style={{ width: userNameInputWidth }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      setIsEditingUsername(false);
                                    }
                                  }}
                                />
                                <X
                                  className="ml-1 mt-1 h-7 w-7 cursor-pointer"
                                  onClick={() => {
                                    setIsEditingUsername(false);
                                  }}
                                />
                                <Save
                                  className="ml-1 mt-1 h-7 w-7 cursor-pointer"
                                  onClick={() => {
                                    setIsEditingUsername(false);
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <h1 className="cursor-default text-4xl font-bold md:pl-4">@{user.username}</h1>
                                {/* //TODO: make username editing possible with clerk hook, then uncomment the code below
                                        <SquarePen className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                                            // setIsEditingUsername(true)
                                            // setUsernameForUpdate(user.username);
                                        }} />
                                         */}
                              </>
                            )
                          ) : (
                            <h1 className="text-4xl font-bold md:pl-4">@{user.username}</h1>
                          )}
                        </div>
                        <div className="flex flex-row items-center gap-x-2 pl-0 pt-2 sm:md:pt-2 sm:md:pl-3 lg:items-start">
                          {isDeveloperRole && (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image
                                    draggable={false}
                                    className="transform-gpu cursor-default select-none drop-shadow"
                                    src="/badges/developer_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Developer Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-1 text-sm"> Developer </p>
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
                                    className="transform-gpu cursor-default select-none drop-shadow"
                                    src="/badges/moderator_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Moderator Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-1 text-sm">Moderator</p>
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
                                    className="transform-gpu cursor-default select-none drop-shadow"
                                    src="/badges/contributor_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Contributor Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-1 text-sm">Contributor</p>
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
                                    className="transform-gpu cursor-default select-none drop-shadow"
                                    src="/badges/top_player_badge.svg"
                                    width="25"
                                    height="25"
                                    alt="Top Ranked Player Badge"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-1 text-sm"> Top Ranked Player </p>
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
                                    className="transform-gpu cursor-default select-none drop-shadow"
                                    src="/badges/friend_badge.svg"
                                    alt="Friend Badge"
                                    width="25"
                                    height="25"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-1 text-sm"> Friend of a Developer </p>
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
                                    className="transform-gpu cursor-default select-none drop-shadow"
                                    src="/badges/chapman_badge.svg"
                                    alt="Chapman Student Badge"
                                    width="25"
                                    height="25"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="p-1 text-sm"> Chapman Community </p>
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
                                    className="ml-4 w-auto justify-between transition-all"
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
                                className="ml-1 mt-1 h-5 w-5 cursor-pointer"
                                onClick={() => {
                                  setIsEditingTagline(false);
                                }}
                              />
                              <Save
                                className="ml-1 mt-1 h-5 w-5 cursor-pointer"
                                onClick={() => {
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
                              <p className="text-md cursor-default font-bold italic text-muted-foreground lg:pl-4">
                                {profileTagline?.tagline}
                              </p>
                              <SquarePen
                                className="ml-1 h-4 w-4 cursor-pointer"
                                onClick={() => {
                                  setTaglineForUpdate(profileTagline?.tagline);
                                  setIsEditingTagline(true);
                                }}
                              />
                            </>
                          )
                        ) : (
                          <p className="text-md font-bold italic text-muted-foreground lg:pl-4">
                            {profileTagline?.tagline}
                          </p>
                        )}
                      </div>
                      <p className="text-md font-bold italic text-muted-foreground/60 lg:pl-4">
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
                <div className="flex w-full flex-col items-start space-y-10 pt-4 lg:w-auto">
                  <div className="flex w-full flex-col">
                    <ProfileActions username={user.username} userClerkId={user.clerkId} isCurrentUser={isCurrentUser} />
                  </div>
                  <div className="flex w-full flex-col">
                    <div className="flex w-full flex-row justify-between">
                      <p className="text-md mr-4 font-bold">Level {Number(user.level)}</p>
                      <p className="text-md font-bold text-muted-foreground">
                        {Number(user.currentXP)}/{xpForNextLevel || 0} XP
                      </p>
                    </div>
                    <LevelProgress
                      className="mt-1 w-full lg:w-64"
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
                    isViewerDeveloper={!!viewerProfile?.roles.isDeveloper}
                    isViewerModerator={!!viewerProfile?.roles.isModerator}
                    isUserBanned={!!isBanned}
                    banReason={banReason}
                  />
                </div>
              </div>
              {!isLargerScreen && (
                <div className="flex w-full flex-col items-center justify-between px-4 md:items-start lg:px-20">
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
