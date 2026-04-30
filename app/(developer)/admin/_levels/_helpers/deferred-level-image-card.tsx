"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { CheckCircle2, LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DynamicUploadMap from "./dynamic-upload-map";
import { tagsList } from "./level-tags";
import { useMarker } from "./MarkerContext";

type DeferredLevelImageDraft = {
  _id: Id<"deferredLevelImages">;
  _creationTime: number;
  imageId: Id<"_storage">;
  uploadedByClerkId: string;
  uploadedByUsername?: string;
};

const DeferredLevelImageCard = ({ draft }: { draft: DeferredLevelImageDraft }) => {
  const { localMarkerPosition, setLocalMarkerPosition } = useMarker();
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageSrc = useQuery(api.levelcreator.getDeferredLevelImageDraftSrc, { draftId: draft._id });
  const completeDraft = useMutation(api.levelcreator.completeDeferredLevelImageDraft);
  const deleteDraft = useMutation(api.levelcreator.deleteDeferredLevelImageDraft);
  const normalizedDescription = description.replace(/\s*\r?\n\s*/g, " ").trim();
  const uploadedAt = new Date(draft._creationTime).toLocaleString(undefined, {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  function resetCompletionForm() {
    setDescription("");
    setSelectedTags([]);
    setLocalMarkerPosition(null);
  }

  async function handleCompleteDraft() {
    if (!normalizedDescription || !localMarkerPosition) {
      alert("Please add a description and place the pin.");
      return;
    }

    setIsCompleting(true);

    try {
      await completeDraft({
        draftId: draft._id,
        description: normalizedDescription,
        latitude: localMarkerPosition.lat,
        longitude: localMarkerPosition.lng,
        tags: selectedTags,
      });
      setCompleteDialogOpen(false);
      resetCompletionForm();
    } catch (error) {
      console.error("Failed to complete deferred level image:", error);
      alert("An error occurred while creating this level. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  }

  async function handleDeleteDraft() {
    if (!window.confirm("Delete this deferred image? This will remove the uploaded image from storage.")) return;

    setIsDeleting(true);
    try {
      await deleteDraft({ draftId: draft._id });
    } catch (error) {
      console.error("Failed to delete deferred level image:", error);
      alert("An error occurred while deleting this deferred image. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="relative h-32 bg-muted">
        {imageSrc ? (
          <Image src={imageSrc} alt="Deferred level image" fill className="object-cover" />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>
      <div className="space-y-2 p-2.5">
        <div className="line-clamp-1 text-xs text-muted-foreground">
          Uploaded {uploadedAt}
          {draft.uploadedByUsername ? ` by ${draft.uploadedByUsername}` : ""}
        </div>
        <div className="flex gap-2">
          <Dialog
            open={completeDialogOpen}
            onOpenChange={(open) => {
              setCompleteDialogOpen(open);
              if (!open) resetCompletionForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex-1" size="sm" onClick={() => setLocalMarkerPosition(null)}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Complete Deferred Level</DialogTitle>
                <DialogDescription>Add the level details and place the correct image pin.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] md:items-start">
                  {imageSrc ? (
                    <div className="relative aspect-4/3 max-h-64 overflow-hidden rounded-md bg-muted">
                      <Image src={imageSrc} alt="Deferred level image" fill className="object-contain" />
                    </div>
                  ) : (
                    <Skeleton className="aspect-4/3 max-h-64 w-full" />
                  )}
                  <div className="grid gap-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor={`description-${draft._id}`}>
                        Description <span className="font-bold text-red-500">*</span>
                      </Label>
                      <Textarea
                        id={`description-${draft._id}`}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description"
                        className="min-h-28 resize-y"
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor={`tags-${draft._id}`}>Tags</Label>
                      <MultiSelect
                        key={`${draft._id}-${completeDialogOpen}`}
                        options={tagsList}
                        onValueChange={setSelectedTags}
                        defaultValue={selectedTags}
                        placeholder="Select tags"
                        variant="inverted"
                        animation={0}
                        maxCount={3}
                        renderInPlace
                      />
                    </div>
                  </div>
                </div>
                <div className="flex h-80 w-full grow py-2">
                  <DynamicUploadMap />
                </div>
                <Button
                  onClick={handleCompleteDraft}
                  disabled={isCompleting || !normalizedDescription || !localMarkerPosition}
                >
                  {isCompleting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Creating Level
                    </>
                  ) : (
                    "Create Level"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={handleDeleteDraft} disabled={isDeleting}>
            {isDeleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span className="sr-only">Delete deferred image</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeferredLevelImageCard;
