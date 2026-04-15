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
import Users from "./_users/users";
import WeeklyChallengeConfig from "./_weekly/weeklyconfig";

const AdminPage = () => {
  const { tab } = useAdmin();

  const handleTabChange = (value: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `?tab=${value}`);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col gap-y-8 px-1 pb-10 text-center md:px-6">
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
            <Card className="mx-1 mt-8 md:mx-10 p-2">
              <CardHeader className="ml-2 text-start text-4xl">Analytics</CardHeader>
              <CardContent>
                <Analytics />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="levels">
            <MarkerProvider>
              <Card className="mx-1 mt-8 p-0 md:mx-10 md:p-2 [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 md:[&_td]:px-4 md:[&_td]:py-4 md:[&_th]:px-4">
                <CardHeader className="flex flex-row justify-between px-3 md:px-6">
                  <p className="ml-2 text-start text-4xl">Levels</p>
                  <LevelUpload />
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                  <Levels />
                </CardContent>
              </Card>
            </MarkerProvider>
          </TabsContent>
          <TabsContent value="weekly">
            <Card className="mx-1 mt-8 p-0 md:mx-10 md:p-2 [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 md:[&_td]:px-4 md:[&_td]:py-4 md:[&_th]:px-4">
              <MarkerProvider>
                <CardHeader className="px-3 text-start text-4xl md:px-6">Weekly Challenges</CardHeader>
                <CardContent className="px-2 md:px-6">
                  <WeeklyChallengeConfig />
                </CardContent>
              </MarkerProvider>
            </Card>
          </TabsContent>
          <TabsContent value="users">
            <div className="mx-1 mt-8 md:mx-10">
              <Users />
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <Card className="mx-1 mt-8 p-0 md:mx-10 md:p-2">
              <CardHeader className="px-3 text-start text-4xl md:px-6">Site Settings</CardHeader>
              <CardContent className="px-2 md:px-6">
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
