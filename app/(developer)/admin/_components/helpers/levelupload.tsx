import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UploadMap from "./upload-map";
import { useMarker } from "./MarkerContext";


const LevelUpload = () => {

    const { localMarkerPosition } = useMarker();

    const handleImageSubmission = () => {

        const imageData = document.getElementById("picture") as HTMLInputElement;
        const description = document.getElementById("description") as HTMLInputElement;
        const markerPosition = localMarkerPosition;

        console.log(imageData);
        console.log(description);
        console.log(markerPosition);

        // check if form has all required fields
        if (!imageData || !description || !markerPosition) {
            alert("Please fill out all required fields.");
            return;
        }
        else {

        }
        
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="default">Create Level</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create Level
                        </DialogTitle>
                        <DialogDescription>
                            Create a new level by uploading an image and providing all of the necessary details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center">
                        <div className="grid w-full items-center gap-1.5 py-2">
                            <Label htmlFor="picture">Picture</Label>
                            <Input id="picture" type="file" accept="image/png, image/jpg, image/jpeg, image/heic, image/heif"/>
                        </div>
                        <div className="grid w-full items-center gap-1.5 py-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" type="text" placeholder="Description"/>
                        </div>
                        <div className="flex w-full h-80 grow py-2">
                            <UploadMap />
                        </div>
                        <Button variant="default" className="w-full my-2" onClick={handleImageSubmission}>Submit</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )

}

export default LevelUpload;