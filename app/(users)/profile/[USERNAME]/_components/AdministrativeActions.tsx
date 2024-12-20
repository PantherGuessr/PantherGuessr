import { Button } from "@/components/ui/button";
import { useRoleCheck } from "@/hooks/use-role-check";
import { BookHeart, Flame, Hammer, Medal, Send, Trash2 } from "lucide-react";

interface ProfileAdministrativeActionsProps {
  viewerUserID: string;
  isProfileDeveloper: boolean;
  isProfileModerator: boolean;
}

const ProfileAdministrativeActions = ({
  viewerUserID,
  isProfileDeveloper,
  isProfileModerator
} : ProfileAdministrativeActionsProps) => {
  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer", viewerUserID);
  const { result: isModeratorRole, isLoading: moderatorRoleLoading } = useRoleCheck("moderator", viewerUserID);

  if(developerRoleLoading || moderatorRoleLoading) {
    return;
  }

  if(isDeveloperRole || isModeratorRole) {
    return (
      <div className="flex flex-col w-full items-start space-y-1">
        <p className="text-md font-bold">
          {isDeveloperRole ? "Developer Actions" : isModeratorRole ? "Moderator Actions" : ""}
        </p>
        {((isProfileDeveloper && (isModeratorRole && !isDeveloperRole)) || (isProfileModerator && isModeratorRole && !isDeveloperRole)) && (
          <p className="font-bold text-muted-foreground/60 italic">Invalid Permissions</p>
        )}
        <div className="space-y-2 flex-col w-full">
          {((isProfileDeveloper && isDeveloperRole) || (!isProfileDeveloper && !isProfileModerator && (isDeveloperRole || isModeratorRole)) || (!isProfileDeveloper && isProfileModerator && isDeveloperRole)) && (
            <>
              {isDeveloperRole && (
                <Button className="flex w-full" variant="destructive" onClick={() => {
                  alert("Coming soon!");
                }}><Trash2 className="w-4 h-4 mr-2" />Delete User</Button>
              )}

              {(isDeveloperRole || isModeratorRole) && (
                <Button className="flex w-full" variant="destructive" onClick={() => {
                  alert("Coming soon!");
                }}><Hammer className="w-4 h-4 mr-2" />Ban User</Button>
              )}

              {isDeveloperRole && (
                <>
                  <Button className="flex w-full" onClick={() => {
                    alert("Coming soon!");
                  }}><Medal className="w-4 h-4 mr-2" />Modify Level/XP</Button>
                  <Button className="flex w-full" onClick={() => {
                    alert("Coming soon!");
                  }}><BookHeart className="w-4 h-4 mr-2" />Modify Role(s)</Button>
                </>
              )}

              {isDeveloperRole && (
                <Button className="flex w-full" onClick={() => {
                  alert("Coming soon!");
                }}><Flame className="w-4 h-4 mr-2" />Modify Streak</Button>
              )}
            
              {(isDeveloperRole || isModeratorRole) && (
                <Button className="flex w-full" onClick={() => {
                  alert("Coming soon!");
                }}><Send className="w-4 h-4 mr-2" />Review Submissions ({0})</Button>
              )}
            </>
          )}
        </div>
      </div>);
  }

};
 
export default ProfileAdministrativeActions;