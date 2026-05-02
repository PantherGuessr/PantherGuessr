"use client";

import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import ProfileHoverCard from "@/components/profile-hover-card";
import { api } from "@/convex/_generated/api";

const ContributorsList = () => {
  const contributors = useQuery(api.users.getUsersByRole, { role: "contributor" });

  if (contributors === undefined) {
    return <Loader2 className="h-6 w-6 animate-spin" />;
  }

  if (contributors.length === 0) {
    return <p className="text-muted-foreground">No contributors yet.</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-wrap justify-center gap-2 px-6">
      {contributors.map((contributor) => (
        <ProfileHoverCard key={contributor._id} userID={contributor._id} />
      ))}
    </div>
  );
};

export default ContributorsList;
