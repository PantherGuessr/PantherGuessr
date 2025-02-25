import dynamic from "next/dynamic";

export const LazyMap = dynamic(() => import("./leaflet-map"), { ssr: false });

export const LazyMarker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
});

export const LazyCircleMarker = dynamic(async () => (await import("react-leaflet")).CircleMarker, {
  ssr: false,
});
