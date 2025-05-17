import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api'; 

const mapContainerStyle = {
  width: '75%',
  height: 'calc(100vh - 56px)',
  position: 'absolute',
  top: '63px',
  left: '25%',
};

const defaultCenter = {
  lat: 50.4501,
  lng: 30.5234,
};

function MapComponent() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={selectedLocation || defaultCenter}
      zoom={10}
      onClick={handleMapClick}
    >
      {(selectedLocation || defaultCenter) && (
        <Marker position={selectedLocation || defaultCenter} />
      )}
    </GoogleMap>
  );
}

export default MapComponent;
