"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SiteSettings = () => {
  return (
    <>
      <div className="flex flex-wrap justify-items-center">
        <div className="my-4 w-full flex-grow md:basis-1/2">
          <Card className="m-0 h-full p-1 md:m-2 md:p-2">
            <CardHeader className="px-3 text-start md:px-6">
              <CardTitle>Gamemode Configuration</CardTitle>
              <CardDescription>Configure which gamemodes are enabled for all users.</CardDescription>
            </CardHeader>
            <CardContent className="px-3 md:px-6">
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
        <div className="my-4 w-full flex-grow md:basis-1/2">
          <Card className="m-0 h-full p-1 md:m-2 md:p-2">
            <CardHeader className="px-3 text-start md:px-6">
              <CardTitle>Category Configuration</CardTitle>
              <CardDescription>Configure which level categories are enabled for all users.</CardDescription>
            </CardHeader>
            <CardContent className="px-3 md:px-6">
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
  );
};

export default SiteSettings;
