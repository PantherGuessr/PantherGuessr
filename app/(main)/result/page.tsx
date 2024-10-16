"use client";

import { Footer } from "@/components/footer";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Facebook, Home, Instagram, Share, Slack } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";


const ResultPage = () => {
    const { user } = useUser();
    const rounds = 5;

    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                <Card className="w-[350px] shadow-xl">
                    <CardHeader>
                        <CardTitle>Game Results</CardTitle>
                        <CardDescription>View the results of your recent game below.</CardDescription>
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
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <h2 className="font-bold">Round #1</h2>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Distance From Target:</p>
                                <p>{0} ft</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Round Score:</p>
                                <p>+{0}</p>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <h2 className="font-bold">Round #2</h2>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Distance From Target:</p>
                                <p>{0} ft</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Round Score:</p>
                                <p>+{0}</p>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <h2 className="font-bold">Round #3</h2>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Distance From Target:</p>
                                <p>{0} ft</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Round Score:</p>
                                <p>+{0}</p>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <h2 className="font-bold">Round #4</h2>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Distance From Target:</p>
                                <p>{0} ft</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Round Score:</p>
                                <p>+{0}</p>
                            </div>
                        </div>
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <h2 className="font-bold">Round #5</h2>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Distance From Target:</p>
                                <p>{0} ft</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p>Round Score:</p>
                                <p>+{0}</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <h2 className="font-bold">Final Score</h2>
                                <p className="bg-primary text-primary-foreground px-2">0</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Separator />
                        <div className="p-2">
                            <div className="flex flex-row justify-between">
                                <Logo />
                            </div>
                        </div>
                    </CardFooter>
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