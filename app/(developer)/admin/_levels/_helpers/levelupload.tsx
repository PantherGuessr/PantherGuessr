"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { LoaderCircle, Plus } from "lucide-react";

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
import { MultiSelect } from "@/components/ui/multi-select";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import DynamicUploadMap from "./dynamic-upload-map";
import { prepareImageForUpload } from "./image-processing";
import { tagsList } from "./level-tags";
import { useMarker } from "./MarkerContext";

const LevelUpload = () => {
  const { data: currentUser } = useCurrentUser();

  const { localMarkerPosition } = useMarker();
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [levelCreatorDialogOpen, setLevelCreatorDialogOpen] = useState(false);
  const generateUploadUrl = useMutation(api.levelcreator.generateUploadUrl);
  const createLevelWithImageStorageId = useMutation(api.levelcreator.createLevelWithImageStorageId);

  // disable submit button if no image, description, or marker position
  useEffect(() => {
    if (!selectedImage || !description || !localMarkerPosition) {
      setSubmitButtonDisabled(true);
    } else {
      setSubmitButtonDisabled(false);
    }
  }, [selectedImage, description, localMarkerPosition]);

  async function handleImageSubmission() {
    // check if form has all required fields
    if (!selectedImage || !description || !localMarkerPosition) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitButtonDisabled(true);

    try {
      // get authenticated user's username
      const username = currentUser?.user.username || "developer";
      const compressedFile = await prepareImageForUpload(selectedImage);

      // uploads the image to convex and then creates a new level with the image
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": compressedFile.type },
        body: compressedFile,
      });
      const { storageId } = await result.json();

      await createLevelWithImageStorageId({
        storageId,
        description,
        latitude: localMarkerPosition.lat,
        longitude: localMarkerPosition.lng,
        authorUsername: username,
        tags: selectedTags,
      });

      // reset form and close dialog
      setSelectedImage(null);
      if (imageInput.current) {
        imageInput.current.value = "";
      }
      setDescription("");
      setSelectedTags([]);
      setLevelCreatorDialogOpen(false);
    } catch (error) {
      console.error("Failed to process or upload image:", error);
      alert("An error occurred during image processing. The file might not be a valid image. Please try another file.");
    } finally {
      setIsSubmitting(false);
      setSubmitButtonDisabled(false);
    }
  }

  return (
    <>
      <Dialog open={levelCreatorDialogOpen} onOpenChange={setLevelCreatorDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus className="mr-2 h-4 w-4" /> Create Level
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Level</DialogTitle>
            <DialogDescription>
              Create a new level by uploading an image and providing all of the necessary details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center">
            <div className="grid w-full items-center gap-1.5 py-2">
              <Label htmlFor="picture">
                Picture <span className="font-bold text-red-500">*</span>
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/png, image/jpeg, image/heic, image/heif, .png, .jpg, .jpeg, .heic, .heif"
                ref={imageInput}
                onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5 py-2">
              <Label htmlFor="description">
                Description <span className="font-bold text-red-500">*</span>
              </Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
              />
            </div>
            <div className="grid w-full items-center gap-1.5 py-2">
              <Label htmlFor="tags">Tags</Label>
              <MultiSelect
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
            <div className="flex h-80 w-full grow py-2">
              <DynamicUploadMap />
            </div>
            {isSubmitting ? (
              <Button variant="default" className="my-2 flex w-full flex-row" disabled={true}>
                <LoaderCircle className="mr-2 animate-spin" size={24} /> Submitting
              </Button>
            ) : (
              <Button
                variant="default"
                className="my-2 w-full"
                disabled={submitButtonDisabled}
                onClick={handleImageSubmission}
              >
                Submit
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LevelUpload;
