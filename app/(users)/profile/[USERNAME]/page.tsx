"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Check, ChevronsUpDown, Loader2, PenLine, Save, SquarePen, UserSearch, X } from "lucide-react";
import "./backgrounds.css";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useHasChapmanEmail } from "@/hooks/use-has-chapman-email";
import { useRoleCheck } from "@/hooks/use-role-check";
import { useGetUnlockedTaglines } from "@/hooks/userProfiles/use-get-unlocked-taglines";
import { useGetSelectedTagline } from "@/hooks/userProfiles/use-get-selected-tagline";
import { useGetUnlockedBackgrounds } from "@/hooks/userProfiles/use-get-unlocked-backgrounds";
import { useGetSelectedBackground } from "@/hooks/userProfiles/use-get-selected-background";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
    params: { USERNAME: string }
}

const ProfilePage = ({ params }: Props) => {
  const usernameSubPage = params.USERNAME as string;
  const router = useRouter();

  if(usernameSubPage !== usernameSubPage.toLowerCase()) {
    router.push(`/profile/${usernameSubPage.toLowerCase()}`);
  }

  const clerkUser = useUser();
  const user = useQuery(api.users.getUserByUsername, { username: usernameSubPage });
  const { result: isChapmanStudent, isLoading: isChapmanStudentLoading } = useHasChapmanEmail(user?.clerkId);
  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer", user?.clerkId);
  const { result: isModeratorRole, isLoading: moderatorRoleLoading } = useRoleCheck("moderator", user?.clerkId);
  const { result: isFriendRole, isLoading: friendRoleLoading } = useRoleCheck("friend", user?.clerkId);
  const { result: unlockedProfileTaglines, isLoading: unlockedProfileTaglinesLoading } = useGetUnlockedTaglines();
  const { result: profileTagline, isLoading: profileTaglineLoading } = useGetSelectedTagline(user?.clerkId);
  const { result: unlockedProfileBackgrounds, isLoading: unlockedProfileBackgroundsLoading } = useGetUnlockedBackgrounds();
  const { result: profileBackground, isLoading: profileBackgroundLoading } = useGetSelectedBackground(user?.clerkId);

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

  // page reloading effect that is just a CSS class change
  const [taglineReloadingEffect, setTaglineReloadingEffect] = useState(false);

  // recalculate the width of the input based on the username length
  useEffect(() => {
    if (!usernameForUpdate) {
      setUserNameInputWidth(48);
    }
    else {
      if (usernameForUpdate.length > 32) {
        setUsernameForUpdate(usernameForUpdate.slice(0, 32));
      }
      const width = usernameForUpdate.length * 19 + 48;
      if (width < 48) {
        setUserNameInputWidth(48);
      }
      else {
        setUserNameInputWidth(width);
      }
    }
  }, [usernameForUpdate]);

  // useEffect to select the user's current background to ensure that the selected text is correct
  useEffect(() => {
    if(profileBackground) {
      setBackgroundCSSValue(profileBackground.backgroundCSS);
      setBackgroundIdForUpdate(profileBackground._id);
    }
  }, [profileBackground]);

  if(
  // All the following elements need to load before
  // rendering page.
    user === undefined
        || isChapmanStudentLoading
        || developerRoleLoading
        || moderatorRoleLoading
        || friendRoleLoading
        || unlockedProfileTaglinesLoading
        || profileTaglineLoading
        || unlockedProfileBackgroundsLoading
        || profileBackgroundLoading
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

  if(!user) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <h1 className="text-3xl sm:text-5xl font-bold">@{usernameSubPage} does not exist!</h1>
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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className={
            cn("h-full flex flex-col")
          }>
            <div className={
              cn("flex w-full h-96",
                backgroundCSSValue ?? "bg-gradient-red-purple"
              )
            }>
              <div className="flex h-full w-full bg-gradient-to-b from-background to-transparent justify-center items-center md:justify-end md:items-end p-6">
                {isCurrentUser && (isEditingBackground ? (
                  <>
                    <Card className="translate-y-[-2em] md:translate-y-0">
                      <CardHeader>
                        <CardTitle>Background</CardTitle>
                        <CardDescription>Select a new background for your profile</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 grid-flow-row gap-4 max-h-24 md:max-h-48 overflow-scroll">
                          {unlockedProfileBackgrounds?.map((background) => (
                            <div key={background?._id} className={cn("flex items-center justify-center h-20 w-32 rounded-md cursor-pointer bg-gradient-red-purple"
                              , background?.backgroundCSS
                            )
                            } onClick={() => {
                              setBackgroundCSSValue(background?.backgroundCSS);
                              setBackgroundIdForUpdate(background!._id);
                              updateSelectedBackground({
                                clerkId: user.clerkId,
                                backgroundId: background!._id
                              });
                              setIsEditingBackground(false);
                            }}>{background?._id == backgroundIdForUpdate && (
                                <p className="text-white text-sm">Selected</p>
                              )}</div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full flex justify-end items-end">
                      <Button onClick={() => setIsEditingBackground(true)} className="h-10 w-10 p-0" variant="secondary"><PenLine className="h-4 w-4" /></Button>
                    </div>
                  </>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-y-2 flex-1 px-6 pb-4 bg-background">
              <div className="flex w-full md:flex-row flex-col md:items-start items-center justify-between px-4 md:px-10 lg:px-20">
                <div className="flex md:flex-row flex-col items-center md:items-start md:pt-4">
                  <Avatar className="flex-col translate-y-[-5em] w-[200px] h-[200px] mb-[-5em] md:mb-0 border-8 border-background overflow-hidden">
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    <AvatarImage src={user.picture} alt={`${user.username}'s Profile Picture`} className="object-cover" />
                  </Avatar>
                  <div className="flex flex-col items-center text-center md:text-start md:items-start justify-center gap-y-1">
                    <div className="flex md:flex-row flex-col items-center md:items-start">
                      <div className="flex flex-row items-center">
                        {isCurrentUser ? (isEditingUsername ? (
                          <>
                            <Input 
                              type="text" 
                              value={usernameForUpdate} 
                              onChange={(e) => setUsernameForUpdate(e.target.value)}
                              className="text-4xl font-bold md:ml-4 mt-2 md:mt-0 transition-all duration-[25] ease-in-out"
                              style={{ width: userNameInputWidth }}
                              onKeyDown={(e) => {
                                if(e.key === "Escape") {
                                  setIsEditingUsername(false);
                                }
                              }}
                            />
                            <X className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                              setIsEditingUsername(false);
                            }} />
                            <Save className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                              // update username and close input
                              setIsEditingUsername(false);
                            }} />
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
                        )): (
                          <h1 className="text-4xl font-bold md:pl-4">{user.username}</h1>
                        )}
                      </div>
                      <div className="flex flex-row items-center md:items-start gap-x-2 pl-0 pt-0 sm:md:pl-3 sm:md:pt-2">
                        {isDeveloperRole && (
                          (
                            <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Image draggable={false} className="select-none cursor-default" src="/badges/developer_badge.svg" width="25" height="25" alt="Developer Badge" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-sm p-1"> Developer </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        )}
                        {isModeratorRole && (
                          <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Image draggable={false} className="select-none cursor-default" src="/badges/moderator_badge.svg" width="25" height="25" alt="Moderator Badge" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm p-1">Moderator</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {isFriendRole && (
                          <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Image draggable={false} className="select-none cursor-default" src="/badges/friend_badge.svg" alt="Friend Badge" width="25" height="25" />
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
                                <Image draggable={false} className="select-none cursor-default" src="/badges/chapman_badge.svg" alt="Chapman Student Badge" width="25" height="25" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm p-1"> Chapman Community </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                    <div className={cn("flex flex-row items-center transition-all duration-100",
                      taglineReloadingEffect && "page-fade-out-and-in"
                    )}>
                      {isCurrentUser ? (isEditingTagline ? (
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
                                  ? unlockedProfileTaglines?.find((tagline) => tagline?.tagline === taglineForUpdate)?.tagline
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
                                          setTaglineForUpdate(currentValue === taglineForUpdate ? "" : currentValue);
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
                          <X className="h-5 w-5 ml-1 mt-1 cursor-pointer" onClick={() => {
                            setIsEditingTagline(false);
                          }} />
                          <Save className="h-5 w-5 ml-1 mt-1 cursor-pointer" onClick={() => {
                            // update tagline and close input
                            // Checks if IDs are not the same to avoid unnecessary updates
                            if(taglineIdForUpdate !== profileTagline?._id) {
                              updateSelectedTagline({
                                clerkId: user.clerkId,
                                taglineId: taglineIdForUpdate!
                              });
                            }
                            setTaglineReloadingEffect(true);
                            setTimeout(() => {
                              setTaglineReloadingEffect(false);
                            }, 2000);
                            setTimeout(() => {
                              setIsEditingTagline(false);
                            }, 250);
                          }} />
                        </>
                      ) : (   
                        <> 
                          <p className="text-md md:pl-4 font-bold text-muted-foreground italic cursor-default">{profileTagline?.tagline}</p>
                          <SquarePen className="h-4 w-4 ml-1 cursor-pointer" onClick={() => {
                            setTaglineForUpdate(profileTagline?.tagline);
                            setIsEditingTagline(true);
                          }} />
                        </>  
                      )): (
                        <p className="text-md md:pl-4 font-bold text-muted-foreground italic">{profileTagline?.tagline}</p>
                      )}
                    </div>
                    <p className="text-md md:pl-4 font-bold text-muted-foreground/60 italic">Guessr since {new Date(user._creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-auto items-start pt-4">
                  <div className="flex flex-row justify-between w-full">
                    <p className="text-md font-bold mr-4">Level {Number(user.level)}</p>
                    <p className="text-md text-muted-foreground font-bold">{Number(user.currentXP)}/{100} XP</p>
                  </div>
                  <Progress className="w-full lg:w-64 mt-1" value={Number(user.currentXP)} />
                </div>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col justify-end">
      </div>
      <Footer />      
    </>
  );
    
};
 
export default ProfilePage;