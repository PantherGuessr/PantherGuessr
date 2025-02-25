"use client";

import dynamic from "next/dynamic";

const DynamicPreviewMap = dynamic(() => import("./preview-map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default DynamicPreviewMap;
