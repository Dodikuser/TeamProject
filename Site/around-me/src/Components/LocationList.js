import React, { useState } from 'react';
import LocationCard from './LocationCard';
import { Container } from 'react-bootstrap';

const sampleData = [
  {
    id: 1,
    title: 'Заклад',
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    distance: '100 км',
  },
  {
    id: 2,
    title: 'Заклад2',
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    distance: '100 км',
  },
  {
    id: 3,
    title: 'Заклад3',
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    distance: '100 км',
  },
  {
    id: 4,
    title: 'Заклад4',
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    distance: '100 км',
  },
  {
    id: 5,
    title: 'Заклад5',
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    distance: '100 км',
  },
];

function LocationList() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Inline стили для прокручиваемого блока
  const scrollContainerStyle = {
    width: '230px',
    backgroundColor: 'white',
    borderRadius: '12px',
    
    padding: '16px',
    height: '62vh',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: '#ccc transparent',
  };

  // webkit скролл стили через встроенный <style>
  const customScrollbarStyle = `
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 4px;
    }
  `;

  return (
    <Container className="mt-4">
      <style>{customScrollbarStyle}</style>

      <div style={scrollContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sampleData.map((place) => (
            <LocationCard
              key={place.id}
              image={place.image}
              title={place.title}
              distance={place.distance}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={() => toggleFavorite(place.id)}
              onClick={() => alert(`Перехід до: ${place.title}`)}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default LocationList;
