"use client";

import { ReactNode, useEffect, useState } from "react";
import L from "leaflet";

import LeafletStyles from "./leaflet-styles";
import { createPantherGuessrMarkerIcon } from "./marker-setup";

interface MapWrapperProps {
  children: (icon: L.Icon | null) => ReactNode;
}

export default function MapWrapper({ children }: MapWrapperProps) {
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    // Only create Leaflet objects on the client side
    setMarkerIcon(createPantherGuessrMarkerIcon());
  }, []);

  return (
    <>
      <LeafletStyles />
      {children(markerIcon)}
    </>
  );
}
