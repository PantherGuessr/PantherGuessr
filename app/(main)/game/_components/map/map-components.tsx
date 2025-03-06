import { forwardRef, ReactNode } from "react";
import dynamic from "next/dynamic";

export const LazyMapContainer = dynamic(() => import("./map-lazy-components").then((m) => m.MapContainer), {
  ssr: false,
  loading: () => <div style={{ height: "400px" }} />,
});

interface MapContainerProps {
  children?: ReactNode;
  className?: string;
  attributionControl?: boolean;
  center: [number, number];
  zoom: number;
  scrollWheelZoom?: boolean;
  doubleClickZoom?: boolean;
}

// eslint-disable-next-line react/display-name
export const MapContainer = forwardRef<HTMLDivElement, MapContainerProps>(({ children, ...props }, ref) => (
  <LazyMapContainer {...props} ref={ref}>
    {children}
  </LazyMapContainer>
));

export const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
