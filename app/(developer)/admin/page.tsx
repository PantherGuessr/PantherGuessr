"use client";

import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Analytics from "./_components/analytics";

const AdminPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl">Admin Dashboard</h1>
                <Tabs defaultValue="analytics">
                    <TabsList>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="rounds">Users</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analytics">
                        <Card className="mt-8 mx-10 p-2">
                            <CardHeader className="text-4xl text-start">
                                Analytics
                            </CardHeader>
                            <CardContent>
                                <Analytics />
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