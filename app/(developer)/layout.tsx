"use client";

import { Suspense } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { RedirectToSignIn } from "@clerk/nextjs";

import { Navbar } from "@/components/navbar/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AdminProvider } from "./admin/_components/adminprovider";

const AdminLayoutInner = ({ children }: { children: React.ReactNode }) => {
  const { data: currentUser, isLoading, isAuthenticated } = useCurrentUser();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "analytics";

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Skeleton className="h-[40px] w-[240px] translate-y-[40%]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <RedirectToSignIn />;
  }

  if (!currentUser?.roles.isDeveloper) {
    return redirect("/");
  }

  return (
    <AdminProvider tab={tab}>
      <div className="h-full">
        <Navbar />
        <main className="h-full pt-32">{children}</main>
      </div>
    </AdminProvider>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Skeleton className="h-[40px] w-[240px] translate-y-[40%]" />}>
    <AdminLayoutInner>{children}</AdminLayoutInner>
  </Suspense>
);

export default AdminLayout;
