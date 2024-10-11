"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";


const Levels = () => {

    const defaultImageSource = "/Invalid-Image.jpg";

    const [clickedLevelId, setClickedLevelId] = useState<Id<"levels"> | null>(null);
    const [currentImageSrcUrl, setCurrentSrcUrl] = useState(defaultImageSource);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const tableData = useQuery(api.admin.getAllLevels);
    const imageSrc = useQuery(api.admin.getImageSrcByLevelId, clickedLevelId ? { id: clickedLevelId } : "skip");

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            setClickedLevelId(tableData[0]._id);
        }
    }, [tableData]);

    useEffect(() => {
        if (imageSrc) {
            setCurrentSrcUrl(imageSrc);
        }
    }, [imageSrc]);

    const handleDialogClose = () => {
        setCurrentSrcUrl(defaultImageSource);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData && tableData.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row._id}</TableCell>
                            <TableCell className="flex flex-col justify-items-center align-middle">
                                <Dialog onOpenChange={(open) => {
                                    setIsDialogOpen(open);
                                    if (!open) {
                                        handleDialogClose();
                                    }
                                }}>
                                    {
                                        //TODO: Add Skeleton for image loading
                                    }
                                    <DialogTrigger asChild>
                                        <Button onClick={() => setClickedLevelId(row._id)}>
                                            View
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {row.title}
                                            </DialogTitle>
                                            <DialogDescription>
                                                Image ID: {row.imageId}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-center">
                                            <Image className="w-full" width="300" height="225" src={currentImageSrcUrl} alt={row.title} id={"image-" + row.imageId} />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>{row.latitude}</TableCell>
                            <TableCell>{row.longitude}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default Levels;