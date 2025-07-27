"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicUploadMap = dynamic(() => import("./upload-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary rounded-md flex justify-center items-center">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  ),
});

export default DynamicUploadMap;
