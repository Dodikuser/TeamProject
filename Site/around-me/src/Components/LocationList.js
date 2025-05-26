import React, { useState } from 'react';
import LocationCard from './LocationCard';
import LocationModal from './LocationModal';
import { Container } from 'react-bootstrap';
import PlaceService from '../services/PlaceService';

const sampleData = [

];

function LocationList() {
  const [favorites, setFavorites] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        }}
        place={selectedPlace}
      />
    </Container>
  );
}

export default LocationList;
