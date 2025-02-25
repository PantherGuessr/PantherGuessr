"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import L from "leaflet";
import { CircleMarker, MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

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
        <Marker icon={pantherGuessrMarkerIcon} position={localMarkerPosition} />
        <CircleMarker center={localMarkerPosition} pathOptions={{ color: "#a50034" }} radius={3} />
      </>
    );
  }

  return (
    <div className="flex min-h-full min-w-full grow">
      <MapContainer
        className="w-full h-full rounded-md"
        attributionControl={true}
        center={[33.793332, -117.851475]}
        zoom={16}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default UploadMap;
