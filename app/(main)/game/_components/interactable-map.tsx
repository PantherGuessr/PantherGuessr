"use client";

import L, { LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";

import { useGame } from "../_context/GameContext";
import "./interactable-map.css";

const InteractableMap = () => {
  const { markerHasBeenPlaced, setMarkerHasBeenPlaced, isSubmittingGuess, setMarkerPosition, correctLocation } =
    useGame()!;
  const [localMarkerPosition, setLocalMarkerPosition] = useState<LatLng | null>(null);
  const prevCorrectLocation = useRef<LatLng | null>(null);

  const pantherGuessrMarkerIcon = new L.Icon({
    iconUrl: "/PantherGuessrPin.svg",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  const correctLocationPinMarker = new L.Icon({
    iconUrl: "/CorrectPin.svg",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  /**
   * Handles placing the marker on the map when the user clicks on the map
   */
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if (!isSubmittingGuess && !correctLocation) {
          const position = e.latlng;
          setLocalMarkerPosition(position);
          setMarkerPosition(position);
          setMarkerHasBeenPlaced(true);
        }
      },
    });

    /**
     * Resets the local marker position if the marker has not been placed
     */
    useEffect(() => {
      if (!markerHasBeenPlaced) {
        setLocalMarkerPosition(null);
      }
    });

    /**
     * Renders the marker on the map if the local marker position is not null
     */
    return localMarkerPosition === null ? null : (
      <>
        <Marker icon={pantherGuessrMarkerIcon} position={localMarkerPosition} />
        <CircleMarker center={localMarkerPosition} pathOptions={{ color: "#a50034" }} radius={3} />
      </>
    );
  }

  /**
   * Centers the map on the line between the local marker position and the correct location
   */
  function CenterMapOnLine({
    localMarkerPosition,
    correctLocation,
  }: {
    localMarkerPosition: LatLng | null;
    correctLocation: LatLng;
  }) {
    const map = useMap();

    useEffect(() => {
      if (localMarkerPosition && correctLocation) {
        map.fitBounds(
          [
            [localMarkerPosition.lat, localMarkerPosition.lng],
            [correctLocation.lat, correctLocation.lng],
          ],
          {
            padding: [50, 50],
            maxZoom: 18,
            animate: true,
            duration: 0.5,
          }
        );
      }
    }, [localMarkerPosition, correctLocation, map]);

    return null;
  }

  /**
   * Centers the map on the correct location when the round ends
   */
  function CenterMapOnNewRound({
    localMarkerPosition,
    correctLocation,
    prevCorrectLocation,
  }: {
    localMarkerPosition: LatLng | null;
    correctLocation: LatLng | null;
    prevCorrectLocation: MutableRefObject<LatLng | null>;
  }) {
    const map = useMap();

    useEffect(() => {
      if (prevCorrectLocation.current && !correctLocation) {
        const globalCenter = new LatLng(33.793332, -117.851475);
        map.setView(globalCenter, 17);
      }
      prevCorrectLocation.current = correctLocation;
    }, [localMarkerPosition, correctLocation, map, prevCorrectLocation]);

    return null;
  }

  return (
    <div className="flex min-h-full min-w-full grow fade-in-map">
      <MapContainer
        className="w-full h-full rounded-md"
        attributionControl={true}
        center={[33.793332, -117.851475]}
        zoom={17}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /**
           * Set the Style to the default one. if we want to use the humanitarian style,
           * we should switch the url to https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
           *
           * I also found this map: https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png
           * which is completely blank with only buildings but it seems off. We can look into improving the map
           * at a later date since the functionality will remain the
           */
        />
        <LocationMarker />
        <CenterMapOnNewRound
          localMarkerPosition={localMarkerPosition}
          correctLocation={correctLocation}
          prevCorrectLocation={prevCorrectLocation}
        />
        {correctLocation && localMarkerPosition && (
          <>
            <Marker icon={correctLocationPinMarker} position={correctLocation} zIndexOffset={1000} />
            <CircleMarker center={correctLocation} pathOptions={{ color: "#a50034" }} radius={3} />
            <Polyline positions={[localMarkerPosition, correctLocation]} color="#a50034" />
            <CenterMapOnLine localMarkerPosition={localMarkerPosition} correctLocation={correctLocation} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default InteractableMap;
