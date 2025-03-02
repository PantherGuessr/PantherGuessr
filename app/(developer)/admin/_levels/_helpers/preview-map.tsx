"use client";

import { useEffect } from "react";

// import L from "leaflet";

// import { LazyCircleMarker, LazyMap, LazyMarker } from "@/components/map/lazy-loaders";
// import LeafletStyles from "@/components/map/leaflet-styles";
// import { useMarker } from "./MarkerContext";

const PreviewMap = () => {
  // const { localMarkerPosition } = useMarker();
  // const [pantherGuessrMarkerIcon, setPantherGuessrMarkerIcon] = useState<L.Icon | null>(null);

  // Create the icon only on the client side
  useEffect(() => {
    // setPantherGuessrMarkerIcon(
    //   new L.Icon({
    //     iconUrl: "/PantherGuessrPin.svg",
    //     iconSize: [48, 48],
    //     iconAnchor: [24, 48],
    //   })
    // );
  }, []);

  // Only render map if we have a marker position
  // if (!localMarkerPosition) {
  //   return (
  //     <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center">No location selected</div>
  //   );
  // }

  return (
    <div className="flex min-h-full min-w-full grow">
      {/* <LeafletStyles />
      <LazyMap
        className="w-full h-full rounded-md"
        attributionControl={true}
        center={[localMarkerPosition.lat, localMarkerPosition.lng]}
        zoom={16}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        {pantherGuessrMarkerIcon && (
          <>
            <LazyMarker icon={pantherGuessrMarkerIcon} position={localMarkerPosition} />
            <LazyCircleMarker center={localMarkerPosition} pathOptions={{ color: "#a50034" }} radius={3} />
          </>
        )}
      </LazyMap> */}
    </div>
  );
};

// Export as a dynamic component with SSR disabled
export default PreviewMap;
