"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Eye, EyeOff, LoaderCircle, XCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type EnrichedAppeal = {
  _id: Id<"banAppeals">;
  _creationTime: number;
  user: Id<"users">;
  banReason?: string;
  appealMessage: string;
  hasBeenResolved: boolean;
  moderator?: Id<"users">;
  moderatorMessage?: string;
  username: string | null;
  userPicture: string | null;
  isBanned: boolean;
  moderatorUsername: string | null;
};

const BanAppeals = () => {
  const appeals = useQuery(api.admin.getBanAppeals);
  const resolveBanAppeal = useMutation(api.admin.resolveBanAppeal);

  const [showResolved, setShowResolved] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState<EnrichedAppeal | null>(null);
  const [moderatorMessage, setModeratorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = (appeal: EnrichedAppeal) => {
    setSelectedAppeal(appeal);
    setModeratorMessage("");
    setError(null);
  };

  const closeDialog = () => {
    if (isSubmitting) return;
    setSelectedAppeal(null);
    setModeratorMessage("");
    setError(null);
  };

  const handleResolve = async (approve: boolean) => {
    if (!selectedAppeal) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await resolveBanAppeal({
        appealId: selectedAppeal._id,
        approve,
        moderatorMessage: moderatorMessage.trim() || undefined,
      });
      closeDialog();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const unresolvedCount = appeals?.filter((a) => !a.hasBeenResolved).length ?? 0;
  const resolvedCount = appeals?.filter((a) => a.hasBeenResolved).length ?? 0;
  const visible = appeals?.filter((a) => showResolved || !a.hasBeenResolved) ?? [];

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unresolvedCount > 0
            ? `${unresolvedCount} open appeal${unresolvedCount !== 1 ? "s" : ""} awaiting review`
            : appeals !== undefined
              ? "No open appeals"
              : ""}
        </p>
        {resolvedCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setShowResolved((v) => !v)}>
            {showResolved ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Resolved ({resolvedCount})
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Resolved ({resolvedCount})
              </>
            )}
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Currently Banned</TableHead>
              <TableHead>Ban Reason</TableHead>
              <TableHead>Appeal Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appeals === undefined ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No ban appeals.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((appeal) => (
                <TableRow key={appeal._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appeal.userPicture ?? undefined} alt={appeal.username ?? ""} />
                        <AvatarFallback>{appeal.username?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">@{appeal.username ?? "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {appeal.isBanned ? (
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[150px]">
                    <p className="truncate text-sm text-muted-foreground">{appeal.banReason ?? "None"}</p>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate text-sm">{appeal.appealMessage}</p>
                  </TableCell>
                  <TableCell>
                    {appeal.hasBeenResolved ? (
                      <Badge variant="secondary">Resolved</Badge>
                    ) : (
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">Open</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(appeal._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={appeal.hasBeenResolved}
                      onClick={() => openDialog(appeal)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={selectedAppeal !== null} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Ban Appeal</DialogTitle>
            <DialogDescription>
              Appeal submitted by @{selectedAppeal?.username ?? "Unknown"}
            </DialogDescription>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ban Reason</p>
                <p className="mt-1 text-sm">{selectedAppeal.banReason ?? "None provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appeal Message</p>
                <p className="mt-1 text-sm">{selectedAppeal.appealMessage}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appeal-moderator-note">Moderator Note</Label>
                <Textarea
                  id="appeal-moderator-note"
                  placeholder="Add an internal note (optional)..."
                  value={moderatorMessage}
                  onChange={(e) => setModeratorMessage(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={closeDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleResolve(false)} disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Deny
            </Button>
            <Button variant="default" onClick={() => handleResolve(true)} disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve & Unban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BanAppeals;
