import React, { useState } from 'react';
import LocationCard from './LocationCard';
import LocationModal from './LocationModal';
import { Container } from 'react-bootstrap';
import PlaceService from '../services/PlaceService';
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import GeoService from '../services/GeoService';
import HistoryService from '../services/HistoryService';

const sampleData = [

];

function LocationList() {
  const [favorites, setFavorites] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [directions, setDirections] = useState(null);
  const [routeRequest, setRouteRequest] = useState(null);
  const [routeError, setRouteError] = useState(null);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const openModal = async (place) => {
    try {
      setLoading(true);
      setError(null);
      const placeData = await PlaceService.getPlaceById(place.id);
      setSelectedPlace(placeData);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading place details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buildRoute = async (destinationCoords) => {
    try {
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
    <Container fluid className="my-4" style={{ paddingTop: '0px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxHeight: '60vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {sampleData.map((place) => (
          <div key={place.id} style={{ width: '100%', maxWidth: '23%' }}>
            <LocationCard
              image={place.image}
              title={place.title}
              distance={place.distance}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={() => toggleFavorite(place.id)}
              onClick={() => openModal(place)}
            />
          </div>
        ))}
      </div>

      <LocationModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedPlace(null);
          setDirections(null);
          setRouteRequest(null);
        }}
        place={selectedPlace}
        onBuildRoute={() => {
          if (selectedPlace?.coordinates?.lat && selectedPlace?.coordinates?.lng) {
            buildRoute({ lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng });
          }
        }}
      />
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
      {routeError && (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }} className="alert alert-danger">
          {routeError}
        </div>
      )}
    </Container>
  );
}

export default LocationList;
