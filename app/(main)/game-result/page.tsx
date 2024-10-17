"use client";

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Home, Instagram, Share, Slack } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from 'next/navigation';


const ResultPage = () => {
    const { user } = useUser();
    const searchParams = useSearchParams();

    const distances = searchParams.get('distances') ? JSON.parse(searchParams.get('distances') as string) : [];
    const scores = searchParams.get('scores') ? JSON.parse(searchParams.get('scores') as string) : [];
    const finalScore = searchParams.get('finalScore') ? Number(searchParams.get('finalScore') as string) : 0;

    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
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
                                    <p>{user?.username}</p>
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
                <div className="flex justify-between w-[350px]">
                    <Link href="/">
                        <Button variant="default"><Home className="h-4 w-4 mr-2" /> Main Menu</Button>
                    </Link>
                    <Link href="" onClick={() => alert("SHARE RECEIPT COMING SOON")}>
                        <Button variant="outline" size="icon"><Instagram className="h-4 w-4" /></Button>
                    </Link>
                    <Link href="" onClick={() => alert("SHARE RECEIPT COMING SOON")}>
                        <Button variant="outline" size="icon"><Facebook className="h-4 w-4" /></Button>
                    </Link>
                    <Link href="" onClick={() => alert("SHARE RECEIPT COMING SOON")}>
                        <Button variant="outline" size="icon"><Slack className="h-4 w-4" /></Button>
                    </Link>
                    <Link href="" onClick={() => alert("SHARE RECEIPT COMING SOON")}>
                        <Button variant="outline" size="icon"><Share className="h-4 w-4" /></Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default ResultPage;