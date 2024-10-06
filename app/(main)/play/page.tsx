"use client";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

const PlayPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center justify-start text-center gap-y-8 flex-1 px-6 pb-10">
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