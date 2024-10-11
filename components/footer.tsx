import { Button } from "@/components/ui/button"

import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "./ui/dropdown-menu"

export const Footer = () => {
    return (
        <div className="flex items-center w-full p-6 bg-transparent z-5">
            <div className="hidden md:flex md:ml-auto w-full justify-end items-center gap-x-2 text-muted-foreground">
                {/* TODO: ADD a copyright message such as: © 2024 - PantherGuessr */}
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
            <div className="flex md:hidden ml-auto w-full justify-between items-end text-muted-foreground">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            Additional
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="m-2">
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
                <ModeToggle />
            </div>
        </div>
    )
}