"use client";

export default function LeafletStyles() {
  return (
    <style jsx global>{`
      /* Leaflet styles */
      .leaflet-container {
        height: 100%;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
      }
      .leaflet-control-container .leaflet-routing-container-hide {
        display: none;
      }
      .leaflet-control-attribution {
        font-size: 10px;
      }
      /* Add more leaflet styles as needed */
    `}</style>
  );
}
