"use client";

import dynamic from "next/dynamic";

const DynamicUploadMap = dynamic(() => import("./upload-map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default DynamicUploadMap;
