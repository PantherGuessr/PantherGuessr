"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


const NoLeaderboardResultsPage = () => {

  const router = useRouter();

  useEffect(() => {
    router.push('/');
  });

  return;
};
 
export default NoLeaderboardResultsPage;