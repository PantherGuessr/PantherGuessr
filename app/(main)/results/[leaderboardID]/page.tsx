"use client";

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Download, Gamepad2, Home, Loader2, Share } from "lucide-react";
import Link from "next/link";
import html2canvas from 'html2canvas-pro';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
    params: { 
      leaderboardID: string
    }
}

const ResultPage = ({ params }: Props) => {
  const searchParams = useSearchParams();

  const isFromGame = searchParams.get("fromGame") === "true" ? true : false;

  const leaderboardId = params.leaderboardID;
  const leaderboardEntry = useQuery(api.game.getPersonalLeaderboardEntryById, { id: leaderboardId });
  const [distances, setDistances] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [username, setUsername] = useState<string>("");
  const [oldLevel, setOldLevel] = useState<number>(0);
  const [newLevel, setNewLevel] = useState<number>(0);

  useEffect(() => {
    if(leaderboardEntry) {
      setDistances([Number(leaderboardEntry.round_1_distance), Number(leaderboardEntry.round_2_distance), Number(leaderboardEntry.round_3_distance), Number(leaderboardEntry.round_4_distance), Number(leaderboardEntry.round_5_distance)]);
      setScores([Number(leaderboardEntry.round_1), Number(leaderboardEntry.round_2), Number(leaderboardEntry.round_3), Number(leaderboardEntry.round_4), Number(leaderboardEntry.round_5)]);
      const totalScore = Number(leaderboardEntry.round_1) + Number(leaderboardEntry.round_2) + Number(leaderboardEntry.round_3) + Number(leaderboardEntry.round_4) + Number(leaderboardEntry.round_5);
      setFinalScore(totalScore);
      setUsername(leaderboardEntry.username);
      setOldLevel(Number(leaderboardEntry.oldLevel));
      setNewLevel(Number(leaderboardEntry.newLevel));
    }
  }, [leaderboardEntry]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{ title: string; description: string; imageSrc?: string }>({ title: "", description: "" });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShareClick = async (platform: string) => {
    const canvas = await html2canvas(cardRef.current!, {
      useCORS: true,
      scale: 2,
      logging: true,
      width: cardRef.current!.scrollWidth,
      height: cardRef.current!.scrollHeight + 10,
      backgroundColor: null
    });
    const imageSrc = canvas.toDataURL("image/png");

    let shareUrl = "";
    const text = `Check out my game results! Final Score: ${finalScore}`;

    if (platform === "Facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageSrc)}&quote=${encodeURIComponent(text)}`;
      window.open(shareUrl, "_blank");
    } else if (platform === "Instagram") {
      alert("Instagram sharing is not supported directly. Please download the image and share it manually.");
      window.open(shareUrl, "_blank");
      return;
    } else if (platform === "Slack") {
      shareUrl = `https://slack.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageSrc)}`;
      window.open(shareUrl, "_blank");
    } else {
      setDialogContent({
        title: `Share on ${platform}`,
        description: `Sharing on ${platform} is coming soon!`,
        imageSrc: imageSrc
      });
      setIsDialogOpen(true);
    }
  };

  const handleDownloadClick = () => {
    if(dialogContent.imageSrc) {
      const link = document.createElement('a');
      link.href = dialogContent.imageSrc;
      link.download = 'game-receipt.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (leaderboardEntry === undefined) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      </div>
    );
  }

  if (leaderboardEntry === null) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center text-center px-6 pb-10">
        <h1 className="text-2xl font-bold">Invalid or Expired Results ID</h1>
        <p>Please check the URL or go back to the main menu.</p>
        <Link href="/">
          <Button variant="default" className="mt-4">
            <Home className="mr-2 w-4 h-4" /> Go To Home Page
          </Button>
        </Link>
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
                  <div className="flex flex-row justify-between">
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
        <div className={cn("flex justify-between w-[350px]",
          isFromGame ? "flex-row" : "flex-row-reverse"
        )}>
          <Button onClick={() => handleShareClick("Share")} variant="outline" size="icon"><Share className="h-4 w-4" /></Button>
          <Link href="/">
            <Button variant={isFromGame ? "outline" : "default"}><Home className="h-4 w-4 mr-2" /> Main Menu</Button>
          </Link>
          {isFromGame && (
            <Link href="/game">
              <Button variant="default"><Gamepad2 className="h-4 w-4 mr-2" />New Game</Button>
            </Link>
          )}
          {/* <Button onClick={() => handleShareClick("Instagram")} variant="outline" size="icon"><Instagram className="h-4 w-4" /></Button>
                    <Button onClick={() => handleShareClick("Facebook")} variant="outline" size="icon"><Facebook className="h-4 w-4" /></Button>
                    <Button onClick={() => handleShareClick("Slack")} variant="outline" size="icon"><Slack className="h-4 w-4" /></Button> */}
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
              <Button className="mt-4" onClick={handleDownloadClick}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
    
};
 
export default ResultPage;