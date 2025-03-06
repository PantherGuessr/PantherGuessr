import { forwardRef, ReactNode } from "react";
import { MapContainer as LeafletMapContainer, MapContainerProps as LeafletMapContainerProps } from "react-leaflet";

interface ExtendedMapContainerProps extends LeafletMapContainerProps {
  children?: ReactNode;
}

const MapContainer = forwardRef<HTMLDivElement, ExtendedMapContainerProps>((props) => (
  <LeafletMapContainer {...props} />
));

MapContainer.displayName = "MapContainer";

export { MapContainer };
