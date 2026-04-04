"use client";

import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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
      <div className="h-full flex items-center justify-center">
        <Skeleton className="w-[240px] h-[40px] translate-y-[40%]" />
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
  <Suspense fallback={<Skeleton className="w-[240px] h-[40px] translate-y-[40%]" />}>
    <AdminLayoutInner>{children}</AdminLayoutInner>
  </Suspense>
);

export default AdminLayout;
