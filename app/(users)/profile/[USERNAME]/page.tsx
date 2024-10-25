"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2, LucideShield, Save, Shield, SquarePen, UserSearch, X } from "lucide-react";
import "./backgrounds.css";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { set } from "date-fns";
import { clerkClient } from "@clerk/nextjs/server";

type Props = {
    params: { USERNAME: string }
}

const ProfilePage = ({ params }: Props) => {
    const usernameSubPage = params.USERNAME as string;
    const clerkUser = useUser();
    const user = useQuery(api.users.getUserByUsername, { username: usernameSubPage });

    // username editing
    const [usernameForUpdate, setUsernameForUpdate] = useState(user?.username);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [userNameInputWidth, setUserNameInputWidth] = useState(0);

    // recalculate the width of the input based on the username length
    useEffect(() => {
        if (!usernameForUpdate) {
            setUserNameInputWidth(64);
        }
        else {
            if (usernameForUpdate.length > 32) {
                setUsernameForUpdate(usernameForUpdate.slice(0, 32));
            }
            const width = usernameForUpdate.length * 19 + 64;
            if (width < 64) {
                setUserNameInputWidth(64);
            }
            else {
                setUserNameInputWidth(width);
            }
        }
    }, [usernameForUpdate]);

    if(user === undefined) {
        return (
            <div className="min-h-full flex flex-col">
                <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                    <Loader2 className="animate-spin w-20 h-20" />
                </div>
                <Footer />
            </div>
        )
    }

    if(!user) {
        return (
            <div className="min-h-full flex flex-col">
                <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
                    <h1 className="text-3xl sm:text-5xl font-bold">@{usernameSubPage} does not exist!</h1>
                    <Button asChild>
                        <Link href="/profile">
                            <UserSearch className="h-4 w-4 mr-2" /> Search Different User
                        </Link>
                    </Button>
                </div>
                <Footer />
            </div>
        )
    }

    // checks if the current user is the same as the user being viewed
    const isCurrentUser = clerkUser.user?.id === user.clerkId;

    return (
        <>
        <div className="min-h-full flex flex-col mt-20">
        <div className="min-h-full flex flex-col bg-gradient-red-purple">
            <div className="flex w-full h-96 bg-gradient-to-b from-background to-transparent">

            </div>
            <script>
                document.
            </script>
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10 bg-background">
                <div className="flex w-full md:flex-row flex-col md:items-start items-center justify-between px-4 md:px-10 lg:px-20">
                    <div className="flex md:flex-row flex-col items-center md:items-start md:pt-4">
                        <Image className="rounded-full translate-y-[-5em] mb-[-5em] md:mb-0 border-8 border-background" src={user.picture} width={200} height={200} alt="Profile Picture" />
                        <div className="flex flex-col items-center text-center md:text-start md:items-start justify-center gap-y-1">
                            <div className="flex md:flex-row flex-col items-center md:items-start">
                                <div className="flex flex-row items-center">
                                    {isCurrentUser ? (isEditingUsername ? (
                                        <>
                                        <Input 
                                            type="text" 
                                            value={usernameForUpdate} 
                                            onChange={(e) => setUsernameForUpdate(e.target.value)}
                                            className="text-4xl font-bold md:pl-4 transition-all duration-[25] ease-in-out"
                                            style={{ width: userNameInputWidth }}
                                            onKeyDown={(e) => {
                                                if(e.key === "Escape") {
                                                    setIsEditingUsername(false);
                                                }
                                            }}
                                        />
                                        <X className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                                            setIsEditingUsername(false);
                                        }} />
                                        <Save className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                                            // clerkClient.users.updateUser(user.clerkId, { username: usernameForUpdate})
                                            setIsEditingUsername(false);
                                        }} />
                                        </>
                                    ) : (   
                                        <> 
                                        <h1 className="text-4xl font-bold md:pl-4 cursor-default">{user.username}</h1>
                                        <SquarePen className="h-7 w-7 ml-1 mt-1 cursor-pointer" onClick={() => {
                                            setIsEditingUsername(true)
                                            setUsernameForUpdate(user.username);
                                        }} />
                                        </>  
                                    )): (
                                        <h1 className="text-4xl font-bold md:pl-4">{user.username}</h1>
                                    )}
                                </div>
                                <div className="flex flex-row items-center md:items-start">
                                    {user.roles?.includes("admin") && (
                                        <Shield className="h-8 w-8 ml-3 mt-1" fill="#A50034" />
                                    )}           
                                </div>
                            </div>
                            <p className="text-md md:pl-4 font-bold text-muted-foreground italic">{user.tagline}</p>
                            <p className="text-md md:pl-4 font-bold text-muted-foreground/60 italic">Guesser since {new Date(user._creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full md:w-auto items-start pt-4">
                        <div className="flex flex-row justify-between w-full">
                            <p className="text-md font-bold mr-4">Level {Number(user.level)}</p>
                            <p className="text-md text-muted-foreground font-bold">{Number(user.currentXP)}/{100} XP</p>
                        </div>
                        <Progress className="w-full lg:w-64 mt-1" value={Number(user.currentXP)} />
                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
        <Footer />
        </div>
        </>
    )
    
}
 
export default ProfilePage;