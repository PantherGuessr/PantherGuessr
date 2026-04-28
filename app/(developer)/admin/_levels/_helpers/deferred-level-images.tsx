"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { FileImage, LoaderCircle, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/hooks/use-current-user";
import DeferredLevelImageCard from "./deferred-level-image-card";
import { prepareImageForUpload } from "./image-processing";

const MAX_DEFERRED_UPLOADS = 20;

const DeferredLevelImages = () => {
  const { data: currentUser } = useCurrentUser();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const drafts = useQuery(api.levelcreator.getDeferredLevelImageDrafts);
  const generateUploadUrl = useMutation(api.levelcreator.generateDeferredLevelImageUploadUrl);
  const createDrafts = useMutation(api.levelcreator.createDeferredLevelImageDrafts);

  const canUseDeferredUploads = !!currentUser?.roles.isDeveloper;

  function handleFileSelection(files: FileList | null) {
    if (!files) return;

    const images = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || /\.(png|jpe?g|heic|heif)$/i.test(file.name)
    );

    if (images.length > MAX_DEFERRED_UPLOADS) {
      alert(
        `You can upload up to ${MAX_DEFERRED_UPLOADS} images at a time. The first ${MAX_DEFERRED_UPLOADS} were selected.`
      );
    }

    setSelectedImages(images.slice(0, MAX_DEFERRED_UPLOADS));
  }

  async function handleDeferredUpload() {
    if (!canUseDeferredUploads) {
      alert("Only developers can upload deferred level images.");
      return;
    }

    if (selectedImages.length === 0) {
      alert("Please choose at least one image.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const storageIds: Id<"_storage">[] = [];

      for (const [index, selectedImage] of selectedImages.entries()) {
        const compressedFile = await prepareImageForUpload(selectedImage);
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": compressedFile.type },
          body: compressedFile,
        });

        if (!result.ok) {
          throw new Error(`Upload failed for ${selectedImage.name}`);
        }

        const { storageId } = await result.json();
        storageIds.push(storageId);
        setUploadProgress(index + 1);
      }

      await createDrafts({ storageIds });
      setSelectedImages([]);
      if (fileInput.current) {
        fileInput.current.value = "";
      }
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Failed to upload deferred level images:", error);
      alert("An error occurred while uploading these images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mb-8 rounded-md border bg-muted/20 p-4 text-left">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Deferred Images</h3>
          <p className="text-sm text-muted-foreground">
            {drafts
              ? `${drafts.length} image${drafts.length === 1 ? "" : "s"} waiting for level details.`
              : "Loading deferred images..."}
          </p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!canUseDeferredUploads}>
              <Upload className="mr-2 h-4 w-4" /> Upload Draft Images
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Draft Images</DialogTitle>
              <DialogDescription>
                Stage up to {MAX_DEFERRED_UPLOADS} images now, then add descriptions, tags, and pins later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="deferred-level-images">Images</Label>
                <Input
                  id="deferred-level-images"
                  ref={fileInput}
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/heic, image/heif, .png, .jpg, .jpeg, .heic, .heif"
                  onChange={(event) => handleFileSelection(event.target.files)}
                />
              </div>
              {selectedImages.length > 0 && (
                <div className="max-h-40 overflow-auto rounded-md border bg-background p-2 text-sm">
                  {selectedImages.map((image) => (
                    <div key={`${image.name}-${image.size}`} className="flex items-center gap-2 py-1">
                      <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{image.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={handleDeferredUpload} disabled={isUploading || selectedImages.length === 0}>
                {isUploading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Uploading {uploadProgress}/{selectedImages.length}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Save Draft Images
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {drafts && drafts.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {drafts.map((draft) => (
            <DeferredLevelImageCard key={draft._id} draft={draft} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed bg-background px-4 py-6 text-center text-sm text-muted-foreground">
          No deferred images are waiting.
        </div>
      )}
    </div>
  );
};

export default DeferredLevelImages;
