import L, { LatLng } from "leaflet";

import "leaflet/dist/leaflet.css";

import { useState } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

interface ReviewMapProps {
  initialLat: number;
  initialLng: number;
  onPositionChange: (lat: number, lng: number) => void;
}

const pantherGuessrMarkerIcon = new L.Icon({
  iconUrl: "/PantherGuessrPin.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

const ReviewMap = ({ initialLat, initialLng, onPositionChange }: ReviewMapProps) => {
  const [markerPos, setMarkerPos] = useState<LatLng>(new LatLng(initialLat, initialLng));

  function ClickHandler() {
    useMapEvents({
      click(e) {
        setMarkerPos(e.latlng);
        onPositionChange(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        key={`${initialLat}-${initialLng}`}
        className="h-full w-full rounded-md"
        attributionControl={true}
        center={[initialLat, initialLng]}
        zoom={17}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler />
        <Marker icon={pantherGuessrMarkerIcon} position={markerPos} />
        <CircleMarker center={markerPos} pathOptions={{ color: "#a50034" }} radius={3} />
      </MapContainer>
    </div>
  );
};

export default ReviewMap;
