"use client";

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

const InteractableMap = () => {
    const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

    const pantherGuessrMarkerIcon = new L.Icon({
        iconUrl: '/PantherGuessrPin.svg',
        iconSize: [48, 48],
        iconAnchor: [24, 48],
    });

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setMarkerPosition(e.latlng);
            }
        });

        return markerPosition === null ? null : (
            <Marker icon={pantherGuessrMarkerIcon} position={markerPosition} />
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
            </MapContainer>
        </div>
    );
}

export default InteractableMap;