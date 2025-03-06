import { forwardRef, ReactNode } from "react";
import dynamic from "next/dynamic";

const LazyMapContainer = dynamic(() => import("./map-lazy-components").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-secondary/20 rounded-md" />,
});

interface MapContainerProps {
  children?: ReactNode;
  className?: string;
  attributionControl?: boolean;
  center: [number, number];
  zoom: number;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

export const MapContainer = forwardRef<HTMLDivElement, MapContainerProps>(({ children, ...props }, ref) => (
  <LazyMapContainer {...props} ref={ref}>
    {children}
  </LazyMapContainer>
));

MapContainer.displayName = "MapContainer";

export const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
