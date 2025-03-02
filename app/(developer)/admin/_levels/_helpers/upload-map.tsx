// "use client";

// import { Suspense } from "react";
// import L from "leaflet";

// import { LazyLocationMarker, LazyMap } from "@/components/map/lazy-loaders";
// import LeafletStyles from "@/components/map/leaflet-styles";
// import MarkerSetup from "@/components/map/marker-setup";
// // import { useMarker } from "./MarkerContext";

// interface UploadMapProps {
//   markerHasBeenPlaced: boolean;
//   setMarkerHasBeenPlaced: (placed: boolean) => void;
//   pantherGuessrMarkerIcon: L.Icon | null;
//   setPantherGuessrMarkerIcon: (icon: L.Icon) => void;
// }

// const UploadMap = ({
//   markerHasBeenPlaced,
//   setMarkerHasBeenPlaced,
//   pantherGuessrMarkerIcon,
//   setPantherGuessrMarkerIcon,
// }: UploadMapProps) => {
//   // const { localMarkerPosition, setLocalMarkerPosition } = useMarker();

//   return (
//     <div className="flex min-h-full min-w-full grow">
//       {/* <LeafletStyles />
//       <Suspense fallback={<div className="h-[200px]">Loading...</div>}>
//         <LazyMap
//           className="w-full h-full rounded-md"
//           attributionControl={true}
//           center={[33.793332, -117.851475]}
//           zoom={16}
//           scrollWheelZoom={true}
//           doubleClickZoom={true}
//         >
//           <MarkerSetup onIconCreate={setPantherGuessrMarkerIcon} />
//           {pantherGuessrMarkerIcon && (
//             <Suspense fallback={<></>}>
//               <LazyLocationMarker
//                 localMarkerPosition={localMarkerPosition}
//                 setLocalMarkerPosition={(pos) => {
//                   setLocalMarkerPosition(pos);
//                   setMarkerHasBeenPlaced(true);
//                 }}
//                 markerHasBeenPlaced={markerHasBeenPlaced}
//                 pantherGuessrMarkerIcon={pantherGuessrMarkerIcon}
//               />
//             </Suspense>
//           )}
//         </LazyMap>
//       </Suspense> */}
//     </div>
//   );
// };

// export default UploadMap;
