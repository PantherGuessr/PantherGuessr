"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { NotFoundContent } from "@/components/not-found-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import useUserById from "@/hooks/use-user-by-id";
import { cn, isValidConvexId } from "@/lib/utils";
import { computeXPBreakdown } from "@/lib/xp";

type Props = {
  params: Promise<{ leaderboardID: string }>;
};

const ResultPage = ({ params }: Props) => {
  const { data: currentUser } = useCurrentUser();
  const searchParams = useSearchParams();
  const { leaderboardID } = use(params);

  const isValidId = isValidConvexId(leaderboardID);

  const leaderboardEntry = useQuery(
    api.game.getPersonalLeaderboardEntryById,
    isValidId ? { id: leaderboardID } : "skip"
  );
  const user = useUserById(leaderboardEntry?.userId);

  // Derive values from leaderboardEntry during render
  const isFromGame = searchParams.get("fromGame") === "true";
  const distances = leaderboardEntry
    ? [
        Number(leaderboardEntry.round_1_distance),
        Number(leaderboardEntry.round_2_distance),
        Number(leaderboardEntry.round_3_distance),
        Number(leaderboardEntry.round_4_distance),
        Number(leaderboardEntry.round_5_distance),
      ]
    : [];
  const scores = leaderboardEntry
    ? [
        Number(leaderboardEntry.round_1),
        Number(leaderboardEntry.round_2),
        Number(leaderboardEntry.round_3),
        Number(leaderboardEntry.round_4),
        Number(leaderboardEntry.round_5),
      ]
    : [];
  const finalScore = leaderboardEntry
    ? Number(leaderboardEntry.round_1) +
      Number(leaderboardEntry.round_2) +
      Number(leaderboardEntry.round_3) +
      Number(leaderboardEntry.round_4) +
      Number(leaderboardEntry.round_5)
    : 0;
  const username = user?.username ?? "";
  const oldLevel = leaderboardEntry ? Number(leaderboardEntry.oldLevel) : 0;
  const newLevel = leaderboardEntry ? Number(leaderboardEntry.newLevel) : 0;
  const gameType = leaderboardEntry?.gameType ?? "";

  const streak = leaderboardEntry ? Number(leaderboardEntry.streakAtGame ?? 0n) : 0;
  const isFirstGameOfDay = leaderboardEntry?.firstGameOfDay ?? false;
  const xpBreakdown = leaderboardEntry ? computeXPBreakdown(scores, distances, streak, isFirstGameOfDay) : null;

  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{
    title: string;
    description: string;
    imageSrc?: string;
    finalScore?: number;
  }>({ title: "", description: "" });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (isFromGame && leaderboardEntry) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("fromGame");
      window.history.pushState({}, "", newUrl.toString());
    }
  }, [isFromGame, leaderboardEntry]);

  if (!isValidId) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
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

  if (leaderboardEntry === undefined || (leaderboardEntry && !username)) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (leaderboardEntry === null) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-grow flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
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
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
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
                  <div className="flex w-full flex-row items-center justify-center justify-items-center gap-x-2 rounded-md bg-secondary p-2 text-lg">
                    {gameType === "weekly" ? (
                      <Calendar className="h-5 w-5" />
                    ) : gameType === "singleplayer" ? (
                      <User className="h-5 w-5" />
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
                      <p className="flex flex-row items-center justify-center">
                        <span className="flex items-center text-muted-foreground">
                          {oldLevel} <ArrowRight className="mx-1 flex h-4 w-4" />
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
              <div className="p-2">
                <div className="flex flex-row justify-between font-bold">
                  <h2 className="font-bold">Final Score</h2>
                  <p className="bg-primary px-2 text-primary-foreground">{finalScore}</p>
                </div>
              </div>
              <Separator />
              <div className="p-2">
                <div className="flex flex-row justify-between pb-2">
                  <h2 className="font-bold">XP Breakdown</h2>
                </div>
                {xpBreakdown && (
                  <div className="flex flex-col space-y-1 text-sm">
                    <div className="flex flex-row justify-between">
                      <p className="text-muted-foreground">Base</p>
                      <p>+{xpBreakdown.baseXP} XP</p>
                    </div>
                    {xpBreakdown.firstGameOfDayXP > 0 && (
                      <div className="flex flex-row justify-between">
                        <p className="text-muted-foreground">First game of the day</p>
                        <p>+{xpBreakdown.firstGameOfDayXP} XP</p>
                      </div>
                    )}
                    <div className="flex flex-row justify-between">
                      <p className="text-muted-foreground">Score bonus</p>
                      <p>+{xpBreakdown.pointsXP} XP</p>
                    </div>
                    {xpBreakdown.spotOnXP > 0 && (
                      <div className="flex flex-row justify-between">
                        <p className="text-muted-foreground">Spot-on bonus</p>
                        <p>+{xpBreakdown.spotOnXP} XP</p>
                      </div>
                    )}
                    {xpBreakdown.isPerfect && (
                      <div className="flex flex-row justify-between">
                        <p className="text-muted-foreground">Perfect game</p>
                        <p>×2</p>
                      </div>
                    )}
                    {xpBreakdown.streakBonusXP > 0 && (
                      <div className="flex flex-row justify-between">
                        <p className="text-muted-foreground">
                          Streak bonus ({streak}d, {Math.round((xpBreakdown.streakMultiplier - 1) * 100)}% boost)
                        </p>
                        <p>+{xpBreakdown.streakBonusXP} XP</p>
                      </div>
                    )}
                    <div className="flex flex-row justify-between pt-1 text-base font-bold">
                      <p>Total XP Awarded</p>
                      <p className="bg-primary px-2 text-primary-foreground">{xpBreakdown.totalXP} XP</p>
                    </div>
                  </div>
                )}
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
        <div className="flex w-[350px]">
          <Link href={`/results/game/${leaderboardEntry.game.toString()}`} className="w-full">
            <Button className="flex w-full items-center justify-center">
              <ListOrdered className="mr-2 h-4 w-4" /> Game Leaderboard
            </Button>
          </Link>
        </div>
        <div className={cn("flex w-[350px] justify-between gap-2", isFromGame ? "flex-row" : "flex-row-reverse")}>
          <Button onClick={() => handleShareClick()} variant="outline" size="icon" className="aspect-square">
            <Share className="h-4 w-4" />
          </Button>
          <Link href="/" className="w-full">
            <Button className="flex w-full items-center justify-center" variant={isFromGame ? "outline" : "default"}>
              <Home className="mr-2 h-4 w-4" /> Main Menu
            </Button>
          </Link>
          {isFromGame && (
            <Link href="/game">
              <Button variant="default">
                <Gamepad2 className="mr-2 h-4 w-4" />
                New Game
              </Button>
            </Link>
          )}
        </div>
      </div>
      <Footer />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[800px] max-w-[300px]">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>{dialogContent.description}</DialogDescription>
          </DialogHeader>
          {dialogContent.imageSrc && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Image src={dialogContent.imageSrc} width={200} height={100} alt="Game Receipt" />
              <div className="space-x-2">
                <Button size="icon" className="" onClick={handleSocialShareClick}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button className="mt-4" onClick={handleDownloadClick}>
                  <Download className="mr-2 h-4 w-4" /> Download
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
