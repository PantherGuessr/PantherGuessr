"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SiteSettings = () => {
    return (
        <>
        <div className="flex flex-wrap justify-items-center">
            <div className="md:basis-1/2 w-full my-4 flex-grow">
            <Card className="p-2 m-2 h-full">
                <CardHeader className="text-start">
                    <CardTitle>
                        Gamemode Configuration
                    </CardTitle>
                    <CardDescription>
                        Configure which gamemodes are enabled for all users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex-col gap-x-4">
                        <Separator className="mb-4" />
                        <div className="flex items-center justify-between">
                            <p>Daily Challenge</p>
                            <Switch className="ml-auto" id="dailyChallengeSwitch" />
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                            <p>Singleplayer</p>
                            <Switch className="ml-auto" id="singleplayerSwitch" />
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                            <p>Multiplayer</p>
                            <Switch className="ml-auto" id="multiplayerSwitch" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
            <div className="md:basis-1/2 w-full my-4 flex-grow">
            <Card className="p-2 m-2 h-full">
                <CardHeader className="text-start">
                    <CardTitle>
                        Category Configuration
                    </CardTitle>
                    <CardDescription>
                        Configure which level categories are enabled for all users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex-col gap-x-4">
                        <Separator className="mb-4" />
                        <div className="flex items-center justify-between">
                            <p>Standard</p>
                            <Switch className="ml-auto" id="standardCategorySwitch" />
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                            <p>Campus Only</p>
                            <Switch className="ml-auto" id="campusOnlyCategorySwitch" />
                        </div>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                            <p>Hard Mode</p>
                            <Switch className="ml-auto" id="hardModeSwitch" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
        </>
    )
}

export default SiteSettings;