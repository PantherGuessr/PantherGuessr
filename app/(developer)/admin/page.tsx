"use client";

import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Analytics from "./_analytics/analytics";
import { useAdmin } from "./_components/adminprovider";
import LevelUpload from "./_levels/_helpers/levelupload";
import { MarkerProvider } from "./_levels/_helpers/MarkerContext";
import Levels from "./_levels/levels";
import SiteSettings from "./_sitesettings/sitesettings";
import WeeklyChallengeConfig from "./_weekly/weeklyconfig";

const AdminPage = () => {
  const { tab } = useAdmin();

  const handleTabChange = (value: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `?tab=${value}`);
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col text-center gap-y-8 flex-1 px-6 pb-10">
        <h1 className="text-4xl">Admin Dashboard</h1>
        <Tabs defaultValue={tab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="analytics" id="analytics-page-trigger">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="levels" id="levels-page-trigger">
              Levels
            </TabsTrigger>
            <TabsTrigger value="weekly" id="weekly-page-trigger">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="users" id="users-page-trigger">
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" id="settings-page-trigger">
              Site Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analytics">
            <Card className="mt-8 mx-10 p-2">
              <CardHeader className="text-4xl ml-2 text-start">Analytics</CardHeader>
              <CardContent>
                <Analytics />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="levels">
            <MarkerProvider>
              <Card className="mt-8 mx-10 p-2">
                <CardHeader className="flex flex-row justify-between">
                  <p className="text-4xl ml-2 text-start ">Levels</p>
                  <LevelUpload />
                </CardHeader>
                <CardContent>
                  <Levels />
                </CardContent>
              </Card>
            </MarkerProvider>
          </TabsContent>
          <TabsContent value="weekly">
            <Card className="mt-8 mx-10 p-2">
              <MarkerProvider>
                <CardHeader className="text-4xl ml-2 text-start">Weekly Challenges</CardHeader>
                <CardContent>
                  <WeeklyChallengeConfig />
                </CardContent>
              </MarkerProvider>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card className="mt-8 mx-10 p-2">
              <CardHeader className="text-4xl ml-2 text-start">Site Settings</CardHeader>
              <CardContent>
                <SiteSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
