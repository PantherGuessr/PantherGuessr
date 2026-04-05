"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// !!! NEVER IMPORT THIS COMPONENT DIRECTLY. USE "MapWrapper" INSTEAD !!
const InteractableMap = dynamic(() => import("./interactable-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-md bg-secondary">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ),
});

const DynamicInteractableMap = () => {
  return <InteractableMap />;
};

export default DynamicInteractableMap;
