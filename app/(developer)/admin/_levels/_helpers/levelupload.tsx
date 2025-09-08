import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import imageCompression from "browser-image-compression";
import { useMutation } from "convex/react";
import heic2any from "heic2any";
import { CarFront, House, LoaderCircle, Plus, Store, University } from "lucide-react";

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
import DynamicUploadMap from "./dynamic-upload-map";
import { useMarker } from "./MarkerContext";

const tagsList = [
  { value: "Standard", label: "Standard", icon: University },
  { value: "Off Campus", label: "Off Campus", icon: CarFront },
  { value: "Orange Circle", label: "Orange Circle", icon: Store },
  { value: "Residence Areas", label: "Residence Areas", icon: House },
];

const LevelUpload = () => {
  const user = useUser();

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
    const description = document.getElementById("description") as HTMLInputElement;
    const markerPosition = localMarkerPosition;

    // check if form has all required fields
    if (!selectedImage || !description || !markerPosition) {
      alert("Please fill out all required fields.");
      return;
    } else {
      setIsSubmitting(true);
      setSubmitButtonDisabled(true);

      // get authenticated user's username
      const username = user.user?.username || "developer";

      // create buffers for HEIC to JPEG conversion
      const imageBuffer = await selectedImage.arrayBuffer();
      let convertedBuffer: ArrayBuffer | undefined;
      let imageConverted = false;
      let chosenImage = selectedImage;

      // Convert HEIC to JPEG or PNG if necessary
      if (selectedImage.type === "image/heic" || selectedImage.type === "image/heif") {
        imageConverted = true;
        const convertedBlob = await heic2any({
          blob: selectedImage,
          toType: "image/jpeg",
          quality: 0.9,
        });
        // checks to see if blobs may be an array (should not be but here for safety)
        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        // creates chosen image file 
        chosenImage = new File([finalBlob], selectedImage.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
      }

      // only change the file if it was converted
      if (imageConverted && convertedBuffer) {
        // convert buffer to a Blob
        const blob = new Blob([convertedBuffer], { type: "image/jpeg" });
        // convert Blob to File
        chosenImage = new File([blob], selectedImage.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
      }

      // image compression options regardless of conversion
      const imageCompressionOptions = {
        maxSizeMB: 1.0,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      // gets compressed file
      const compressedFile = await imageCompression(chosenImage, imageCompressionOptions);

      // uploads the image to convex and then creates a new level with the image
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();
      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type":
            selectedImage.type === "image/heic" || selectedImage.type === "image/heif"
              ? "image/jpeg"
              : selectedImage.type,
        },
        body: compressedFile,
      });
      const { storageId } = await result.json();
      // Step 3: Save the newly allocated storage id to the database
      await createLevelWithImageStorageId({
        storageId,
        description: description.value,
        latitude: markerPosition.lat,
        longitude: markerPosition.lng,
        authorUsername: username,
        tags: selectedTags,
      });

      // reset form and close dialog
      setSelectedImage(null);
      imageInput.current!.value = "";
      setDescription("");
      setSelectedTags([]);
      setSubmitButtonDisabled(false);
      setLevelCreatorDialogOpen(false);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={levelCreatorDialogOpen} onOpenChange={setLevelCreatorDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" /> Create Level
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
                accept="image/png, image/jpg, image/jpeg, image/heic, image/heif"
                ref={imageInput}
                onChange={(event) => setSelectedImage(event.target.files![0])}
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
            <div className="flex w-full h-80 grow py-2">
              <DynamicUploadMap />
            </div>
            {isSubmitting ? (
              <Button variant="default" className="w-full my-2 flex flex-row" disabled={true}>
                <LoaderCircle className="animate-spin mr-2" size={24} /> Submitting
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full my-2"
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
