import React, { useState } from 'react';
import LocationCard from './LocationCard';
import { Container } from 'react-bootstrap';

const sampleData = [
  { id: 1, title: 'Назва 1', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '100 км' },
  { id: 2, title: 'Назва 2', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '120 км' },
  { id: 3, title: 'Назва 3', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '140 км' },
  { id: 4, title: 'Назва 4', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '160 км' },
  { id: 5, title: 'Назва 5', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '180 км' },
];

function LocationList() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <Container fluid className=" my-4" style={{ paddingTop: '0px' }}>
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
          <div
            key={place.id}
            style={{
              width: '100%',
              maxWidth: '23%',
            }}
          >
            <LocationCard
              image={place.image}
              title={place.title}
              distance={place.distance}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={() => toggleFavorite(place.id)}
              onClick={() => alert(`Перехід до: ${place.title}`)}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}

export default LocationList;
