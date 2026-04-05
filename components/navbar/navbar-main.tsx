import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

const NavbarMain = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
            Play
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[350px] grid-flow-col grid-rows-6 gap-2 p-2">
              <li className="row-span-4">
                <Link href="/play">
                  <div className="flex h-full items-center justify-center rounded-md bg-primary px-10 py-10 text-center text-primary-foreground transition-all hover:scale-95">
                    Weekly
                    <br />
                    Challenge
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2 w-full">
                <Link href="/play">
                  <div className="flex items-center justify-center rounded-md bg-secondary px-8 py-5 text-center transition-all hover:scale-95">
                    All Gamemodes
                  </div>
                </Link>
              </li>
              <li className="row-span-2">
                <Link href="/game">
                  <div className="flex items-center justify-center rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-95">
                    Singleplayer
                  </div>
                </Link>
              </li>
              <li className="row-span-2">
                <Link href="/play">
                  <div className="flex items-center justify-center rounded-md bg-primary px-8 py-5 text-center text-primary-foreground transition-all hover:scale-95">
                    Multiplayer
                  </div>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
            Stats
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[350px] grid-flow-col grid-rows-6 gap-2 p-2">
              <li className="col-span-2 row-span-2">
                <Link href="/play">
                  <div className="flex w-full items-center justify-center rounded-md bg-secondary py-5 text-center text-secondary-foreground transition-all hover:scale-95">
                    Leaderboards
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2 w-full">
                <Link href="/play">
                  <div className="flex w-full items-center justify-center rounded-md bg-secondary py-5 text-center text-secondary-foreground transition-all hover:scale-95">
                    Weekly Challenge Results
                  </div>
                </Link>
              </li>
              <li className="col-span-2 row-span-2 w-full">
                <Link href="/play">
                  <div className="flex w-full items-center justify-center rounded-md bg-secondary py-5 text-center text-secondary-foreground transition-all hover:scale-95">
                    Your Profile
                  </div>
                </Link>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarMain;
