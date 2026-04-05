"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Loader2, User } from "lucide-react";

import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";

const PlayPage = () => {
  const { data: currentUser, isLoading, isAuthenticated } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push(`/`);
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (currentUser?.isBanned) {
      router.push(`/profile/${currentUser.user.username}`);
    }
  }, [currentUser, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="absolute left-4 top-4 mt-20">
        <Link href="/">
          <Button variant="outline" className="m-2 rounded-full" title="Back to main menu">
            <ArrowLeft className="mx-[-5px] h-6 w-4" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center">
        <Link href="/weekly">
          <div className="gamemode-card glow flex flex-col items-center bg-primary text-primary-foreground shadow-md">
            <CalendarClock className="mb-2" />
            <h1>Weekly Challenge</h1>
          </div>
        </Link>
        <Link href="/game">
          <div className="gamemode-card glow-effect flex flex-col items-center bg-primary text-primary-foreground shadow-md">
            <User className="mb-2" />
            <h1>Singleplayer</h1>
          </div>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default PlayPage;
