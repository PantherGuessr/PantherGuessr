"use client";

import { FC, useEffect } from "react";
import L from "leaflet";

export const createPantherGuessrMarkerIcon = () => {
  return new L.Icon({
    iconUrl: "/PantherGuessrPin.svg",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });
};

interface MarkerSetupProps {
  onIconCreate: (icon: L.Icon) => void;
}

const MarkerSetup: FC<MarkerSetupProps> = ({ onIconCreate }) => {
  useEffect(() => {
    const icon = createPantherGuessrMarkerIcon();
    onIconCreate(icon);
  }, []); // Empty dependency array ensures this runs only once

  return null;
};

export default MarkerSetup;
