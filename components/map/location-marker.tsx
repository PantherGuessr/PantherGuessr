"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

import { LazyCircleMarker, LazyMarker } from "./lazy-loaders";

interface LocationMarkerProps {
  localMarkerPosition: L.LatLng | null;
  setLocalMarkerPosition: (position: L.LatLng | null) => void;
  markerHasBeenPlaced: boolean;
  pantherGuessrMarkerIcon: L.Icon;
}

const LocationMarker = ({
  localMarkerPosition,
  setLocalMarkerPosition,
  markerHasBeenPlaced,
  pantherGuessrMarkerIcon,
}: LocationMarkerProps) => {
  useMapEvents({
    click(e) {
      setLocalMarkerPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (!markerHasBeenPlaced) {
      setLocalMarkerPosition(null);
    }
  });

  return localMarkerPosition === null ? null : (
    <>
      <LazyMarker icon={pantherGuessrMarkerIcon} position={localMarkerPosition} />
      <LazyCircleMarker center={localMarkerPosition} pathOptions={{ color: "#a50034" }} radius={3} />
    </>
  );
};

export default LocationMarker;
