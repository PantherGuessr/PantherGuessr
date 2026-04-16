"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const REPORT_REASON_LABELS: Record<string, string> = {
  not_university_property: "Not part of the university property",
  pin_incorrectly_placed: "Pin is incorrectly placed",
  wrong_image: "Something is wrong with the image",
  outdated_image: "Outdated image",
};

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
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [openDialogId, setOpenDialogId] = useState<Id<"levels"> | null>(null);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [openMapDialogId, setOpenMapDialogId] = useState<Id<"levels"> | null>(null);
  // necessary to force re-fetching image source when dialog is opened multiple times for the same level
  const [dialogOpenCounter, setDialogOpenCounter] = useState(0);

  // convex api functions
  const tableData = useQuery(api.admin.getAllLevels);
  const imageSrc = useQuery(api.admin.getImageSrcByLevelId, clickedLevelId ? { id: clickedLevelId } : "skip");
  const deleteLevel = useMutation(api.levelcreator.deleteLevelById);
  const levelReports = useQuery(api.reports.getLevelReports);
  const resolveLevelReport = useMutation(api.reports.resolveLevelReport);
  const dismissLevelReport = useMutation(api.reports.dismissLevelReport);

  const pendingReports = levelReports?.filter((r) => r.status === "pending") ?? [];

  // sets the image source to default on table data load
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setClickedLevelId(null);
    }
  }, [tableData]);

  // updates image source state and open dialog id on dialog trigger
  useEffect(() => {
    if (imageSrc && clickedLevelId) {
      setCurrentSrcUrl(imageSrc);
      setOpenDialogId(clickedLevelId);
      setIsImageDialogOpen(true);
    }
  }, [imageSrc, clickedLevelId, dialogOpenCounter]);

  // closes dialog
  const handleDialogClose = () => {
    setCurrentSrcUrl(defaultImageSource);
    setIsImageDialogOpen(false);
    setOpenDialogId(null);
  };

  // opens dialog
  const handleDialogOpen = (levelId: Id<"levels">) => {
    setClickedLevelId(levelId);
    setDialogOpenCounter((prev) => prev + 1); // force state change
  };

  // closes map dialog
  const handleMapDialogClose = () => {
    setLocalMarkerPosition(null);
    setIsMapDialogOpen(false);
    setOpenMapDialogId(null);
  };

  // opens map dialog
  const handleMapDialogOpen = async (levelId: Id<"levels">, latitude: number, longitude: number) => {
    const L = (await import("leaflet")).default;
    const latlng = new L.LatLng(latitude, longitude);
    setLocalMarkerPosition(latlng);
    setOpenMapDialogId(levelId);
    setIsMapDialogOpen(true);
  };

  // creates image dialog button
  function imageDialogCreator(row: Level) {
    return (
      <Dialog
        open={isImageDialogOpen && openDialogId === row._id}
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
              <Skeleton className="aspect-4/3 w-full bg-zinc-400 dark:bg-red-900" />
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
        open={isMapDialogOpen && openMapDialogId === row._id}
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
          <div className="flex h-80 w-full grow py-2">
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
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={column.getIsSorted() ? "font-bold text-primary" : ""}
          >
            Title
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "tags",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={column.getIsSorted() ? "font-bold text-primary" : ""}
          >
            Tags
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (cell) => {
        return cell.row.original.tags ? cell.row.original.tags.join(", ") : "";
      },
    },
    {
      accessorKey: "_creationTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className={column.getIsSorted() ? "font-bold text-primary" : ""}
          >
            Created
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: (cell) => {
        const date = new Date(cell.row.original._creationTime);
        return date.toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
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
              <DropdownMenuItem
                onClick={() => typeof navigator !== "undefined" && navigator.clipboard.writeText(level._id)}
              >
                Copy Level ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => typeof navigator !== "undefined" && navigator.clipboard.writeText(level.imageId)}
              >
                Copy Image ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  typeof navigator !== "undefined" &&
                  navigator.clipboard.writeText("(" + level.latitude + ", " + level.longitude + ")")
                }
              >
                Copy Coordinates
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-500"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this level?")) {
                    setClickedLevelId(null);
                    deleteLevel({ levelId: level._id });
                  }
                }}
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
      {pendingReports.length > 0 && (
        <Card className="mb-6 border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="flex items-center gap-2 text-base text-orange-800 dark:text-orange-300">
              Level Reports
              <Badge variant="destructive" className="text-xs">
                {pendingReports.length} pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {pendingReports.map((report) => (
                <div
                  key={report._id}
                  className="flex flex-col gap-1 rounded-md border border-orange-200 bg-white px-3 py-2 dark:border-orange-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{report.levelTitle}</p>
                    <p className="text-xs text-muted-foreground">{REPORT_REASON_LABELS[report.reason] ?? report.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(report._creationTime).toLocaleString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => dismissLevelReport({ reportId: report._id })}
                    >
                      Dismiss
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => resolveLevelReport({ reportId: report._id })}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <p className="text-start">{tableData?.length || 0} total levels.</p>
      <DataTable
        columns={columns}
        data={tableData || []}
        initialSorting={[{ id: "_creationTime", desc: true }]}
        initialColumnVisibility={{ tags: false, _creationTime: false }}
      />
    </>
  );
};

export default Levels;
