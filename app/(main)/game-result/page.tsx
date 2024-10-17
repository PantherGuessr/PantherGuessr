"use client";

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Download, Facebook, Home, Instagram, Share, Slack } from "lucide-react";
import Link from "next/link";
import { redirect, useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas';
import { useRef, useState } from "react";
import Image from "next/image";


const ResultPage = () => {
    const searchParams = useSearchParams();

    const distances = JSON.parse(searchParams.get('distances') as string);
    const scores = JSON.parse(searchParams.get('scores') as string);
    const finalScore = Number(searchParams.get('finalScore') as string);
    const username = String(searchParams.get('username'));

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState<{ title: string; description: string; imageSrc?: string }>({ title: "", description: "" });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleShareClick = async (platform: string) => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2,
                logging: true,
                width: cardRef.current.scrollWidth,
                height: (cardRef.current.scrollHeight + 10)
            });
            const imageSrc = canvas.toDataURL("image/png");
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
    
    // if they are don't arrive at url with search parameters attached, kick them back to home
    if(!distances || !scores || !finalScore || !username) {
        return redirect("/");
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
                    <Button onClick={() => handleShareClick("Instagram")} variant="outline" size="icon"><Instagram className="h-4 w-4" /></Button>
                    <Button onClick={() => handleShareClick("Facebook")} variant="outline" size="icon"><Facebook className="h-4 w-4" /></Button>
                    <Button onClick={() => handleShareClick("Slack")} variant="outline" size="icon"><Slack className="h-4 w-4" /></Button>
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
    )
    
}
 
export default ResultPage;