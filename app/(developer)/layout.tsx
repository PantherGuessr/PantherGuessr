"use client";

import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoleCheck } from "@/hooks/use-role-check";
import { RedirectToSignIn } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

const AdminLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { result: isAdmin, isLoading: isAdminLoading } = useRoleCheck("admin");

    // If they are loading
    if(authLoading || isAdminLoading) {
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