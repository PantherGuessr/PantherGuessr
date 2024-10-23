"use client";

import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./_components/analytics";
import Levels from "./_components/levels";
import SiteSettings from "./_components/sitesettings";
import LevelUpload from "./_components/helpers/levelupload";
import { MarkerProvider } from "./_components/helpers/MarkerContext";

const AdminPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl">Admin Dashboard</h1>
                <Tabs defaultValue="analytics">
                    <TabsList>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="levels">Levels</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="settings">Site Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analytics">
                        <Card className="mt-8 mx-10 p-2">
                            <CardHeader className="text-4xl ml-2 text-start">
                                Analytics
                            </CardHeader>
                            <CardContent>
                                <Analytics />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="levels">
                        <Card className="mt-8 mx-10 p-2">
                            <CardHeader className="flex flex-row justify-between">
                                <p className="text-4xl ml-2 text-start ">Levels</p>
                                <MarkerProvider >
                                    <LevelUpload />
                                </MarkerProvider>
                            </CardHeader>
                            <CardContent>
                                <Levels />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="settings">
                        <Card className="mt-8 mx-10 p-2">
                            <CardHeader className="text-4xl ml-2 text-start">
                                Site Settings
                            </CardHeader>
                            <CardContent>
                                <SiteSettings />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <Footer />
        </div>
    )
    
}
 
export default AdminPage;