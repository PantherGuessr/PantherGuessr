import { DialogTitle } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { LatLng } from "leaflet";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
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

import useWeeklyChallenge from "@/hooks/use-weekly-challenge";

import { useMarker } from "../_levels/_helpers/MarkerContext";
import PreviewMap from "../_levels/_helpers/preview-map";
import { DataTable } from "./helpers/datatable";

type Level = {
  _id: Id<"levels">;
  _creationTime: number;
  title: string;
  latitude: number;
  longitude: number;
  imageId: string;
  timesPlayed: bigint;
  authorUsername?: string;
};

const WeeklyChallengeConfig = () => {
  // get marker context positions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { localMarkerPosition, setLocalMarkerPosition } = useMarker();

  const defaultImageSource = "/Invalid-Image.jpg";

  // accessors and mutators for states
  const [clickedLevelId, setClickedLevelId] = useState<Id<"levels"> | null>(null);
  const [currentImageSrcUrl, setCurrentSrcUrl] = useState(defaultImageSource);
  const [openDialogId, setOpenDialogId] = useState<Id<"levels"> | null>(null);
  const [openMapDialogId, setOpenMapDialogId] = useState<Id<"levels"> | null>(null);
  const [weeklyChallengeStartDate, setWeeklyChallengeStartDate] = useState<string>("");
  const [weeklyChallengeEndDate, setWeeklyChallengeEndDate] = useState<string>("");

  // fetch weekly challenge data
  const weeklyChallenge = useWeeklyChallenge();

  // TODO: add an option to reroll weekly challenge

  // fetch image source
  const imageSrc = useQuery(api.admin.getImageSrcByLevelId, clickedLevelId ? { id: clickedLevelId } : "skip");

  // memoize table data
  const tableData = useMemo(() => {
    if (weeklyChallenge) {
      setWeeklyChallengeStartDate(new Date(Number(weeklyChallenge.startDate)).toLocaleDateString());
      setWeeklyChallengeEndDate(new Date(Number(weeklyChallenge.endDate)).toLocaleDateString());
      return [
        weeklyChallenge.game.round_1,
        weeklyChallenge.game.round_2,
        weeklyChallenge.game.round_3,
        weeklyChallenge.game.round_4,
        weeklyChallenge.game.round_5,
      ];
    }
    return [];
  }, [weeklyChallenge]);

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
  const handleMapDialogOpen = (levelId: Id<"levels">, latitude: number, longitude: number) => {
    console.log("handleMapDialogOpen called with:", { levelId, latitude, longitude });
    const latlng = new LatLng(latitude, longitude);
    setLocalMarkerPosition(latlng);
    setOpenMapDialogId(levelId);
  };

  // creates image dialog button
  function imageDialogCreator(row: Level | null) {
    if (!row) return null;

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

  function mapDialogCreator(row: Level | null) {
    if (!row) return null;

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
            <PreviewMap />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // columns key value pairs for shadcn DataTable component
  const columns: ColumnDef<Level | null>[] = [
    {
      header: "Round #",
      cell: (cell) => {
        return cell.row.index + 1;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "authorEmail",
      header: "Author",
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
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(level?._id ?? "")}>
                  Copy Level ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(level?.imageId ?? "")}>
                  Copy Image ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText("(" + (level?.latitude ?? 0) + ", " + (level?.longitude ?? 0) + ")")
                  }
                >
                  Copy Coordinates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <>
      <p className="text-lg text-left justify-start w-full px-2 mb-1">
        <span className="font-bold">{weeklyChallengeStartDate}</span> -{" "}
        <span className="font-bold">{weeklyChallengeEndDate}</span>
      </p>
      <DataTable columns={columns} data={tableData || []} />
    </>
  );
};

export default WeeklyChallengeConfig;
