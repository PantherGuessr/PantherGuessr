import Link from "next/link";
import { GitBranch, GlobeLock, Heart, Menu, Scale } from "lucide-react";

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
    <div className="z-5 flex w-full items-center bg-transparent p-6">
      <div className="hidden w-full items-center justify-end gap-x-2 text-muted-foreground md:ml-auto md:flex">
        <p className="ml-2 mr-auto text-sm">© 2025 • PantherGuessr</p>
        <Link href="/credits">
          <Button variant="ghost" size="sm">
            <Heart className="mr-2 h-4 w-4" />
            Credits
          </Button>
        </Link>
        <Link href="/privacy-policy">
          <Button variant="ghost" size="sm">
            <GlobeLock className="mr-2 h-4 w-4" />
            Privacy Policy
          </Button>
        </Link>
        <Link href="/terms-and-conditions">
          <Button variant="ghost" size="sm">
            <Scale className="mr-2 h-4 w-4" />
            Terms & Conditions
          </Button>
        </Link>
        <Link href="/release-notes">
          <Button variant="ghost" size="sm">
            <GitBranch className="mr-2 h-4 w-4" /> {pk.version}
          </Button>
        </Link>
        <ModeToggle />
      </div>
      <div className="ml-auto flex w-full items-center justify-between text-muted-foreground md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <Link href="/credits">
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                Credits
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Scale className="mr-2 h-4 w-4" />
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
                <GitBranch className="mr-2 h-4 w-4" /> {pk.version}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="mx-auto text-sm">© 2025 • PantherGuessr</p>
        <ModeToggle />
      </div>
    </div>
  );
};
