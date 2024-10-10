"use client";

import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer } from 'react-leaflet';

const InteractableMap = () => {
    return (
        <div className="flex min-h-full min-w-full grow">
            <MapContainer attributionControl={true} className='w-full h-full' center={[33.793332, -117.851475]} zoom={16} scrollWheelZoom={true} >
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
            </MapContainer>
        </div>
    );
}

export default InteractableMap;