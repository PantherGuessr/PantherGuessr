"use client";

import { Suspense, useState } from "react";
import L from "leaflet";

import { LazyLocationMarker, LazyMap } from "@/components/map/lazy-loaders";
import LeafletStyles from "@/components/map/leaflet-styles";
import MarkerSetup from "@/components/map/marker-setup";
import { useMarker } from "./MarkerContext";

const UploadMap = () => {
  const { localMarkerPosition, setLocalMarkerPosition } = useMarker();
  const [markerHasBeenPlaced, setMarkerHasBeenPlaced] = useState(false);
  const [pantherGuessrMarkerIcon, setPantherGuessrMarkerIcon] = useState<L.Icon | null>(null);

  return (
    <div className="flex min-h-full min-w-full grow">
      <LeafletStyles />
      <Suspense fallback={<div className="h-[200px]">Loading...</div>}>
        <LazyMap
          className="w-full h-full rounded-md"
          attributionControl={true}
          center={[33.793332, -117.851475]}
          zoom={16}
          scrollWheelZoom={true}
          doubleClickZoom={true}
        >
          <MarkerSetup onIconCreate={setPantherGuessrMarkerIcon} />
          {pantherGuessrMarkerIcon && (
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
          )}
        </LazyMap>
      </Suspense>
    </div>
  );
};

export default UploadMap;
