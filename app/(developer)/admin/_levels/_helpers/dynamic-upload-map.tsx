"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicUploadMap = dynamic(() => import("./upload-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ),
});

export default DynamicUploadMap;
