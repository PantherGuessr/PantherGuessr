import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  BookHeart,
  Gavel,
  HandHeart,
  Hash,
  Heart,
  LoaderCircle,
  Medal,
  Send,
  Shield,
  ShieldX,
  Trash2,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { api } from "@/convex/_generated/api";
import { ACHIEVEMENTS } from "@/lib/achievements";

interface ProfileAdministrativeActionsProps {
  profileUsername: string;
  isProfileDeveloper: boolean;
  isProfileModerator: boolean;
  isViewerDeveloper: boolean;
  isViewerModerator: boolean;
  isUserBanned: boolean;
  banReason?: string;
}

const roles = [
  { value: "developer", label: "Developer", icon: Wrench },
  { value: "moderator", label: "Moderator", icon: Shield },
  { value: "contributor", label: "Contributor", icon: HandHeart },
  { value: "friend", label: "Friend", icon: Heart },
];

const ProfileAdministrativeActions = ({
  profileUsername,
  isProfileDeveloper,
  isProfileModerator,
  isViewerDeveloper,
  isViewerModerator,
  isUserBanned,
  banReason,
}: ProfileAdministrativeActionsProps) => {
  const profileUser = useQuery(api.users.getUserByUsername, { username: profileUsername });

  // Developer/Moderator Modifier States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete User Action
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(3);
  const deleteCountdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ban User Action
  const [banUserDialogOpen, setBanUserDialogOpen] = useState(false);

  // Level/XP Action
  const [levelXPModifyDialogOpen, setLevelXPModifyDialogOpen] = useState(false);

  // Roles Action
  const [rolesModifierDialogOpen, setRolesModifierDialogOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Achievements Action
  const [achievementsDialogOpen, setAchievementsDialogOpen] = useState(false);
  const updateSelectedRoles = () => {
    if (profileUser && profileUser.roles) {
      const userRoles = profileUser.roles.map((role) => roles.find((r) => r.value === role)).filter(Boolean);
      setSelectedRoles(userRoles.filter((role) => role !== undefined).map((role) => role.value));
    }
  };

  // Backend Functions
  const deleteUser = useMutation(api.users.deleteUserAdministrativeAction);
  const banUser = useMutation(api.users.banUserAdministrativeAction);
  const unbanUser = useMutation(api.users.unbanUserAdministrativeAction);
  const modifyLevelAndXP = useMutation(api.users.modifyLevelAndXPAdministrativeAction);
  const modifyRoles = useMutation(api.users.modifyRolesAdministrativeAction);
  const grantAchievement = useMutation(api.achievements.adminGrantAchievement);
  const revokeAchievement = useMutation(api.achievements.adminRevokeAchievement);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (deleteCountdownTimerRef.current) clearInterval(deleteCountdownTimerRef.current);
    };
  }, []);

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (open) {
      setDeleteCountdown(3);
      deleteCountdownTimerRef.current = setInterval(() => {
        setDeleteCountdown((prev) => {
          if (prev <= 1) {
            if (deleteCountdownTimerRef.current) clearInterval(deleteCountdownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (deleteCountdownTimerRef.current) clearInterval(deleteCountdownTimerRef.current);
      setDeleteCountdown(3);
    }
    setDeleteUserDialogOpen(open);
  };

  if (!profileUser) {
    return;
  }

  async function handleDeleteUser() {
    setIsSubmitting(true);

    await deleteUser({
      userToDeleteUsername: profileUsername,
    });

    setDeleteUserDialogOpen(false);
    setIsSubmitting(false);
  }

  async function handleToggleBanUser() {
    setIsSubmitting(true);

    if (isUserBanned) {
      await unbanUser({
        userToUnban: profileUsername,
      });
    } else {
      const reason = document.getElementById("ban_reason") as HTMLInputElement;

      await banUser({
        userToBanUsername: profileUsername,
        banReason: reason.value == "" ? undefined : reason.value,
      });
    }

    setBanUserDialogOpen(false);
    setIsSubmitting(false);
  }

  async function handleModifyLevelXPSubmission() {
    const newLevel = document.getElementById("level") as HTMLInputElement;
    const newXP = document.getElementById("xp") as HTMLInputElement;

    setIsSubmitting(true);

    await modifyLevelAndXP({
      userToModifyUsername: profileUsername,
      newLevel: BigInt(parseInt(newLevel.value)),
      newXP: BigInt(parseInt(newXP.value)),
    });

    setLevelXPModifyDialogOpen(false);
    setIsSubmitting(false);
  }

  async function handleModifyRolesSubmission() {
    setIsSubmitting(true);

    await modifyRoles({
      userToModifyUsername: profileUsername,
      roles: selectedRoles,
    });

    setRolesModifierDialogOpen(false);
    setIsSubmitting(false);
  }

  async function handleToggleAchievement(achievementId: string) {
    const has = (profileUser?.achievements ?? []).some((a) => a.id === achievementId);
    if (has) {
      await revokeAchievement({ targetUsername: profileUsername, achievementId });
    } else {
      await grantAchievement({ targetUsername: profileUsername, achievementId });
    }
  }

  if (isViewerDeveloper || isViewerModerator) {
    return (
      <div className="flex w-full flex-col items-start space-y-1">
        {!(
          (isProfileDeveloper && isViewerModerator && !isViewerDeveloper) ||
          (isProfileModerator && isViewerModerator && !isViewerDeveloper)
        ) && (
          <p className="text-md font-bold">
            {isViewerDeveloper ? "Developer Actions" : isViewerModerator ? "Moderator Actions" : ""}
          </p>
        )}
        {((isProfileDeveloper && isViewerModerator && !isViewerDeveloper) ||
          (isProfileModerator && isViewerModerator && !isViewerDeveloper)) && (
          <div className="flex flex-col items-center">
            <ShieldX className="mb-2 h-6 w-6 text-muted-foreground/60" />
            <p className="font-bold italic text-muted-foreground/60">
              You have invalid permissions to modify this user.
            </p>
          </div>
        )}
        <div className="w-full flex-col space-y-2">
          {((isProfileDeveloper && isViewerDeveloper) ||
            (!isProfileDeveloper && !isProfileModerator && (isViewerDeveloper || isViewerModerator)) ||
            (!isProfileDeveloper && isProfileModerator && isViewerDeveloper)) && (
            <>
              {isViewerDeveloper && (
                <Dialog open={deleteUserDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full" variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete User
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
                        <Button variant="default" type="submit" disabled={true}>
                          <LoaderCircle className="mr-2 animate-spin" size={24} />
                          Deleting User
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => handleDeleteDialogOpenChange(false)}>
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

              {(isViewerDeveloper || isViewerModerator) && (
                <Dialog open={banUserDialogOpen} onOpenChange={setBanUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full" variant="destructive">
                      <Gavel className="mr-2 h-4 w-4" />
                      {isUserBanned ? "Unban User" : "Ban User"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{isUserBanned ? "Unban User" : "Ban User"}</DialogTitle>
                      <DialogDescription>
                        {isUserBanned
                          ? `Unban @${profileUsername} from PantherGuessr.`
                          : `Ban @${profileUsername} from PantherGuessr and provide an optional ban reason which the user will be able to see.`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="ban_reason" className="text-left">
                          Ban Reason
                        </Label>
                        {isUserBanned ? (
                          <Input
                            id="ban_reason"
                            disabled={true}
                            defaultValue={banReason ?? "None Provided"}
                            className="w-full"
                          />
                        ) : (
                          <Input id="ban_reason" disabled={isSubmitting} className="w-full" />
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      {isSubmitting ? (
                        <Button variant="default" type="submit" disabled={true}>
                          <LoaderCircle className="mr-2 animate-spin" size={24} />
                          Banning User
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => setBanUserDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" type="submit" onClick={handleToggleBanUser}>
                            {isUserBanned ? "Unban" : "Ban"} @{profileUsername}
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isViewerDeveloper && (
                <Dialog open={levelXPModifyDialogOpen} onOpenChange={setLevelXPModifyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full">
                      <Hash className="mr-2 h-4 w-4" />
                      Modify Level/XP
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modify Level/XP</DialogTitle>
                      <DialogDescription>Modify the level or XP of @{profileUsername}.</DialogDescription>
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
                        <Button variant="default" type="submit" disabled={true}>
                          <LoaderCircle className="mr-2 animate-spin" size={24} />
                          Submitting Changes
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => setLevelXPModifyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="default" type="submit" onClick={handleModifyLevelXPSubmission}>
                            Save Changes
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isViewerDeveloper && (
                <Dialog
                  open={rolesModifierDialogOpen}
                  onOpenChange={(isOpen) => {
                    setRolesModifierDialogOpen(isOpen);
                    if (isOpen) updateSelectedRoles();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="flex w-full">
                      <BookHeart className="mr-2 h-4 w-4" />
                      Modify Role(s)
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Modify User Role(s)</DialogTitle>
                      <DialogDescription>Modify the roles that @{profileUsername} has.</DialogDescription>
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
                          renderInPlace
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      {isSubmitting ? (
                        <Button variant="default" type="submit" disabled={true}>
                          <LoaderCircle className="mr-2 animate-spin" size={24} />
                          Submitting Changes
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => setRolesModifierDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="default" type="submit" onClick={handleModifyRolesSubmission}>
                            Save Changes
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {isViewerDeveloper && (
                <Dialog open={achievementsDialogOpen} onOpenChange={setAchievementsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex w-full">
                      <Medal className="mr-2 h-4 w-4" />
                      Manage Achievements
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Manage Achievements</DialogTitle>
                      <DialogDescription>Grant or revoke achievements for @{profileUsername}.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 py-4">
                      {ACHIEVEMENTS.map((achievement) => {
                        const unlocked = (profileUser?.achievements ?? []).some((a) => a.id === achievement.id);
                        return (
                          <div
                            key={achievement.id}
                            className="flex items-center gap-3 rounded-md border px-3 py-2"
                          >
                            <Image
                              src={achievement.imageSrc}
                              width={44}
                              height={44}
                              alt={achievement.name}
                              className="shrink-0 select-none"
                              draggable={false}
                            />
                            <div className="flex min-w-0 flex-1 flex-col">
                              <p className="text-sm font-semibold">{achievement.name}</p>
                              <p className="text-xs text-muted-foreground">{achievement.description}</p>
                            </div>
                            <Button
                              size="sm"
                              variant={unlocked ? "destructive" : "default"}
                              className="shrink-0"
                              onClick={() => handleToggleAchievement(achievement.id)}
                            >
                              {unlocked ? "Revoke" : "Grant"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {(isViewerDeveloper || isViewerModerator) && (
                <Button className="flex w-full" disabled={true}>
                  <Send className="mr-2 h-4 w-4" />
                  Review Submissions ({0})
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
};

export default ProfileAdministrativeActions;
