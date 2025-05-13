// MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '75%',
  height: 'calc(100vh - 56px)', 
  position: 'absolute',
  top: '56px', 
  left: '25%', 
};

const center = {
  lat: 50.4501,
  lng: 30.5234, 
};

function MapComponent() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCUsLj0t6zzykl9q2CgjBCU-sXxyJnuv5s">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
