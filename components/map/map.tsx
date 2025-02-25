"use client";

import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { ReactNode } from "react";

interface MapProps {
  children?: ReactNode;
  center: [number, number];
  className?: string;
  zoom?: number;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  attributionControl?: boolean;
}

const Map = ({
  children,
  center,
  className = "w-full h-full rounded-md",
  zoom = 16,
  scrollWheelZoom = true,
  doubleClickZoom = true,
  attributionControl = true,
}: MapProps) => {
  if (typeof window === "undefined") {
    return <></>;
  }

  return (
    <div>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        doubleClickZoom={doubleClickZoom}
        attributionControl={attributionControl}
        className={className}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;
