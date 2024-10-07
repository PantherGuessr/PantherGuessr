"use client";

import { Navbar } from "@/components/navbar";
import Spinner from "@/components/spinner";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

const AdminLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();

    // TODO: @Daniel do you want to add your skeleton thing here?
    // If they are loading
    if(isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    // If they aren't authenticated
    if(!isAuthenticated) {
        return (
            <RedirectToSignIn />
        )
    }

    // If they are not an admin
    if(user?.publicMetadata?.role !== "admin") {
        return redirect("/");
    }

    return ( 
        <div className="h-full">
            <Navbar />
            <main className="h-full pt-40">
                {children}
            </main>
        </div> 
    );
}
 
export default AdminLayout;