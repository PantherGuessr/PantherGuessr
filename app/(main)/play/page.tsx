"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
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
                <Link href="/game">
                    <Button variant="default" className="flex items-center">
                        Play Singleplayer <Play className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
                <Button
                    variant="secondary" 
                    className="flex items-center"
                    onClick={() => alert('COMING SOON')}
                >
                    Play Multiplayer <Play className="w-4 h-4 ml-2" />
                </Button>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default PlayPage;