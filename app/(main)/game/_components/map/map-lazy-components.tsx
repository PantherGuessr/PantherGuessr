import { forwardRef } from "react";
import { MapContainer as LMapContainer } from "react-leaflet";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MapContainer = forwardRef((props: any, ref) => <LMapContainer {...props} ref={ref} />);

MapContainer.displayName = "MapContainer";

export { MapContainer };
