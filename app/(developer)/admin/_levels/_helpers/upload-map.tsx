import "leaflet/dist/leaflet.css";

import { Suspense, useEffect, useState } from "react";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";

import { LazyCircleMarker, LazyMap, LazyMarker } from "@/components/map/lazy-loaders"; // Adjust the path as needed
import { useMarker } from "./MarkerContext";

const UploadMap = () => {
  const { localMarkerPosition, setLocalMarkerPosition } = useMarker();
  const [markerHasBeenPlaced, setMarkerHasBeenPlaced] = useState(false);

  const pantherGuessrMarkerIcon = new L.Icon({
    iconUrl: "/PantherGuessrPin.svg",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const position = e.latlng;
        setLocalMarkerPosition(position);
        setMarkerHasBeenPlaced(true);
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
  }

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
            <LocationMarker />
          </Suspense>
        </LazyMap>
      </Suspense>
    </div>
  );
};

export default UploadMap;
