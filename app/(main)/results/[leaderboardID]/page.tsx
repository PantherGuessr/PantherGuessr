"use client";

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Download, Home, Loader2, Share } from "lucide-react";
import Link from "next/link";
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

type Props = {
    params: { leaderboardID: Id<"leaderboardEntries"> }
}


const ResultPage = ({ params }: Props) => {

  const leaderboardId = params.leaderboardID as Id<"leaderboardEntries">;
  const leaderboardEntry = useQuery(api.game.getPersonalLeaderboardEntryById, { id: leaderboardId });
  const [distances, setDistances] = useState<number[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if(leaderboardEntry) {
      setDistances([Number(leaderboardEntry.round_1_distance), Number(leaderboardEntry.round_2_distance), Number(leaderboardEntry.round_3_distance), Number(leaderboardEntry.round_4_distance), Number(leaderboardEntry.round_5_distance)]);
      setScores([Number(leaderboardEntry.round_1), Number(leaderboardEntry.round_2), Number(leaderboardEntry.round_3), Number(leaderboardEntry.round_4), Number(leaderboardEntry.round_5)]);
      const totalScore = Number(leaderboardEntry.round_1) + Number(leaderboardEntry.round_2) + Number(leaderboardEntry.round_3) + Number(leaderboardEntry.round_4) + Number(leaderboardEntry.round_5);
      setFinalScore(totalScore);
      setUsername(leaderboardEntry.username);
    }
  }, [leaderboardEntry]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<{ title: string; description: string; imageSrc?: string }>({ title: "", description: "" });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShareClick = async (platform: string) => {
    if (platform === "Instagram" || platform === "Facebook" || platform === "Slack") {
      const canvas = await html2canvas(cardRef.current!, {
        useCORS: true,
        scale: 2,
        logging: true,
        width: cardRef.current!.scrollWidth,
        height: cardRef.current!.scrollHeight + 10
      });
      const imageSrc = canvas.toDataURL("image/png");

      let shareUrl = "";
      const text = `Check out my game results! Final Score: ${finalScore}`;

      if (platform === "Facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageSrc)}&quote=${encodeURIComponent(text)}`;
      } else if (platform === "Instagram") {
        alert("Instagram sharing is not supported directly. Please download the image and share it manually.");
        return;
      } else if (platform === "Slack") {
        shareUrl = `https://slack.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageSrc)}`;
      }

      window.open(shareUrl, "_blank");
    } else {
      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, {
          useCORS: true,
          scale: 2,
          logging: true,
          width: cardRef.current.scrollWidth,
          height: cardRef.current.scrollHeight + 10
        });
        const imageSrc = canvas.toDataURL("image/png");
        setDialogContent({
          title: `Share on ${platform}`,
          description: `Sharing on ${platform} is coming soon!`,
          imageSrc: imageSrc
        });
        setIsDialogOpen(true);
      }
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

  while(leaderboardEntry === undefined) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div ref={cardRef}>
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
                    <p>{0}</p>
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
              <Separator />
              <div className="flex flex-col space-y-4">
                <div className="p-2">
                  <div className="flex flex-row justify-center">
                    <Logo />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-between w-[350px]">
          <Link href="/">
            <Button variant="default"><Home className="h-4 w-4 mr-2" /> Main Menu</Button>
          </Link>
          {/* <Button onClick={() => handleShareClick("Instagram")} variant="outline" size="icon"><Instagram className="h-4 w-4" /></Button>
                    <Button onClick={() => handleShareClick("Facebook")} variant="outline" size="icon"><Facebook className="h-4 w-4" /></Button>
                    <Button onClick={() => handleShareClick("Slack")} variant="outline" size="icon"><Slack className="h-4 w-4" /></Button> */}
          <Button onClick={() => handleShareClick("Share")} variant="outline" size="icon"><Share className="h-4 w-4" /></Button>
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