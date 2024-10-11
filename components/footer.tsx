import { Button } from "@/components/ui/button"

import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-transparent z-5">
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                <Link href="/credits">
                    <Button variant="ghost" size="sm">
                        Credits
                    </Button>
                </Link>
                <Link href="/privacy-policy">
                    <Button variant="ghost" size="sm">
                        Privacy Policy
                    </Button>
                </Link>
                <Link href="/terms-and-conditions">
                    <Button variant="ghost" size="sm">
                        Terms & Conditions
                    </Button>
                </Link>
                <ModeToggle />
            </div>
        </div>
    )
}