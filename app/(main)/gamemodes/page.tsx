"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

const GameModesPage = () => {
    return (
        <div>
            <Link href="/play">
                <Button variant="default" className="flex items-center">
                    Play Singleplayer <Play className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </div>
    )
    
}
 
export default GameModesPage;