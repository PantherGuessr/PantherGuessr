"use client";

import dynamic from "next/dynamic";

const DynamicInteractableMap = dynamic(() => import("./interactable-map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default DynamicInteractableMap;
