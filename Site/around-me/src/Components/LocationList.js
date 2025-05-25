import React, { useState } from 'react';
import LocationCard from './LocationCard';
import LocationModal from './LocationModal'; // импортируй модалку
import { Container } from 'react-bootstrap';

const sampleData = [
  { id: 1, title: 'Назва ', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '100 км' },
  { id: 2, title: 'Назва ', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '100 км' },
];

function LocationList() {
  const [favorites, setFavorites] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const openModal = (place) => {
    setSelectedPlace(place);
    setShowModal(true);
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
              onClick={() => openModal(place)} // открытие модалки
            />
          </div>
        ))}
      </div>

      <LocationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        place={selectedPlace}
      />
    </Container>
  );
}

export default LocationList;
