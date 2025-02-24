"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NoLeaderboardResultsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  });

  return;
};

export default NoLeaderboardResultsPage;
