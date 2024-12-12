import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Flag, Share, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ProfileActionsProps {
  username: string;
  userClerkId: string;
}

const ProfileActions = (
  { username, userClerkId }: ProfileActionsProps
) => {


  const reportUser = useMutation(api.users.reportUser);
  
  const handleReportSubmission = () => {
    reportUser({
      offenderClerkId: userClerkId,
      reportReason: "Reason Coming Soon (Dropdown Menu)",
      reporterMessage: "Reporter Message Coming Soon (User write in)"
    });
  };

  return ( <div className="flex flex-row space-x-4 justify-center lg:justify-end w-full">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon"
            onClick={() => alert("FRIEND REQUESTS COMING SOON")}
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send a friend request</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              description: `@${username} profile URL has been copied to clipboard!`,
            });
          }}>
            <Share className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center">
          <p>Share this profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <AlertDialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Flag className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Report this user</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
Report @{username} to PantherGuessr staff?
          </AlertDialogTitle>
          <AlertDialogDescription>
Are you sure you would like to submit a report about this user? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleReportSubmission()}>
Report @{username}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div> );
};
 
export default ProfileActions;