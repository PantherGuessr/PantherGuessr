
import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";

const NavbarMain = () => {

    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                        Play
                    </NavigationMenuTrigger>
                    <NavigationMenuContent >
                        <ul className="grid grid-rows-6 p-2 grid-flow-col gap-2 w-[350px]">
                            <li className="row-span-4">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all h-full px-10 py-10 bg-primary text-primary-foreground rounded-md">
                                        Weekly<br/>Challenge
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2 col-span-2 w-full">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 bg-secondary rounded-md">
                                        All Gamemodes
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2">
                                <Link href="/game">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 bg-primary text-primary-foreground rounded-md">
                                        Singleplayer
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all px-8 py-5 bg-primary text-primary-foreground  rounded-md">
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
                        <ul className="grid grid-rows-6 p-2 grid-flow-col gap-2 w-[350px]">
                            <li className="col-span-2 row-span-2">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all w-full py-5 bg-secondary text-secondary-foreground rounded-md">
                                        Leaderboards
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2 col-span-2 w-full">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all w-full py-5 bg-secondary text-secondary-foreground rounded-md">
                                        Weekly Challenge Results
                                    </div>
                                </Link>
                            </li>
                            <li className="row-span-2 col-span-2 w-full">
                                <Link href="/play">
                                    <div className="flex text-center justify-center items-center hover:scale-95 transition-all w-full py-5 bg-secondary text-secondary-foreground rounded-md">
                                        Your Profile
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default NavbarMain;