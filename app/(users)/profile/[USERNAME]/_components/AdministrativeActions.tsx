import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { api } from "@/convex/_generated/api";
import { useRoleCheck } from "@/hooks/use-role-check";
import { useMutation, useQuery } from "convex/react";
import { BookHeart, Gavel, Hash, Heart, LoaderCircle, Medal, Send, Shield, Trash2, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

interface ProfileAdministrativeActionsProps {
  profileUsername: string;
  viewerUserID: string;
  isProfileDeveloper: boolean;
  isProfileModerator: boolean;
  isCurrentUser: boolean;
}

const roles = [
  { value: "developer", label: "Developer", icon: Wrench },
  { value: "moderator", label: "Moderator", icon: Shield },
  { value: "friend", label: "Friend", icon: Heart }
];

const ProfileAdministrativeActions = ({
  profileUsername,
  viewerUserID,
  isProfileDeveloper,
  isProfileModerator,
  isCurrentUser
} : ProfileAdministrativeActionsProps) => {
  const profileUser = useQuery(api.users.getUserByUsername, { username: profileUsername });
  const { result: isDeveloperRole, isLoading: developerRoleLoading } = useRoleCheck("developer", viewerUserID);
  const { result: isModeratorRole, isLoading: moderatorRoleLoading } = useRoleCheck("moderator", viewerUserID);
  
  // Developer/Moderator Modifier States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Level/XP Action
  const [levelXPModifyDialogOpen, setLevelXPModifyDialogOpen] = useState(false);

  // Delete User Action
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  
  // Roles Action
  const [rolesModifierDialogOpen, setRolesModifierDialogOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const updateSelectedRoles = () => {
    if(profileUser && profileUser.roles) {
      const userRoles = profileUser.roles.map(role => roles.find(r => r.value === role)).filter(Boolean);
      setSelectedRoles(userRoles.filter(role => role !== undefined).map(role => role.value));
    }
  }

  // Backend Functions
  const modifyLevelAndXP = useMutation(api.users.modifyLevelAndXPAdministrativeAction);
  const deleteUser = useMutation(api.users.deleteUserAdministrativeAction);
  const modifyRoles = useMutation(api.users.modifyRolesAdministrativeAction);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (deleteUserDialogOpen) {
      setDeleteCountdown(3);
      timer = setInterval(() => {
        setDeleteCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [deleteUserDialogOpen]);
  
  if(developerRoleLoading || moderatorRoleLoading || !profileUser) {
    return;
  }

  async function handleDeleteUser() {
    setIsSubmitting(true);

    await deleteUser({
      userToDeleteUsername: profileUsername
    });

    setDeleteUserDialogOpen(false);
    setIsSubmitting(false);
  }
  
  async function handleModifyLevelXPSubmission() {
    const newLevel = document.getElementById("level") as HTMLInputElement;
    const newXP = document.getElementById("xp") as HTMLInputElement;

    setIsSubmitting(true);

    await modifyLevelAndXP({
      userToModifyUsername: profileUsername,
      newLevel: BigInt(parseInt(newLevel.value)),
      newXP: BigInt(parseInt(newXP.value))
    });

    setLevelXPModifyDialogOpen(false);
    setIsSubmitting(false);
  }

  async function handleModifyRolesSubmission() {
    setIsSubmitting(true);

    await modifyRoles({
      userToModifyUsername: profileUsername,
      roles: selectedRoles
    });

    setRolesModifierDialogOpen(false);
    setIsSubmitting(false);
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
                <Dialog open={deleteUserDialogOpen} onOpenChange={setDeleteUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full" variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />Delete User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete a User</DialogTitle>
                      <DialogDescription>
                        Delete @{profileUsername} from PantherGuessr. This action is permanent and cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      {isSubmitting ? (
                        <Button variant="default" type="submit" disabled={true}><LoaderCircle className="animate-spin mr-2" size={24} />Deleting User</Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteUserDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            type="submit"
                            onClick={handleDeleteUser}
                            disabled={deleteCountdown > 0}
                          >
                            {deleteCountdown > 0 ? `Delete User (wait ${deleteCountdown})` : "Delete User"}
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {(isDeveloperRole || isModeratorRole) && (
                <Button className="flex w-full" variant="destructive" onClick={() => {
                  alert("Banning Users Coming Soon!");
                }}><Gavel className="w-4 h-4 mr-2" />Ban User</Button>
              )}

              {isDeveloperRole && (
                <Dialog open={levelXPModifyDialogOpen} onOpenChange={setLevelXPModifyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full">
                      <Hash className="w-4 h-4 mr-2" />Modify Level/XP
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modify Level/XP</DialogTitle>
                      <DialogDescription>
                        Modify the level or XP of @{profileUsername}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right">
                          Level
                        </Label>
                        <Input
                          id="level"
                          type="number"
                          step={1}
                          min={0}
                          defaultValue={String(profileUser.level)}
                          disabled={isSubmitting}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="xp" className="text-right">
                          XP
                        </Label>
                        <Input
                          id="xp"
                          type="number"
                          step={1}
                          min={0}
                          defaultValue={String(profileUser.currentXP)}
                          disabled={isSubmitting}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      {isSubmitting ? (
                        <Button variant="default" type="submit" disabled={true}><LoaderCircle className="animate-spin mr-2" size={24} />Submitting Changes</Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setLevelXPModifyDialogOpen(false)}
                          >
                              Cancel
                          </Button>
                          <Button
                            variant="default"
                            type="submit"
                            onClick={handleModifyLevelXPSubmission}
                          >
                              Save Changes
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isDeveloperRole && (
                <Dialog open={rolesModifierDialogOpen} onOpenChange={(isOpen) => {
                  setRolesModifierDialogOpen(isOpen);
                  if (isOpen) updateSelectedRoles();
                }}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full">
                      <BookHeart className="w-4 h-4 mr-2" />Modify Role(s)
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modify User Role(s)</DialogTitle>
                      <DialogDescription>
                        Modify the roles that @{profileUsername} has.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="roles" className="text-left">
                        Role(s)
                        </Label>
                        <MultiSelect
                          options={roles}
                          onValueChange={setSelectedRoles}
                          defaultValue={selectedRoles}
                          placeholder="Select role(s)"
                          variant="inverted"
                          animation={0}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      {isSubmitting ? (
                        <Button variant="default" type="submit" disabled={true}><LoaderCircle className="animate-spin mr-2" size={24} />Submitting Changes</Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => setRolesModifierDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            type="submit"
                            onClick={handleModifyRolesSubmission}
                          >
                            Save Changes
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isDeveloperRole && (
                <Button className="flex w-full" onClick={() => {
                  alert("Achievement Modification Coming Soon!");
                }}><Medal className="w-4 h-4 mr-2" />Modify Achievement(s)</Button>
              )}
            
              {(isDeveloperRole || isModeratorRole) && (
                <Button className="flex w-full" onClick={() => {
                  alert("Submission Reviewing Coming Soon!");
                }}><Send className="w-4 h-4 mr-2" />Review Submissions ({0})</Button>
              )}
            </>
          )}
        </div>
      </div>);
  }

};
 
export default ProfileAdministrativeActions;