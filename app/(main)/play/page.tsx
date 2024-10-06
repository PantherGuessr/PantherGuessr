"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, User, Users } from "lucide-react";
import Link from "next/link";

const PlayPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="absolute mt-20 top-4 left-4">
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Go Back to Main Menu
                    </Button>
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
            <Link href="#" onClick={(e) => { e.preventDefault(); alert('DAILY CHALLENGE COMING SOON'); }}>
                <div className="gamemode-card glow flex flex-col items-center">
                    <Sparkles className="mb-2" />
                    <h1>Daily Challenge</h1>
                </div>
            </Link>
            <Link href="/game">
                <div className="gamemode-card flex flex-col items-center glow-effect">
                    <User className="mb-2" />
                    <h1>Singleplayer</h1>
                </div>
            </Link>
            <Link href="#" onClick={(e) => { e.preventDefault(); alert('MULTIPLAYER COMING SOON'); }}>
                <div className="gamemode-card flex flex-col items-center">
                    <Users className="mb-2" />
                    <h1>Multiplayer</h1>
                </div>
            </Link>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default PlayPage;