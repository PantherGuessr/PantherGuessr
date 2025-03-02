"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./_analytics/analytics";
import LevelUpload from "./_levels/_helpers/levelupload";
import Levels from "./_levels/levels";
import SiteSettings from "./_sitesettings/sitesettings";
import WeeklyChallengeConfig from "./_weekly/weeklyconfig";

const AdminContent = () => {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col text-center gap-y-8 flex-1 px-6 pb-10">
        <h1 className="text-4xl">Admin Dashboard</h1>
        <Tabs tabIndex={0}>
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
            <Card className="mt-8 mx-10 p-2">
              <CardHeader className="flex flex-row justify-between">
                <p className="text-4xl ml-2 text-start ">Levels</p>
                <LevelUpload />
              </CardHeader>
              <CardContent>
                <Levels />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="weekly">
            <Card className="mt-8 mx-10 p-2">
              <CardHeader className="text-4xl ml-2 text-start">Weekly Challenges</CardHeader>
              <CardContent>
                <WeeklyChallengeConfig />
              </CardContent>
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

// Main page component with Suspense
export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
