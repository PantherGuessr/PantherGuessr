"use client"

import { Button } from "@/components/ui/button";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"
   
  import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { StorageId } from "convex/server";
import { DataTable } from "./helpers/datatable";

type Level = {
    _id: Id<"levels">;
    _creationTime: number;
    title: string;
    latitude: number;
    longitude: number;
    imageId: string;
    timesPlayed: bigint;
};


const Levels = () => {

    const defaultImageSource = "/Invalid-Image.jpg";

    // accessors and mutators for states
    const [clickedLevelId, setClickedLevelId] = useState<Id<"levels"> | null>(null);
    const [currentImageSrcUrl, setCurrentSrcUrl] = useState(defaultImageSource);
    const [openDialogId, setOpenDialogId] = useState<Id<"levels"> | null>(null);

    // convex api functions
    const tableData = useQuery(api.admin.getAllLevels);
    const imageSrc = useQuery(api.admin.getImageSrcByLevelId, clickedLevelId ? { id: clickedLevelId } : "skip");

    // sets the image source to default on table data load
    useEffect(() => {
        if (tableData && tableData.length > 0) {
            setClickedLevelId(null);
        }
    }, [tableData]);

    // updates image source state and open dialog id on dialog trigger
    useEffect(() => {
        if (imageSrc) {
            setCurrentSrcUrl(imageSrc);
            setOpenDialogId(clickedLevelId); 
        }
    }, [imageSrc, clickedLevelId]);

    // closes dialog
    const handleDialogClose = () => {
        setCurrentSrcUrl(defaultImageSource);
        setOpenDialogId(null);
    };

    // opens dialog
    const handleDialogOpen = (levelId: Id<"levels">) => {
        setClickedLevelId(levelId);
    };

    // creates image dialog button
    function imageDialogCreator(row: Level) {return (
        <Dialog open={openDialogId === row._id} onOpenChange={(open) => {
            if (!open) {
                handleDialogClose();
            }
        }}>
            <DialogTrigger asChild>
                <Button onClick={() => handleDialogOpen(row._id)}>
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
                    {currentImageSrcUrl === "/Invalid-Image.jpg" ? (
                        <Skeleton className="bg-zinc-400 dark:bg-red-900 w-full aspect-4/3" />
                    ) : (
                        <Image className="w-full" width="300" height="225" src={currentImageSrcUrl} alt={row.title} id={"image-" + row.imageId} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
    }

    // creates cell for image view dialog

    // columns key value pairs for shadcn DataTable component
    const columns: ColumnDef<Level>[] = [
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "_id",
            header: "ID",
            cell: (cell) => {
                return cell.row.original._id;
            }
        },
        {
            accessorKey: "timesPlayed",
            header: "Times Played",
        },
        {
            accessorKey: "imageId",
            header: "Image",
            cell: (cell) => {
                return imageDialogCreator(cell.row.original);
            }
        }
    ]

    return (
        <>
            <DataTable columns={columns} data={tableData || []} />
            {/* <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell>Times Played</TableCell>
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
                                            {currentImageSrcUrl === "/Invalid-Image.jpg" ? (
                                                <Skeleton className="bg-zinc-400 dark:bg-red-900 w-full aspect-4/3" />
                                            ) : (
                                                <Image className="w-full" width="300" height="225" src={currentImageSrcUrl} alt={row.title} id={"image-" + row.imageId} />
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                            <TableCell>{row.latitude}</TableCell>
                            <TableCell>{row.longitude}</TableCell>
                            <TableCell>{row.timesPlayed.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}

        </>
    );
}

export default Levels;