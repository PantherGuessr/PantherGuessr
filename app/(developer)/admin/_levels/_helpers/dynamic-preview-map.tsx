"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const DynamicPreviewMap = dynamic(() => import("./preview-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary rounded-md flex justify-center items-center">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  ),
});

export default DynamicPreviewMap;
