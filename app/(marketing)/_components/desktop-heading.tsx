import { WelcomeMessage } from "@/components/text/welcomemessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface DesktopHeadingProps {
    username: string;
}

const DesktopHeading: React.FC<DesktopHeadingProps> = ({username}) => {


    const [hoveredLeftMain, setHoveredLeftMain] = useState(false);
    const [hoveredCenterMain, setHoveredCenterMain] = useState(false);
    const [hoveredRightMain, setHoveredRightMain] = useState(false);

    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        setWelcomeMessage(WelcomeMessage());
    }, [WelcomeMessage]);

    const isLargeDesktop = useMediaQuery("(min-width: 1000px)");


    if (isLargeDesktop) {
        return ( <div className="flex flex-row justify-center items-center lg:gap-x-10 sm:gap-x-5 mt-20 px-20">
            <div className={
                    cn("flex flex-col justify-between h-full items-center basis-1/3 transition-all drop-shadow-lg",
                        hoveredLeftMain ? "skew-y-0 translate-x-0 scale-100" : "-skew-y-3 -translate-x-4 scale-90"
                    )}
                    onMouseEnter={() => setHoveredLeftMain(true)} onMouseLeave={() => setHoveredLeftMain(false)}>
                <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col transition-all justify-center items-center drop-shadow-lg rounded-lg bg-gradient-to-b from-transparent to-primary/50 mb-6 hover:scale-105 cursor-default">
                <Image src="/profile-banner-images/chapmanpantherwaving.gif"
                    className="rounded-lg transition-all border-primary border-4"
                    alt="Chapman Panther Waving" width={400} height={400} />
                </div>
                <h1 className="text-3xl sm:text-3xl md:text-3xl font-bold hover:scale-105 transition-all cursor-default">
                    Welcome back, <span className="underline">{username}</span>. {welcomeMessage}
                </h1>
                </div>
                <div className={"w-72 h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
            </div>
            <div className={cn("flex flex-col justify-between items-center basis-1/3 transition-all h-full",
                hoveredCenterMain ? "" : "-translate-y-8 scale-90"
            )}
            onMouseEnter={() => setHoveredCenterMain(true)} onMouseLeave={() => setHoveredCenterMain(false)}
            >
            <ul className={
                cn("grid grid-rows-8 p-2 grid-flow-col gap-2 w-full duration-150 transition-all drop-shadow-lg")
            }>
                    <li className="row-span-2 w-full">
                        <Link href="/play">
                            <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                Weekly Challenge
                            </div>
                        </Link>
                    </li>
                    <li className="row-span-2 w-full">
                        <Link href="/game">
                            <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                Singleplayer
                            </div>
                        </Link>
                    </li>
                    <li className="row-span-2 w-full">
                        <Link href="/play">
                            <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                Multiplayer
                            </div>
                        </Link>
                    </li>
                    <li className="row-span-2 w-full">
                        <Link href="/play">
                            <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md">
                                All Gamemodes
                            </div>
                        </Link>
                    </li>
                </ul>
                <div className={cn("w-72 h-4 rounded-[50%] blur-lg transition-all",
                    hoveredCenterMain ? "mt-16 bg-black/20" : "mt-16 bg-black/30"
                )}></div>
            </div>
            <div className={
                    cn("flex flex-col justify-between h-full items-center basis-1/3 transition-all",
                        hoveredRightMain ? "skew-y-0 translate-x-0 scale-100" : "skew-y-3 translate-x-4 scale-90")}
                    onMouseEnter={() => setHoveredRightMain(true)} onMouseLeave={() => setHoveredRightMain(false)}
                        >
                <Card className="w-full dropshadow-lg cursor-default">
                    <CardHeader>
                        <CardTitle className="mb-2">
                            Last Active Friends
                        </CardTitle>
                        <CardContent className="flex flex-col gap-y-2">
                            <Separator />
                            <div className="flex flex-row items-center justify-between hover:scale-105 transition-all">
                                <div className="flex flex-row items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">dylan</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">1m ago</h2>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between hover:scale-105 transition-all">
                                <div className="flex flex-row items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">jake</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">5m ago</h2>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between hover:scale-105 transition-all">
                                <div className="flex flex-row items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">dan</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">16m ago</h2>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between hover:scale-105 transition-all">
                                <div className="flex flex-row items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">pete</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">2h ago</h2>
                            </div>
                        </CardContent>
                    </CardHeader>

                </Card>
                <div className={"w-72 h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
            </div>
        </div> );}
 else {
    return ( <div className="flex flex-row justify-center gap-x-6 mt-20 px-12 w-full">
    <div className={
            cn("flex flex-col justify-between h-full items-center basis-1/2 transition-all drop-shadow-lg",
                hoveredLeftMain ? "skew-y-0 translate-x-0 scale-100" : "-skew-y-3 -translate-x-4 scale-90"
            )}
            onMouseEnter={() => setHoveredLeftMain(true)} onMouseLeave={() => setHoveredLeftMain(false)}
            >
        <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col transition-all justify-center items-center drop-shadow-lg rounded-lg bg-gradient-to-b from-transparent to-primary/50 mb-6 cursor-default hover:scale-105">
        <Image src="/profile-banner-images/chapmanpantherwaving.gif"
            className="rounded-lg transition-all border-primary border-4"
            alt="Chapman Panther Waving" width={400} height={400} />
        </div>
        <h1 className="text-3xl sm:text-3xl md:text-3xl font-bold cursor-default hover:scale-105 transition-all">
            Welcome back, <span className="underline">{username}</span>. {welcomeMessage}
        </h1>
        </div>
        <div className={"w-72 h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
    </div>
    <div className={cn("flex flex-col justify-between items-center basis-1/2 transition-all h-full",
        hoveredRightMain ? "skew-y-0 translate-x-0 scale-100" : "skew-y-3 translate-x-4 scale-90"
    )}
    onMouseEnter={() => setHoveredRightMain(true)} onMouseLeave={() => setHoveredRightMain(false)}
    >
    <ul className={
        cn("grid grid-rows-8 p-2 grid-flow-col gap-2 w-full duration-150 transition-all drop-shadow-lg")
    }>
            <li className="row-span-2 w-full">
                <Link href="/play">
                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                        Weekly Challenge
                    </div>
                </Link>
            </li>
            <li className="row-span-2 w-full">
                <Link href="/game">
                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                        Singleplayer
                    </div>
                </Link>
            </li>
            <li className="row-span-2 w-full">
                <Link href="/play">
                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                        Multiplayer
                    </div>
                </Link>
            </li>
            <li className="row-span-2 w-full">
                <Link href="/play">
                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md">
                        All Gamemodes
                    </div>
                </Link>
            </li>
        </ul>
        <div className={"w-72 h-4 mt-20 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
    </div>
</div>
    );
 }
}
 
export default DesktopHeading;