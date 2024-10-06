import { Button } from "@/components/ui/button"

import { Logo } from "./logo"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-background z-50">
            <Logo />
            <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
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