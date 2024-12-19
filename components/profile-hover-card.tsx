import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useHasChapmanEmail } from "@/hooks/use-has-chapman-email";
import { useRoleCheck } from "@/hooks/use-role-check";
import { useGetSelectedTagline } from "@/hooks/userProfiles/use-get-selected-tagline";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IProfileHoverCard {
  username: string,
  hasAtSymbol?: boolean,
  isUnderlined?: boolean
}

const ProfileHoverCard = ({
  username,
  hasAtSymbol = true,
  isUnderlined = false,
} : IProfileHoverCard) => {
  const user = useQuery(api.users.getUserByUsername, { username });
  const { result: isChapmanStudent, isLoading: isChapmanStudentLoading } = useHasChapmanEmail(user?.clerkId);
  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer", user?.clerkId);
  const { result: isTopPlayer, isLoading: topPlayerIsLoading } = useRoleCheck("top_player", user?.clerkId);
  const { result: isModeratorRole, isLoading: moderatorRoleLoading } = useRoleCheck("moderator", user?.clerkId);
  const { result: isFriendRole, isLoading: friendRoleLoading } = useRoleCheck("friend", user?.clerkId);
  const { result: profileTagline } = useGetSelectedTagline(user?.clerkId);

  if(
    !user
    || isChapmanStudentLoading
    || developerRoleLoading
    || topPlayerIsLoading
    || moderatorRoleLoading
    || friendRoleLoading
  ) {
    <Link href={"/profile/" + username}>
      {hasAtSymbol && ("@")}
      <span className={cn(isUnderlined && "underline")}>
        {username}
      </span>
    </Link>;
  }

  return (
    <HoverCard openDelay={0} closeDelay={25}>
      <HoverCardTrigger asChild>
        <Link href={"/profile/" + username}>
          {hasAtSymbol && ("@")}
          <span className={cn(isUnderlined && "underline")}>
            {username}
          </span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 z-[9999]" align="center">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={user?.picture} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-left">
            <div className="flex md:flex-row flex-col items-center md:items-start">
              <div className="flex flex-row items-center">
                <h4 className="text-sm font-semibold">@{username}</h4>
                <div className="flex flex-row items-center gap-x-2 pl-2">
                  {isDeveloperRole && (
                    <Image draggable={false} className="select-none cursor-default" src="/badges/developer_badge.svg" width="15" height="15" alt="Developer Badge" />
                  )}
                  {isModeratorRole && (
                    <Image draggable={false} className="select-none cursor-default" src="/badges/moderator_badge.svg" width="15" height="15" alt="Moderator Badge" />
                  )}
                  {isTopPlayer && (
                    <Image draggable={false} className="select-none cursor-default" src="/badges/top_player_badge.svg" width="15" height="15" alt="Top Ranked Player Badge" />
                  )}
                  {isFriendRole && (
                    <Image draggable={false} className="select-none cursor-default" src="/badges/friend_badge.svg" alt="Friend Badge" width="15" height="15" />
                  )}
                  {isChapmanStudent && (
                    <Image draggable={false} className="select-none cursor-default" src="/badges/chapman_badge.svg" alt="Chapman Student Badge" width="15" height="15" />
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">{profileTagline?.tagline}</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {new Date(user?._creationTime ?? "").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
 
export default ProfileHoverCard;