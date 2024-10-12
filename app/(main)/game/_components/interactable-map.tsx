"use client";

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L, { LatLng } from 'leaflet';
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMapEvents } from 'react-leaflet';
import { useGame } from "../_context/GameContext";

const InteractableMap = () => {
    const { markerHasBeenPlaced, setMarkerHasBeenPlaced, isSubmittingGuess, setMarkerPosition, correctLocation, markerPosition } = useGame()!;
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

    function LocationMarker() {
        useMapEvents({
            click(e) {
                if(!isSubmittingGuess) {
                    const position = e.latlng;
                    setLocalMarkerPosition(position);
                    setMarkerPosition(position);
                    setMarkerHasBeenPlaced(true);

                    console.log(e.latlng);
                }
            }
        });

        return localMarkerPosition === null ? null : (
            <>
                <Marker icon={pantherGuessrMarkerIcon} position={localMarkerPosition} />
                <CircleMarker center={localMarkerPosition} pathOptions={{ color: '#a50034' }} radius={3} />
            </>
        )
    }
    
    return (
        <div className="flex min-h-full min-w-full grow">
            <MapContainer
                className='w-full h-full'
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
                        <Marker icon={correctLocationPinMarker} position={correctLocation} />
                        <CircleMarker center={correctLocation} pathOptions={{ color: '#a50034' }} radius={3} />
                        <Polyline positions={[localMarkerPosition, correctLocation]} color="#a50034" />
                    </>
                )}
            </MapContainer>
        </div>
    );
}

export default InteractableMap;