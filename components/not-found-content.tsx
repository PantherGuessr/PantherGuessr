"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NotFoundContentProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function NotFoundContent({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showBackButton = true,
}: NotFoundContentProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 pb-10 text-center">
      <h1 className="text-8xl">404</h1>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="max-w-md text-lg text-muted-foreground">{description}</p>
      <div className="mt-4 flex gap-4">
        {showBackButton && (
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        )}
        <Link href="/">
          <Button variant="default">
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
