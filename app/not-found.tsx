"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-full">
      <Navbar />
      <main className="h-full pt-40">
        <div className="flex min-h-full flex-col">
          <div className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 pb-10 text-center">
            <h1 className="text-8xl">404</h1>
            <p className="pt-4 text-xl">Page Does Not Exist</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back To Previous Page
            </Button>
            <Link href="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" /> Go To Home Page
              </Button>
            </Link>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
