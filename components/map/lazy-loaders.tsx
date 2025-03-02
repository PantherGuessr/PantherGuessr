import dynamic from "next/dynamic";

export const LazyMap = dynamic(() => import("./leaflet-map"), { ssr: false, loading: () => <p>Loading...</p> });

export const LazyMarker = dynamic(async () => (await import("react-leaflet")).Marker, {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const LazyCircleMarker = dynamic(async () => (await import("react-leaflet")).CircleMarker, {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const LazyLocationMarker = dynamic(() => import("./location-marker"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
