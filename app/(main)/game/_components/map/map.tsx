import { MapContainer, TileLayer } from "./map-components";

import "leaflet/dist/leaflet.css";

const Map = () => {
  return (
    <div className="flex min-h-full min-w-full grow fade-in-map">
      <MapContainer
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
    </div>
  );
};

export default Map;
