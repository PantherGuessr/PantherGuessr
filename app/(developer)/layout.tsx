"use client";

import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { redirect } from "next/navigation";

const AdminLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { user } = useUser();
    const isAdmin = useQuery(api.users.hasRole, { clerkId: user?.id || "", role: "admin" });

    // If they are loading
    if(isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Skeleton className="w-[240px] h-[40px] translate-y-[40%]" />
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
    if(!isAdmin) {
        return redirect("/");
    }

    return ( 
        <div className="h-full">
            <Navbar />
            <main className="h-full pt-32">
                {children}
            </main>
        </div> 
    );
}
 
export default AdminLayout;