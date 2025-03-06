import { useRef } from "react";

import { MapContainer, TileLayer } from "./map-components";

const Map = () => {
  const mapRef = useRef(null);
  return (
    <MapContainer
      ref={mapRef}
      className="w-full h-full rounded-md"
      attributionControl={true}
      center={[33.793332, -117.851475]}
      zoom={17}
      scrollWheelZoom={true}
      doubleClickZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
};

export default Map;
