"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const DynamicPreviewMap = dynamic(() => import("./preview-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ),
});

export default DynamicPreviewMap;
