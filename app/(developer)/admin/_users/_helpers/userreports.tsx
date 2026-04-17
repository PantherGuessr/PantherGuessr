"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Eye, EyeOff, Gavel, LoaderCircle, MinusCircle } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type EnrichedReport = {
  _id: Id<"userReports">;
  _creationTime: number;
  reportedUser: Id<"users">;
  reporter: Id<"users">;
  reportReason: string;
  reporterMessage?: string;
  hasBeenResolved: boolean;
  moderator?: Id<"users">;
  moderatorMessage?: string;
  reportedUsername: string | null;
  reportedUserPicture: string | null;
  reporterUsername: string | null;
  moderatorUsername: string | null;
};

const UserReports = () => {
  const reports = useQuery(api.admin.getUserReports);
  const resolveUserReport = useMutation(api.admin.resolveUserReport);
  const banUser = useMutation(api.users.banUserAdministrativeAction);

  const [showResolved, setShowResolved] = useState(false);
  const [selectedReport, setSelectedReport] = useState<EnrichedReport | null>(null);
  const [moderatorMessage, setModeratorMessage] = useState("");
  const [banReason, setBanReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = (report: EnrichedReport) => {
    setSelectedReport(report);
    setModeratorMessage("");
    setBanReason("");
    setError(null);
  };

  const closeDialog = () => {
    if (isSubmitting) return;
    setSelectedReport(null);
    setModeratorMessage("");
    setBanReason("");
    setError(null);
  };

  const handleIgnore = async () => {
    if (!selectedReport) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await resolveUserReport({
        reportId: selectedReport._id,
        moderatorMessage: moderatorMessage.trim() || undefined,
      });
      closeDialog();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveAndBan = async () => {
    if (!selectedReport?.reportedUsername) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await banUser({
        userToBanUsername: selectedReport.reportedUsername,
        banReason: banReason.trim() || undefined,
      });
      await resolveUserReport({
        reportId: selectedReport._id,
        moderatorMessage: moderatorMessage.trim() || undefined,
      });
      closeDialog();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const unresolvedCount = reports?.filter((r) => !r.hasBeenResolved).length ?? 0;
  const resolvedCount = reports?.filter((r) => r.hasBeenResolved).length ?? 0;
  const visible = reports?.filter((r) => showResolved || !r.hasBeenResolved) ?? [];

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {unresolvedCount > 0
            ? `${unresolvedCount} open report${unresolvedCount !== 1 ? "s" : ""} awaiting review`
            : reports !== undefined
              ? "No open reports"
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
              <TableHead>Reported User</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports === undefined ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No user reports.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={report.reportedUserPicture ?? undefined}
                          alt={report.reportedUsername ?? ""}
                        />
                        <AvatarFallback>{report.reportedUsername?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">@{report.reportedUsername ?? "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">@{report.reporterUsername ?? "Unknown"}</TableCell>
                  <TableCell className="max-w-[150px]">
                    <p className="truncate text-sm">{report.reportReason}</p>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="truncate text-sm text-muted-foreground">{report.reporterMessage ?? "—"}</p>
                  </TableCell>
                  <TableCell>
                    {report.hasBeenResolved ? (
                      <Badge variant="secondary">Resolved</Badge>
                    ) : (
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">Open</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(report._creationTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={report.hasBeenResolved}
                      onClick={() => openDialog(report)}
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

      <Dialog
        open={selectedReport !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
            <DialogDescription>
              Report against @{selectedReport?.reportedUsername ?? "Unknown"} by @
              {selectedReport?.reporterUsername ?? "Unknown"}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Report Reason</p>
                <p className="mt-1 text-sm">{selectedReport.reportReason}</p>
              </div>
              {selectedReport.reporterMessage && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reporter Message</p>
                  <p className="mt-1 text-sm">{selectedReport.reporterMessage}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="report-moderator-note">Moderator Note</Label>
                <Textarea
                  id="report-moderator-note"
                  placeholder="Add an internal note (optional)..."
                  value={moderatorMessage}
                  onChange={(e) => setModeratorMessage(e.target.value)}
                  disabled={isSubmitting}
                  rows={2}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="report-ban-reason">
                  Ban Reason <span className="font-normal text-muted-foreground">— only used if banning</span>
                </Label>
                <Input
                  id="report-ban-reason"
                  placeholder="Reason shown to the user (optional)..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={closeDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleIgnore} disabled={isSubmitting}>
              {isSubmitting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MinusCircle className="mr-2 h-4 w-4" />
              )}
              Ignore
            </Button>
            <Button
              variant="destructive"
              onClick={handleResolveAndBan}
              disabled={isSubmitting || !selectedReport?.reportedUsername}
            >
              {isSubmitting ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Gavel className="mr-2 h-4 w-4" />
              )}
              Resolve &amp; Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserReports;
