import React, { createContext, useContext, useState } from 'react';
import { LatLng } from 'leaflet';

interface MarkerContextType {
    localMarkerPosition: LatLng | null;
    setLocalMarkerPosition: (position: LatLng | null) => void;
}

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

export const MarkerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localMarkerPosition, setLocalMarkerPosition] = useState<LatLng | null>(null);

  return (
    <MarkerContext.Provider value={{ localMarkerPosition, setLocalMarkerPosition }}>
      {children}
    </MarkerContext.Provider>
  );
};

export const useMarker = () => {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error('useMarker must be used within a MarkerProvider');
  }
  return context;
};