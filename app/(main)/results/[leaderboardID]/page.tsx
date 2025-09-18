"use client";

import { useQuery } from "convex/react";
import html2canvas from "html2canvas-pro";
import {
  ArrowRight,
  Calendar,
  Download,
  Gamepad2,
  Home,
  ListOrdered,
  Loader2,
  Share,
  Share2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { NotFoundContent } from "@/components/not-found-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { api } from "@/convex/_generated/api";

import { useBanCheck } from "@/hooks/use-ban-check";
import useUserById from "@/hooks/use-user-by-id";

import { cn, isValidConvexId } from "@/lib/utils";

type Props = {
  params: Promise<{ leaderboardID: string }>;
};

const ResultPage = ({ params }: Props) => {
  // All hooks must be called before any return statements
  const currentUser = useQuery(api.users.current);
  const { result: isBanned, isLoading: isBanCheckLoading } = useBanCheck(currentUser?.clerkId);
  const searchParams = useSearchParams();
  const { leaderboardID } = use(params);

  // Validate leaderboardID format
  const isValidId = isValidConvexId(leaderboardID);

  // fetch leaderboard entry or skip if invalid ID
  const leaderboardEntry = useQuery(
    api.game.getPersonalLeaderboardEntryById,
    isValidId ? { id: leaderboardID } : "skip"
  );
  // fetch the user document for this leaderboard entry by userId
  const user = useUserById(leaderboardEntry?.userId);
  const [distances, setDistances] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [gameType, setGameType] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [oldLevel, setOldLevel] = useState<number>(0);
  const [newLevel, setNewLevel] = useState<number>(0);
  const [isFromGame, setIsFromGame] = useState<boolean>(false);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    description: string;
    imageSrc?: string;
    finalScore?: number;
  }>({ title: "", description: "" });
  const cardRef = useRef<HTMLDivElement>(null);

  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    if (searchParams.get("fromGame") === "true") {
      setIsFromGame(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);

  useEffect(() => {
    if (leaderboardEntry) {
      setDistances([
        Number(leaderboardEntry.round_1_distance),
        Number(leaderboardEntry.round_2_distance),
        Number(leaderboardEntry.round_3_distance),
        Number(leaderboardEntry.round_4_distance),
        Number(leaderboardEntry.round_5_distance),
      ]);
      setScores([
        Number(leaderboardEntry.round_1),
        Number(leaderboardEntry.round_2),
        Number(leaderboardEntry.round_3),
        Number(leaderboardEntry.round_4),
        Number(leaderboardEntry.round_5),
      ]);
      const totalScore =
        Number(leaderboardEntry.round_1) +
        Number(leaderboardEntry.round_2) +
        Number(leaderboardEntry.round_3) +
        Number(leaderboardEntry.round_4) +
        Number(leaderboardEntry.round_5);
      setFinalScore(totalScore);
      // prefer fetching username from the user document referenced by userId
      setUsername(user?.username ?? "");
      setOldLevel(Number(leaderboardEntry.oldLevel));
      setNewLevel(Number(leaderboardEntry.newLevel));
      setGameType(leaderboardEntry.gameType);
    }
  }, [leaderboardEntry, user]);

  useEffect(() => {
    if (isFromGame && leaderboardEntry) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("fromGame");
      window.history.pushState({}, "", newUrl.toString());
    }
  }, [isFromGame, leaderboardEntry]);

  // Handle validation errors after all hooks are called
  if (!isValidId) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <NotFoundContent
            title="Invalid Results ID"
            description="The results ID you provided is not valid. Please check the URL and try again."
          />
        </div>
        <Footer />
      </div>
    );
  }

  const handleShareClick = async () => {
    const canvas = await html2canvas(cardRef.current!, {
      useCORS: true,
      scale: 2,
      logging: true,
      width: cardRef.current!.scrollWidth,
      height: cardRef.current!.scrollHeight + 10,
      backgroundColor: null,
    });
    const imageSrc = canvas.toDataURL("image/png");

    setDialogContent({
      title: `Share Your Results`,
      description: `Share your game results receipt on any social platforms.`,
      imageSrc: imageSrc,
      finalScore: finalScore,
    });

    setIsDialogOpen(true);
  };

  const handleDownloadClick = () => {
    if (dialogContent.imageSrc) {
      const link = document.createElement("a");
      link.href = dialogContent.imageSrc;
      link.download = "game-receipt.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSocialShareClick = async () => {
    if (dialogContent.imageSrc) {
      const imageBlob = await fetch(dialogContent.imageSrc).then((r) => r.blob());
      const filesArr = [
        new File([imageBlob], "game-results.png", {
          type: "image/png",
          lastModified: new Date().getTime(),
        }),
      ];

      const webShareData = {
        files: filesArr,
        url: new URL(location.pathname, location.origin).href,
        text: `Check out my game results on #PantherGuessr! My final score was ${finalScore}/1250!`,
      };

      try {
        if (navigator.canShare(webShareData)) {
          await navigator.share(webShareData);
        }
      } catch {
        console.error("There was an error sharing game results!");
      }
    }
  };

  if (leaderboardEntry === undefined || isBanCheckLoading || (leaderboardEntry && !username)) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (leaderboardEntry === null) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <NotFoundContent
            title="Results Not Found"
            description="The game results you're looking for don't exist or have been removed."
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div ref={cardRef} className="bg-transparent">
          <Card className="w-[350px] shadow-xl">
            <CardHeader className="mt-4">
              <CardTitle>Game Results</CardTitle>
              <CardDescription>View the results of your recent game below.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <Separator />
              <div className="flex flex-col space-y-4">
                <div className="p-2">
                  <div className="text-lg flex flex-row bg-secondary justify-items-center justify-center items-center p-2 w-full rounded-md gap-x-2">
                    {gameType === "weekly" ? (
                      <Calendar className="w-5 h-5" />
                    ) : gameType === "singleplayer" ? (
                      <User className="w-5 h-5" />
                    ) : null}
                    <div className="">
                      {gameType === "weekly" ? "Weekly Challenge" : gameType === "singleplayer" ? "Singleplayer" : null}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-4">
                <div className="p-2">
                  <div className="flex flex-row justify-between pb-2">
                    <h2 className="font-bold">Guessr Information</h2>
                  </div>
                  <div className="flex flex-row justify-between">
                    <h2>Player:</h2>
                    <p>{username}</p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <h2>Level:</h2>
                    {oldLevel === newLevel ? (
                      <p>{oldLevel}</p>
                    ) : (
                      <p className="flex flex-row justify-center items-center">
                        <span className="text-muted-foreground flex items-center">
                          {oldLevel} <ArrowRight className="flex w-4 h-4 mx-1" />
                        </span>
                        {newLevel}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              {distances.map((distance: number, index: number) => (
                <div key={index} className="p-2">
                  <div className="flex flex-row justify-between">
                    <h2 className="font-bold">Round #{index + 1}</h2>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p>Distance From Target:</p>
                    <p>{distance} ft</p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <p>Round Score:</p>
                    <p>+{scores[index]}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="p-2">
                <div className="flex flex-row justify-between">
                  <h2 className="font-bold">Final Score</h2>
                  <p className="bg-primary text-primary-foreground px-2">{finalScore}</p>
                </div>
              </div>
              <div className="p-2">
                <div className="flex flex-row justify-between">
                  <h2 className="font-bold">XP Awarded</h2>
                  <p className="bg-primary text-primary-foreground px-2">{leaderboardEntry?.xpGained || 0}</p>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col space-y-4">
                <div className="p-2">
                  <div className="flex flex-row justify-center">
                    <Logo as_png={true} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-[350px] flex">
          <Link href={`/results/game/${leaderboardEntry.game.toString()}`} className="w-full">
            <Button className="w-full flex justify-center items-center">
              <ListOrdered className="h-4 w-4 mr-2" /> Game Leaderboard
            </Button>
          </Link>
        </div>
        <div className={cn("flex justify-between w-[350px] gap-2", isFromGame ? "flex-row" : "flex-row-reverse")}>
          <Button onClick={() => handleShareClick()} variant="outline" size="icon" className="aspect-square">
            <Share className="h-4 w-4" />
          </Button>
          <Link href="/" className="w-full">
            <Button className="w-full flex justify-center items-center" variant={isFromGame ? "outline" : "default"}>
              <Home className="h-4 w-4 mr-2" /> Main Menu
            </Button>
          </Link>
          {isFromGame && (
            <Link href="/game">
              <Button variant="default">
                <Gamepad2 className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Footer />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[300px] max-h-[800px]">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          {dialogContent.imageSrc && (
            <div className="flex flex-col justify-center items-center space-y-2">
              <Image src={dialogContent.imageSrc} width={200} height={100} alt="Game Receipt" />
              <div className="space-x-2">
                <Button size="icon" className="" onClick={handleSocialShareClick}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button className="mt-4" onClick={handleDownloadClick}>
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultPage;
