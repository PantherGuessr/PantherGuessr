"use client";

import "leaflet/dist/leaflet.css";

import { Suspense, useState } from "react";
import L from "leaflet";

import { LazyLocationMarker, LazyMap } from "@/components/map/lazy-loaders";
import { useMarker } from "./MarkerContext";

const UploadMap = () => {
  const { localMarkerPosition, setLocalMarkerPosition } = useMarker();
  const [markerHasBeenPlaced, setMarkerHasBeenPlaced] = useState(false);

  const pantherGuessrMarkerIcon = new L.Icon({
    iconUrl: "/PantherGuessrPin.svg",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  return (
    <div className="flex min-h-full min-w-full grow">
      <Suspense fallback={<div className="h-[200px]" />}>
        <LazyMap
          className="w-full h-full rounded-md"
          attributionControl={true}
          center={[33.793332, -117.851475]}
          zoom={16}
          scrollWheelZoom={true}
          doubleClickZoom={true}
        >
          <Suspense fallback={<></>}>
            <LazyLocationMarker
              localMarkerPosition={localMarkerPosition}
              setLocalMarkerPosition={(pos) => {
                setLocalMarkerPosition(pos);
                setMarkerHasBeenPlaced(true);
              }}
              markerHasBeenPlaced={markerHasBeenPlaced}
              pantherGuessrMarkerIcon={pantherGuessrMarkerIcon}
            />
          </Suspense>
        </LazyMap>
      </Suspense>
    </div>
  );
};

export default UploadMap;
