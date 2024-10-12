import { Button } from "@/components/ui/button"

import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Menu } from "lucide-react"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-transparent z-5">
            <div className="hidden md:flex md:ml-auto w-full justify-end items-center gap-x-2 text-muted-foreground">
                <p className="text-sm mr-auto ml-2">© 2024 • PantherGuessr</p>
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
            <div className="flex md:hidden ml-auto w-full justify-between items-center text-muted-foreground">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <Link href="/credits">
                        <DropdownMenuItem>
                            Credits
                        </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Legal
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <Link href="/privacy-policy">
                                    <DropdownMenuItem>
                                        Privacy Policy
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/terms-and-conditions">
                                    <DropdownMenuItem>
                                        Terms & Conditions
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
                <p className="text-sm mx-auto">© 2024 • PantherGuessr</p>
                <ModeToggle />
            </div>
        </div>
    )
}