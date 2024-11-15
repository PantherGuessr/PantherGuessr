"use client";

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L, { LatLng } from 'leaflet';
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useGame } from "../_context/GameContext";

const InteractableMap = () => {
  const {
    markerHasBeenPlaced,
    setMarkerHasBeenPlaced,
    isSubmittingGuess,
    setMarkerPosition,
    correctLocation,
  } = useGame()!;
  const [localMarkerPosition, setLocalMarkerPosition] = useState<LatLng | null>(null);

  const pantherGuessrMarkerIcon = new L.Icon({
    iconUrl: '/PantherGuessrPin.svg',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  const correctLocationPinMarker = new L.Icon({
    iconUrl: '/CorrectPin.svg',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  /**
   * Handles placing the marker on the map when the user clicks on the map
   */
  function LocationMarker() {
    useMapEvents({
      click(e) {
        if(!isSubmittingGuess && !correctLocation) {
          const position = e.latlng;
          setLocalMarkerPosition(position);
          setMarkerPosition(position);
          setMarkerHasBeenPlaced(true);
        }
      }
    });

    /**
     * Resets the local marker position if the marker has not been placed
     */
    useEffect(() => {
      if(!markerHasBeenPlaced) {
        setLocalMarkerPosition(null);
      }
    });

    /**
     * Renders the marker on the map if the local marker position is not null
     */
    return localMarkerPosition === null ? null : (
      <>
        <Marker icon={pantherGuessrMarkerIcon} position={localMarkerPosition} />
        <CircleMarker center={localMarkerPosition} pathOptions={{ color: '#a50034' }} radius={3} />
      </>
    );
  }

  /**
   * Centers the map on the line between the local marker position and the correct location
   */
  function CenterMapOnLine({ localMarkerPosition, correctLocation }: { localMarkerPosition: LatLng | null, correctLocation: LatLng }) {
    const map = useMap();
    
    useEffect(() => {
      if (localMarkerPosition && correctLocation) {
        const midpoint = new LatLng(
          (localMarkerPosition.lat + correctLocation.lat) / 2,
          (localMarkerPosition.lng + correctLocation.lng) / 2
        );
        map.setView(midpoint, map.getZoom());
      }
    }, [localMarkerPosition, correctLocation, map]);
    
    return null;
  }
    
  return (
    <div className="flex min-h-full min-w-full grow">
      <MapContainer
        className='w-full h-full rounded-md'
        attributionControl={true}
        center={[33.793332, -117.851475]}
        zoom={16}
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
        {correctLocation && localMarkerPosition && (
          <>
            <Marker icon={correctLocationPinMarker} position={correctLocation} zIndexOffset={1000}/>
            <CircleMarker center={correctLocation} pathOptions={{ color: '#a50034' }} radius={3} />
            <Polyline positions={[localMarkerPosition, correctLocation]} color="#a50034" />
            <CenterMapOnLine localMarkerPosition={localMarkerPosition} correctLocation={correctLocation} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default InteractableMap;