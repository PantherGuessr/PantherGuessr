import { DialogTitle } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { LatLng } from "leaflet";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import useUpcomingWeeklyChallenge from "@/hooks/use-upcoming-weekly-challenge";
import useWeeklyChallenge from "@/hooks/use-weekly-challenge";

import { isValidConvexId } from "@/lib/utils";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [openEditDialogId, setOpenEditDialogId] = useState<Id<"levels"> | null>(null);
  const [editLevelId, setEditLevelId] = useState<string>("");
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [editingChallengeId, setEditingChallengeId] = useState<Id<"weeklyChallenges"> | null>(null);
  const [activeTab, setActiveTab] = useState<"current" | "upcoming">("current");
  const [weeklyChallengeStartDate, setWeeklyChallengeStartDate] = useState<string>("");
  const [weeklyChallengeEndDate, setWeeklyChallengeEndDate] = useState<string>("");
  const [upcomingChallengeStartDate, setUpcomingChallengeStartDate] = useState<string>("");
  const [upcomingChallengeEndDate, setUpcomingChallengeEndDate] = useState<string>("");

  // fetch weekly challenge data
  const weeklyChallenge = useWeeklyChallenge();
  const upcomingWeeklyChallenge = useUpcomingWeeklyChallenge();

  // mutation for updating weekly challenge round
  const updateWeeklyChallengeRound = useMutation(api.weeklychallenge.updateWeeklyChallengeRound);
  const { toast } = useToast();

  // fetch image source
  const imageSrc = useQuery(api.admin.getImageSrcByLevelId, clickedLevelId ? { id: clickedLevelId } : "skip");

  // memoize table data for current week
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

  // memoize table data for upcoming week
  const upcomingTableData = useMemo(() => {
    if (upcomingWeeklyChallenge) {
      setUpcomingChallengeStartDate(new Date(Number(upcomingWeeklyChallenge.startDate)).toLocaleDateString());
      setUpcomingChallengeEndDate(new Date(Number(upcomingWeeklyChallenge.endDate)).toLocaleDateString());
      return [
        upcomingWeeklyChallenge.game.round_1,
        upcomingWeeklyChallenge.game.round_2,
        upcomingWeeklyChallenge.game.round_3,
        upcomingWeeklyChallenge.game.round_4,
        upcomingWeeklyChallenge.game.round_5,
      ];
    }
    return [];
  }, [upcomingWeeklyChallenge]);

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

  // closes edit dialog
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setOpenEditDialogId(null);
    setEditLevelId("");
    setEditingRound(null);
    setEditingChallengeId(null);
  };

  // opens edit dialog
  const handleEditDialogOpen = (levelId: Id<"levels">, roundNumber: number, challengeId: Id<"weeklyChallenges">) => {
    setOpenEditDialogId(levelId);
    setEditLevelId("");
    setEditingRound(roundNumber);
    setEditingChallengeId(challengeId);
    setIsEditDialogOpen(true);
  };

  // handles saving the edited level
  const handleSaveEditedLevel = async () => {
    if (!editLevelId || !editingRound || !editingChallengeId) {
      toast({
        title: "Error",
        description: "Please enter a valid level ID",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for Convex ID format (starts with a table prefix)
    if (!editLevelId.trim()) {
      toast({
        title: "Error",
        description: "Level ID cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check if it looks like a Convex ID (basic format check)
    if (!isValidConvexId(editLevelId.trim())) {
      toast({
        title: "Invalid Level ID Format",
        description: "The level ID format is invalid. It should look like 'k17abc123def456' or similar.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateWeeklyChallengeRound({
        weeklyChallengeId: editingChallengeId,
        roundNumber: editingRound,
        newLevelId: editLevelId.trim() as Id<"levels">,
      });

      toast({
        title: "Success",
        description: `Round ${editingRound} updated successfully!`,
      });

      handleEditDialogClose();
    } catch (error) {

      toast({
        title: "Error",
        description: "Failed to update level. Check the level ID and try again.",
        variant: "destructive",
      });
    }
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
  const createColumns = (challengeId: Id<"weeklyChallenges"> | null): ColumnDef<Level | null>[] => [
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
        const roundNumber = row.index + 1;
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
                <DropdownMenuItem
                  onClick={() => typeof navigator !== "undefined" && navigator.clipboard.writeText(level?._id ?? "")}
                >
                  Copy Level ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    typeof navigator !== "undefined" && navigator.clipboard.writeText(level?.imageId ?? "")
                  }
                >
                  Copy Image ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    typeof navigator !== "undefined" &&
                    navigator.clipboard.writeText("(" + (level?.latitude ?? 0) + ", " + (level?.longitude ?? 0) + ")")
                  }
                >
                  Copy Coordinates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    if (level && challengeId) {
                      handleEditDialogOpen(level._id, roundNumber, challengeId);
                    }
                  }}
                >
                  Edit Level ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  // Get the current level being edited for display in the dialog
  const currentEditingLevel = useMemo(() => {
    if (!openEditDialogId) return null;
    const allLevels = [...tableData, ...upcomingTableData];
    return allLevels.find(level => level?._id === openEditDialogId) || null;
  }, [openEditDialogId, tableData, upcomingTableData]);

  return (
    <>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleEditDialogClose();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Level for Round {editingRound}</DialogTitle>
            <DialogDescription>
              Current Level: {currentEditingLevel?.title ?? "Loading..."} ({openEditDialogId})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="levelId">
                New Level ID
              </Label>
              <Input
                id="levelId"
                value={editLevelId}
                onChange={(e) => setEditLevelId(e.target.value)}
                placeholder="Paste level ID here..."
                className="font-mono text-sm"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use &quot;Copy Level ID&quot; from another level&apos;s menu
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleEditDialogClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedLevel} disabled={!editLevelId.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="current" className="w-full" onValueChange={(value) => setActiveTab(value as "current" | "upcoming")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Week</TabsTrigger>
          <TabsTrigger value="upcoming">Next Week (Preview)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-2">
          <p className="text-lg text-left justify-start w-full px-2 mb-1">
            <span className="font-bold">{weeklyChallengeStartDate}</span> -{" "}
            <span className="font-bold">{weeklyChallengeEndDate}</span>
          </p>
          <DataTable columns={createColumns(weeklyChallenge?._id ?? null)} data={tableData || []} />
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-2">
          <p className="text-lg text-left justify-start w-full px-2 mb-1">
            <span className="font-bold">{upcomingChallengeStartDate}</span> -{" "}
            <span className="font-bold">{upcomingChallengeEndDate}</span>
          </p>
          <DataTable columns={createColumns(upcomingWeeklyChallenge?._id ?? null)} data={upcomingTableData || []} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default WeeklyChallengeConfig;
