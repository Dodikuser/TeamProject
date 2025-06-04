import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'; 
import GeoService from '../services/GeoService';
import MapStateService from '../services/MapStateService';
import PlaceService from '../services/PlaceService';
import LocationModal from './LocationModal';

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
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [routeRequest, setRouteRequest] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

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
          setUserCoords({ lat, lng });
        })
        .catch(() => {
          setDefaultCenter({ lat: 50.4501, lng: 30.5234 });
        });
    } else if (!userCoords) {
      // Если selectedLocation есть, но userCoords ещё нет
      GeoService.getCurrentPosition()
        .then(({ lat, lng }) => setUserCoords({ lat, lng }))
        .catch(() => {});
    }

    return () => unsubscribe();
  }, [selectedLocation]);

  const handleMarkerClick = async (marker) => {
    console.log('marker:', marker);
    try {
      setShowModal(false);
      setSelectedPlace(null);
      setDirections(null);
      setRouteRequest(null);
      // marker должен содержать id или gmapsPlaceId
      const placeId = marker.id || marker.gmapsPlaceId;
      if (!placeId) {
        console.log('ID места не найден');
        return;
      }
      const placeData = await PlaceService.getPlaceById(placeId);
      setSelectedPlace(placeData);
      setShowModal(true);
    } catch (err) {
      alert('Не удалось загрузить детали места');
    }
  };

  // Функция для построения маршрута
  const buildRoute = async (destinationCoords) => {
    try {
      console.log('buildRoute');
      const { lat, lng } = await GeoService.getCurrentPosition();
      setRouteError(null);
      setDirections(null);
      setRouteRequest({
        origin: { lat, lng },
        destination: destinationCoords,
        travelMode: 'DRIVING',
      });
    } catch {
      setRouteError('Не удалось определить координаты пользователя');
    }
  };

  return (
    <>
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
          <Marker
            key={idx}
            position={marker}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}
        {selectedLocation && !markers.some(m => m.lat === selectedLocation.lat && m.lng === selectedLocation.lng) && (
          <Marker position={selectedLocation} />
        )}
        {routeRequest && (
          <DirectionsService
            options={routeRequest}
            callback={(result, status) => {
              if (status === 'OK') {
                setDirections(result);
              } else {
                setRouteError('Не удалось построить маршрут');
              }
            }}
          />
        )}
        {directions && (
          <DirectionsRenderer options={{ directions }} />
        )}
      </GoogleMap>
      <LocationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        place={selectedPlace}
        onBuildRoute={() => {
          if (selectedPlace?.coordinates?.lat && selectedPlace?.coordinates?.lng) {
            
            buildRoute({ lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng });
          }
        }}
      />
      {routeError && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }} className="alert alert-danger">
          {routeError}
        </div>
      )}
    </>
  );
}

export default MapComponent;
