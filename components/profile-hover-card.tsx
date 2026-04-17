import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { CalendarDays, Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useUserProfile } from "@/hooks/use-user-profile";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type IProfileHoverCard =
  | { userID: string; username?: never; showHoverCard?: boolean }
  | { username: string; userID?: never; showHoverCard?: boolean };

const ProfileHoverCard = ({ userID, username, showHoverCard = true }: IProfileHoverCard) => {
  const user = useQuery(
    username ? api.users.getUserByUsername : api.users.getUserById,
    username ? { username } : userID ? { id: userID } : "skip"
  );

  const { data: profile, isLoading: profileLoading } = useUserProfile(user?.clerkId);

  const [isOpen, setIsOpen] = useState(false);

  if (user === undefined || profileLoading) {
    return (
      <span className={"flex items-center justify-center font-bold"}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    );
  }

  if (!user) {
    return (
      <span className="mx-0.5 select-none rounded-lg bg-background px-1 py-[0.2rem] font-bold outline outline-[#3E0000] transition-colors duration-200 dark:outline-white">
        {"USER NOT FOUND"}
      </span>
    );
  }

  if (!showHoverCard) {
    return (
      <span className="mx-0.5 select-none rounded-lg bg-background px-1 py-[0.2rem] font-bold outline outline-[#3E0000] transition-colors duration-200 dark:outline-white">
        @{user?.username}
      </span>
    );
  }

  return (
    <HoverCard openDelay={0} closeDelay={100} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <Link href={"/profile/" + user?.username}>
          <span
            className={cn(
              "mx-0.5 select-none rounded-lg bg-background px-1 py-[0.2rem] font-bold outline outline-[#3E0000] transition-colors duration-200 dark:outline-white",
              isOpen ? "bg-[#eaeaea] dark:bg-[#330707]" : "hover:bg-[#eaeaea] dark:hover:bg-[#330707]"
            )}
          >
            @{user?.username}
          </span>
        </Link>
      </HoverCardTrigger>
      <Link href={"/profile/" + user?.username}>
        <HoverCardContent className="z-[9999] my-2 w-80 select-none" align="center">
          <div className="flex space-x-4">
            <Avatar className="select-none">
              <AvatarImage src={user?.picture} />
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-left">
              <div className="flex flex-col items-start md:flex-row">
                <div className="items-left flex flex-row">
                  <h4 className="text-sm font-semibold">@{user?.username}</h4>
                  <div className="flex flex-row items-center gap-x-2 pl-2">
                    {profile?.roles.isDeveloper && (
                      <Image
                        draggable={false}
                        className="transform-gpu select-none drop-shadow"
                        src="/badges/developer_badge.svg"
                        width="15"
                        height="15"
                        alt="Developer Badge"
                      />
                    )}
                    {profile?.roles.isModerator && (
                      <Image
                        draggable={false}
                        className="transform-gpu select-none drop-shadow"
                        src="/badges/moderator_badge.svg"
                        width="15"
                        height="15"
                        alt="Moderator Badge"
                      />
                    )}
                    {profile?.roles.isContributor && (
                      <Image
                        draggable={false}
                        className="transform-gpu select-none drop-shadow"
                        src="/badges/contributor_badge.svg"
                        width="15"
                        height="15"
                        alt="Contributor Badge"
                      />
                    )}
                    {profile?.roles.isTopPlayer && (
                      <Image
                        draggable={false}
                        className="transform-gpu select-none drop-shadow"
                        src="/badges/top_player_badge.svg"
                        width="15"
                        height="15"
                        alt="Top Ranked Player Badge"
                      />
                    )}
                    {profile?.roles.isFriend && (
                      <Image
                        draggable={false}
                        className="transform-gpu select-none drop-shadow"
                        src="/badges/friend_badge.svg"
                        alt="Friend Badge"
                        width="15"
                        height="15"
                      />
                    )}
                    {profile?.hasChapmanEmail && (
                      <Image
                        draggable={false}
                        className="transform-gpu select-none drop-shadow"
                        src="/badges/chapman_badge.svg"
                        alt="Chapman Student Badge"
                        width="15"
                        height="15"
                      />
                    )}
                  </div>
                </div>
              </div>
              <p className="select-none text-sm font-bold italic text-muted-foreground">
                {profile?.selectedTagline?.tagline}
              </p>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="select-none text-xs font-bold text-muted-foreground">
                  Joined{" "}
                  {new Date(user?._creationTime ?? "").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </Link>
    </HoverCard>
  );
};

export default ProfileHoverCard;
