import { GitBranch, GlobeLock, Heart, Menu, Scale } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

import pk from "../package.json";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-transparent z-5">
      <div className="hidden md:flex md:ml-auto w-full justify-end items-center gap-x-2 text-muted-foreground">
        <p className="text-sm mr-auto ml-2">© 2025 • PantherGuessr</p>
        <Link href="/credits">
          <Button variant="ghost" size="sm">
            <Heart className="w-4 h-4 mr-2" />
            Credits
          </Button>
        </Link>
        <Link href="/privacy-policy">
          <Button variant="ghost" size="sm">
            <GlobeLock className="w-4 h-4 mr-2" />
            Privacy Policy
          </Button>
        </Link>
        <Link href="/terms-and-conditions">
          <Button variant="ghost" size="sm">
            <Scale className="w-4 h-4 mr-2" />
            Terms & Conditions
          </Button>
        </Link>
        <Link href="/release-notes">
          <Button variant="ghost" size="sm">
            <GitBranch className="w-4 h-4 mr-2" /> {pk.version}
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
                <Heart className="w-4 h-4 mr-2" />
                Credits
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Scale className="w-4 h-4 mr-2" />
                Legal
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <Link href="/privacy-policy">
                    <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
                  </Link>
                  <Link href="/terms-and-conditions">
                    <DropdownMenuItem>Terms & Conditions</DropdownMenuItem>
                  </Link>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <Link href="/release-notes">
              <DropdownMenuItem>
                <GitBranch className="w-4 h-4 mr-2" /> {pk.version}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-sm mx-auto">© 2025 • PantherGuessr</p>
        <ModeToggle />
      </div>
    </div>
  );
};
