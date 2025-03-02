"use client";

import { useEffect } from "react";

export default function LeafletStyles() {
  useEffect(() => {
    // Create a link element for the Leaflet CSS
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    linkElement.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    linkElement.crossOrigin = "";

    // Add to the document head
    document.head.appendChild(linkElement);

    // Clean up function to remove the link when component unmounts
    return () => {
      document.head.removeChild(linkElement);
    };
  }, []);

  return null;
}
