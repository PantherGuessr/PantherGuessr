"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicReviewMap = dynamic(() => import("./review-map"), {
  ssr: false,
  loading: () => (
    <div className="bg-secondary flex h-full w-full items-center justify-center rounded-md">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
});

export default DynamicReviewMap;
