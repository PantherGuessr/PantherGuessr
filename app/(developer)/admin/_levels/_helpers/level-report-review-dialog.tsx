"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle, LoaderCircle, MinusCircle, MapPin, ImageIcon } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DynamicReviewMap from "./dynamic-review-map";

const REASON_LABELS: Record<string, string> = {
  not_university_property: "Not part of the university property",
  pin_incorrectly_placed: "Pin is incorrectly placed",
  wrong_image: "Something is wrong with the image",
  outdated_image: "Outdated image",
};

export type ReviewableReport = {
  _id: Id<"levelReports">;
  _creationTime: number;
  levelId: Id<"levels">;
  levelTitle: string;
  reason: string;
  latitude: number;
  longitude: number;
  status: "pending" | "resolved" | "dismissed";
};

interface LevelReportReviewDialogProps {
  report: ReviewableReport | null;
  open: boolean;
  onClose: () => void;
}

const LevelReportReviewDialog = ({ report, open, onClose }: LevelReportReviewDialogProps) => {
  const imageFileInput = useRef<HTMLInputElement>(null);

  const [editedLat, setEditedLat] = useState(0);
  const [editedLng, setEditedLng] = useState(0);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageSrc = useQuery(
    api.admin.getImageSrcByLevelId,
    open && report ? { id: report.levelId } : "skip"
  );

  const generateUploadUrl = useMutation(api.levelcreator.generateUploadUrl);
  const updateLevel = useMutation(api.levelcreator.updateLevel);
  const resolveLevelReport = useMutation(api.reports.resolveLevelReport);
  const dismissLevelReport = useMutation(api.reports.dismissLevelReport);

  // Reset all edits when dialog opens for a new report
  useEffect(() => {
    if (open && report) {
      setEditedLat(report.latitude);
      setEditedLng(report.longitude);
      setNewImageFile(null);
      setNewImagePreviewUrl(null);
      setError(null);
    }
  }, [open, report?._id]);

  // Clean up object URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    };
  }, [newImagePreviewUrl]);

  const pinChanged = report ? editedLat !== report.latitude || editedLng !== report.longitude : false;
  const imageChanged = newImageFile !== null;
  const hasChanges = pinChanged || imageChanged;

  const handleFileSelect = (file: File | null) => {
    if (newImagePreviewUrl) URL.revokeObjectURL(newImagePreviewUrl);
    setNewImageFile(file);
    setNewImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const saveChanges = async () => {
    if (!report || !hasChanges) return;

    let newImageId: Id<"_storage"> | undefined;

    if (imageChanged && newImageFile) {
      const [{ default: imageCompression }, { default: heic2any }] = await Promise.all([
        import("browser-image-compression"),
        import("heic2any"),
      ]);

      let fileToProcess = newImageFile;
      const fileName = newImageFile.name.toLowerCase();
      const isHeicOrHeif =
        newImageFile.type === "image/heic" ||
        newImageFile.type === "image/heif" ||
        fileName.endsWith(".heic") ||
        fileName.endsWith(".heif");

      if (isHeicOrHeif) {
        const convertedBlob = await heic2any({ blob: newImageFile, toType: "image/jpeg", quality: 0.9 });
        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        fileToProcess = new File([finalBlob], newImageFile.name.replace(/\.[^/.]+$/, ".jpg"), {
          type: "image/jpeg",
        });
      }

      const compressedFile = await imageCompression(fileToProcess, {
        maxSizeMB: 1.0,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": compressedFile.type },
        body: compressedFile,
      });
      const { storageId } = await result.json();
      newImageId = storageId;
    }

    await updateLevel({
      levelId: report.levelId,
      newImageId,
      latitude: pinChanged ? editedLat : undefined,
      longitude: pinChanged ? editedLng : undefined,
    });
  };

  const handleAction = async (action: "resolve" | "dismiss") => {
    if (!report) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (hasChanges) await saveChanges();
      if (action === "resolve") {
        await resolveLevelReport({ reportId: report._id });
      } else {
        await dismissLevelReport({ reportId: report._id });
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImageSrc = newImagePreviewUrl ?? imageSrc ?? null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && !isSubmitting) onClose(); }}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Level Report</DialogTitle>
          <DialogDescription>
            Report for &quot;{report?.levelTitle ?? "Unknown"}&quot; —{" "}
            {report ? (REASON_LABELS[report.reason] ?? report.reason) : ""}
          </DialogDescription>
        </DialogHeader>

        {report && (
          <div className="space-y-4">
            {/* Image + Map side by side */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Image panel */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4" />
                    Image
                    {imageChanged && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        Changed
                      </Badge>
                    )}
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => imageFileInput.current?.click()}
                    disabled={isSubmitting}
                  >
                    Replace Image
                  </Button>
                  <input
                    ref={imageFileInput}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/heic,image/heif"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-md border bg-secondary">
                  {displayImageSrc ? (
                    <Image
                      src={displayImageSrc}
                      alt={report.levelTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Skeleton className="h-full w-full" />
                  )}
                </div>
                {imageChanged && newImageFile && (
                  <p className="truncate text-xs text-muted-foreground">
                    New image: {newImageFile.name}
                  </p>
                )}
              </div>

              {/* Map panel */}
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  Pin Location
                  {pinChanged && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      Changed
                    </Badge>
                  )}
                </Label>
                <p className="text-xs text-muted-foreground">Click on the map to move the pin.</p>
                <div className="aspect-4/3 w-full">
                  <DynamicReviewMap
                    initialLat={report.latitude}
                    initialLng={report.longitude}
                    onPositionChange={(lat, lng) => {
                      setEditedLat(lat);
                      setEditedLng(lng);
                    }}
                  />
                </div>
                {pinChanged && (
                  <p className="text-xs text-muted-foreground">
                    New: {editedLat.toFixed(6)}, {editedLng.toFixed(6)}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {hasChanges && (
              <p className="text-sm text-muted-foreground">
                You have unsaved changes. They will be saved automatically when you resolve or dismiss.
              </p>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleAction("dismiss")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MinusCircle className="mr-2 h-4 w-4" />
            )}
            {hasChanges ? "Save & Dismiss" : "Dismiss"}
          </Button>
          <Button onClick={() => handleAction("resolve")} disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {hasChanges ? "Save & Resolve" : "Resolve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LevelReportReviewDialog;
