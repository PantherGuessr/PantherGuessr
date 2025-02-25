import { FC, ReactNode } from "react";
import type { MapOptions } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

interface LeafletMapProps extends MapOptions {
  center: [number, number];
  children?: ReactNode;
  zoom: number;
  className?: string;
}

const LeafletMap: FC<LeafletMapProps> = ({ children, className, ...options }: LeafletMapProps) => {
  return (
    <MapContainer className={className || "h-[200px] w-full relative"} maxZoom={18} {...options}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
