"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DataTable } from "./_helpers/datatable";
import DynamicPreviewMap from "./_helpers/dynamic-preview-map";
import { useMarker } from "./_helpers/MarkerContext";

type Level = {
  _id: Id<"levels">;
  _creationTime: number;
  title: string;
  latitude: number;
  longitude: number;
  imageId: string;
  timesPlayed: bigint;
  tags?: string[];
};

const Levels = () => {
  // get marker context positions
  const { setLocalMarkerPosition } = useMarker();

  const defaultImageSource = "/Invalid-Image.jpg";

  // accessors and mutators for states
  const [clickedLevelId, setClickedLevelId] = useState<Id<"levels"> | null>(null);
  const [currentImageSrcUrl, setCurrentSrcUrl] = useState(defaultImageSource);
  const [openDialogId, setOpenDialogId] = useState<Id<"levels"> | null>(null);
  const [openMapDialogId, setOpenMapDialogId] = useState<Id<"levels"> | null>(null);

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

  // closes map dialog
  const handleMapDialogClose = () => {
    setLocalMarkerPosition(null);
    setOpenMapDialogId(null);
  };

  // opens map dialog
  const handleMapDialogOpen = async (levelId: Id<"levels">, latitude: number, longitude: number) => {
    const L = (await import("leaflet")).default;
    const latlng = new L.LatLng(latitude, longitude);
    setLocalMarkerPosition(latlng);
    setOpenMapDialogId(levelId);
  };

  // creates image dialog button
  function imageDialogCreator(row: Level) {
    return (
      <Dialog
        open={openDialogId === row._id}
        onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => handleDialogOpen(row._id)} className="my-0 py-0" variant="outline">
            View
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{row.title}</DialogTitle>
            <DialogDescription>Image ID: {row.imageId}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {currentImageSrcUrl === "/Invalid-Image.jpg" ? (
              <Skeleton className="bg-zinc-400 dark:bg-red-900 w-full aspect-4/3" />
            ) : (
              <Image
                className="w-full"
                width="300"
                height="225"
                src={currentImageSrcUrl}
                alt={row.title}
                id={"image-" + row.imageId}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  function mapDialogCreator(row: Level) {
    return (
      <Dialog
        open={openMapDialogId === row._id}
        onOpenChange={(open) => {
          if (!open) {
            handleMapDialogClose();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={() => handleMapDialogOpen(row._id, row.latitude, row.longitude)} variant="outline">
            View
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{row.title}</DialogTitle>
            <DialogDescription>
              (Latitude: {row.latitude}, Longitude: {row.longitude})
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full h-80 grow py-2">
            <DynamicPreviewMap />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // columns key value pairs for shadcn DataTable component
  const columns: ColumnDef<Level>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "tags",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tags
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: (cell) => {
        return cell.row.original.tags ? cell.row.original.tags.join(", ") : "";
      },
    },
    {
      accessorKey: "timesPlayed",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Times Played
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "imageId",
      header: "Image",
      cell: (cell) => {
        return imageDialogCreator(cell.row.original);
      },
    },
    {
      header: "Map",
      cell: (cell) => {
        return mapDialogCreator(cell.row.original);
      },
    },
    {
      accessorKey: "_id",
      header: "Actions",
      cell: ({ row }) => {
        const level = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(level._id)}>
                Copy Level ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(level.imageId)}>
                Copy Image ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText("(" + level.latitude + ", " + level.longitude + ")")}
              >
                Copy Coordinates
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-500"
                onClick={() => alert("Sorry, delete level action not implemented yet.")}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={tableData || []} />
    </>
  );
};

export default Levels;
