import { WelcomeMessage } from "@/components/text/welcomemessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface DesktopHeadingProps {
    username: string;
    picture: string;
    tagline: string;
    joinDate: number;
    isChapmanStudent: boolean;
    isDeveloperRole: boolean;
    isModeratorRole: boolean;
    isFriendRole: boolean;
}

const DesktopHeading: React.FC<DesktopHeadingProps> = ({username, picture, tagline, joinDate, isChapmanStudent, isDeveloperRole, isModeratorRole, isFriendRole}) => {
    const [hoveredLeftMain, setHoveredLeftMain] = useState(false);
    const [hoveredCenterMain, setHoveredCenterMain] = useState(false);
    const [hoveredRightMain, setHoveredRightMain] = useState(false);

    const [welcomeMessage, setWelcomeMessage] = useState('');

    useEffect(() => {
        setWelcomeMessage(WelcomeMessage());
    }, []);

    const isLargeDesktop = useMediaQuery("(min-width: 1024px)");

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
                    alt="Chapman Panther Waving" width={400} height={225} />
                </div>
                <h1 className="text-3xl sm:text-3xl md:text-3xl font-bold hover:scale-105 transition-all cursor-default">
                    Welcome back, <Link href={"/profile/" + username}><span className="underline">{username}</span></Link>. {welcomeMessage}
                </h1>
                </div>
                <div className={"w-[90%] h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
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
                            <div className="gap-x-2 flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                Weekly Challenge
                            </div>
                        </Link>
                    </li>
                    <li className="row-span-2 w-full">
                        <Link href="/game">
                            <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                Singleplayer
                            </div>
                        </Link>
                    </li>
                    <li className="row-span-2 w-full">
                        <Link href="/play">
                            <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                                Multiplayer
                            </div>
                        </Link>
                    </li>
                    <li className="row-span-2 w-full">
                        <Link href="/play">
                            <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md">
                                All Gamemodes
                            </div>
                        </Link>
                    </li>
                </ul>
                <div className={cn("w-[90%] h-4 rounded-[50%] blur-lg transition-all",
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
                                    <AvatarImage src="https://github.com/dylandevelops.png" alt="@dylandevelops" />
                                    <AvatarFallback>DR</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">dylan</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">1m ago</h2>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between hover:scale-105 transition-all">
                                <div className="flex flex-row items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/ssparkpilot.png" alt="@ssparkpilot" />
                                    <AvatarFallback>JM</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">jake</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">5m ago</h2>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-between hover:scale-105 transition-all">
                                <div className="flex flex-row items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/dtsivkovski.png" alt="@dtsivkovski" />
                                    <AvatarFallback>DT</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-bold">dan</h3>
                                </div>
                                <h2 className="text-sm font-bold text-muted-foreground">11h ago</h2>
                            </div>
                            <Separator />
                            <div className="flex flex-row items-center justify-center hover:scale-105 transition-all">
                                <Link href="/">
                                <p className="text-md font-bold text-primary pt-1">View More...</p>
                                </Link>
                            </div>
                        </CardContent>
                    </CardHeader>

                </Card>
                <div className={"w-[90%] h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
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
            Welcome back, {" "}
            <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                    <Link href={"/profile/" + username}>
                        <span className="underline">{username}</span>
                    </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                    <div className="flex space-x-4">
                        <Avatar>
                            <AvatarImage src={picture} />
                            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 text-left">
                            <div className="flex md:flex-row flex-col items-center md:items-start">
                                <div className="flex flex-row items-center">
                                    <h4 className="text-sm font-semibold">@{username}</h4>
                                    <div className="flex flex-row items-center gap-x-2 pl-2">
                                        {isDeveloperRole && (
                                            <Image draggable={false} className="select-none cursor-default" src="/badges/developer_badge.svg" width="15" height="15" alt="Developer Badge" />
                                        )}
                                        {isModeratorRole && (
                                            <Image draggable={false} className="select-none cursor-default" src="/badges/moderator_badge.svg" width="15" height="15" alt="Moderator Badge" />
                                        )}
                                        {isFriendRole && (
                                            <Image draggable={false} className="select-none cursor-default" src="/badges/friend_badge.svg" alt="Friend Badge" width="15" height="15" />
                                        )}
                                        {isChapmanStudent && (
                                            <Image draggable={false} className="select-none cursor-default" src="/badges/chapman_badge.svg" alt="Chapman Student Badge" width="15" height="15" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground italic">{tagline}</p>
                            <div className="flex items-center pt-2">
                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                    Joined {new Date(joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>.
            {" " + welcomeMessage}
        </h1>
    </div>
    <div className={"w-[90%] h-4 mt-12 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
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
                    <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                        Weekly Challenge
                    </div>
                </Link>
            </li>
            <li className="row-span-2 w-full">
                <Link href="/game">
                    <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                        Singleplayer
                    </div>
                </Link>
            </li>
            <li className="row-span-2 w-full">
                <Link href="/play">
                    <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-primary text-primary-foreground rounded-md">
                        Multiplayer
                    </div>
                </Link>
            </li>
            <li className="row-span-2 w-full">
                <Link href="/play">
                    <div className="flex text-center justify-center items-center hover:scale-105 transition-all px-8 py-5 w-full h-full bg-secondary rounded-md">
                        All Gamemodes
                    </div>
                </Link>
            </li>
        </ul>
        <div className={"w-[90%] h-4 mt-20 bg-black/30 rounded-[50%] blur-lg transition-all"}></div>
    </div>
</div>
    );
 }
}
 
export default DesktopHeading;