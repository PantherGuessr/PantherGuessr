"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col items-center justify-center text-center gap-y-4 flex-1 px-6 pb-10">
      <h1 className="text-8xl">404</h1>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-md">{description}</p>
      <div className="flex gap-4 mt-4">
        {showBackButton && (
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
          </Button>
        )}
        <Link href="/">
          <Button variant="default">
            <Home className="mr-2 w-4 h-4" /> Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
