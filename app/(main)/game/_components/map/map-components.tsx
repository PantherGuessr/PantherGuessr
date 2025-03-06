import { forwardRef, ReactNode } from "react";
import dynamic from "next/dynamic";

import Spinner from "@/components/spinner";

const LazyMapContainer = dynamic(() => import("./map-lazy-components").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <Spinner size={"lg"} />,
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
