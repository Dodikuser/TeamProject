import React, { useState } from 'react';
import LocationCard from './LocationCard';
import { Container, Row, Col } from 'react-bootstrap';

const sampleData = [
  { id: 1, title: 'Заклад 1', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '100 км' },
  { id: 2, title: 'Заклад 2', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '120 км' },
  { id: 3, title: 'Заклад 3', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '140 км' },
  { id: 4, title: 'Заклад 4', image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg', distance: '160 км' },
];

function LocationList() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <Container fluid className="my-4">
      <Row className="g-4">
        {sampleData.map((place) => (
          <Col key={place.id} xs={12} sm={6} md={4} lg={3}>
            <LocationCard
              image={place.image}
              title={place.title}
              distance={place.distance}
              isFavorite={favorites.includes(place.id)}
              onToggleFavorite={() => toggleFavorite(place.id)}
              onClick={() => alert(`Перехід до: ${place.title}`)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default LocationList;
