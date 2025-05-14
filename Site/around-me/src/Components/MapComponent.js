// MapComponent.js
import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api'; // ⬅️ Без LoadScript

const mapContainerStyle = {
  width: '75%',
  height: 'calc(100vh - 56px)',
  position: 'absolute',
  top: '63px',
  left: '25%',
};

const center = {
  lat: 50.4501,
  lng: 30.5234,
};

function MapComponent() {
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={10}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default MapComponent;
