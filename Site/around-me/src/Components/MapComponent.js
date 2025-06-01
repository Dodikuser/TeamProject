import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api'; 
import GeoService from '../services/GeoService';
import MapStateService from '../services/MapStateService';

const mapContainerStyle = {
  width: '75%',
  height: '100vh',
  position: 'absolute',
  left: '25%',
  top: 0,
};

function MapComponent() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [defaultCenter, setDefaultCenter] = useState({ lat: 50.4501, lng: 30.5234 });
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  useEffect(() => {
    // Подписка на MapStateService
    const unsubscribe = MapStateService.subscribe(({ center, markers }) => {
      if (center && center.lat && center.lng) {
        setSelectedLocation(center);
      }
      if (Array.isArray(markers)) {
        setMarkers(markers);
        console.log(markers);
      }
    });

    // При первом рендере — если нет центра, пробуем геолокацию
    if (!selectedLocation) {
      GeoService.getCurrentPosition()
        .then(({ lat, lng }) => {
          setDefaultCenter({ lat, lng });
        })
        .catch(() => {
          setDefaultCenter({ lat: 50.4501, lng: 30.5234 });
        });
    }

    return () => unsubscribe();
  }, [selectedLocation]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={selectedLocation || defaultCenter}
      zoom={10}
      onClick={handleMapClick}
      options={{
        streetViewControl: false // Отключает значок просмотра улиц
      }}
    >
      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker} />
      ))}
      {selectedLocation && !markers.some(m => m.lat === selectedLocation.lat && m.lng === selectedLocation.lng) && (
        <Marker position={selectedLocation} />
      )}
    </GoogleMap>
  );
}

export default MapComponent;
