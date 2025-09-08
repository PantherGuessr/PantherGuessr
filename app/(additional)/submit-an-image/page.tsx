"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { Footer } from "@/components/footer";
import { api } from "@/convex/_generated/api";
import { useBanCheck } from "@/hooks/use-ban-check";

const SubmitAnImage = () => {
  const currentUser = useQuery(api.users.current);
  const { result: isBanned, isLoading: isBanCheckLoading } = useBanCheck(currentUser?.clerkId);

  const router = useRouter();

  useEffect(() => {
    if (isBanned) {
      router.push(`/profile/${currentUser?.username}`);
    }
  }, [currentUser?.username, isBanned, router]);

  if (!currentUser && isBanCheckLoading) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
          <Loader2 className="animate-spin w-20 h-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center text-center gap-y-8 flex-1 px-6 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl justify-self-center">Submit an Image</h1>
          <p>Submit an image for PantherGuessr.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubmitAnImage;
