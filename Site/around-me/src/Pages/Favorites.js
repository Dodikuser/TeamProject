import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';

function FavoritesCard({
  image,
  title = 'Назва місця',
  locationText = 'Адреса закладу',
  rating = 4,
  distance = '100 км',
  onDelete,
  onGoTo,
}) {
  return (
    <Card className="shadow-sm border-0 h-100 rounded-3">
      <Card.Img
        variant="top"
        src={image}
        className="rounded-top"
        style={{ height: '180px', objectFit: 'cover' }}
        alt={title}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1 fs-6">{title}</Card.Title>
            <small className="text-muted d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">location_on</span> {locationText}
            </small>
          </div>
          <span
            className="material-symbols-outlined text-muted"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={onDelete}
            title="Видалити"
          >
            delete
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <div className="text-muted small mb-1 d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">distance</span>
              {distance}
            </div>
            <div className="text-warning" aria-label={`Рейтинг: ${rating} з 5`}>
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={onGoTo}
            className="custom-animated-button"
          >
            Перейти
          </Button>

          <style>
            {`
              .custom-animated-button {
                background-color: #626FC2;
                border-color: #626FC2;
                color: white;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
              }

              .custom-animated-button:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(98, 111, 194, 0.5);
              }

              .custom-animated-button:active {
                transform: scale(0.97);
                box-shadow: 0 2px 6px rgba(98, 111, 194, 0.5);
              }
            `}
          </style>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function Favorites() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const favoritePlaces = [
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Кав\'ярня "Смачна"',
      locationText: 'вул. Хрещатик, 10',
      rating: 5,
      distance: '1.2 км',
    },
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Піцерія "Італія"',
      locationText: 'просп. Свободи, 15',
      rating: 4,
      distance: '3.4 км',
    },
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Ресторан "Гармонія"',
      locationText: 'пл. Ринок, 5',
      rating: 3,
      distance: '0.9 км',
    },
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Ресторан "Гармонія"',
      locationText: 'пл. Ринок, 5',
      rating: 3,
      distance: '0.9 км',
    },
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Ресторан "Гармонія"',
      locationText: 'пл. Ринок, 5',
      rating: 3,
      distance: '0.9 км',
    },

  ];

  const handleDelete = (idx) => {
    alert(`Видалити місце з індексом ${idx}`);
  };

  const handleGoTo = (idx) => {
    alert(`Перейти до місця з індексом ${idx}`);
  };

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '100vh' }}>
      {/* Панель фільтрів і пошуку */}
    <Row className="mb-4 align-items-center g-3">

  <Col xs={12} md="auto">
    <div className="bg-white p-3 rounded-3 shadow-sm d-flex gap-2 flex-wrap">
      <Button
        variant="outline-secondary"
        className="d-flex align-items-center gap-2"
        onClick={() => setShowFilters(true)}
      >
        <span className="material-symbols-outlined">filter_list</span> Фільтри
      </Button>
      <Button
        variant="outline-secondary"
        className="d-flex align-items-center gap-2"
        onClick={() => setShowSort(true)}
      >
        <span className="material-symbols-outlined">sort</span> Сортувати
      </Button>
    </div>
  </Col>

  <Col xs={12} md>
    <div className="d-flex justify-content-center mb-5 mt-4">
           <div className="position-relative" style={{ width: '60%', maxWidth: '600px',  marginLeft: '-300px'  }}>
             <Form.Control
               type="search"
               placeholder="Пошук"
               className="ps-3 pe-5"
               style={{ borderRadius: '8px' }}
      />
      <span
        className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
        style={{ pointerEvents: 'none' }}
      >
        search
      </span>
      </div>
    </div>
  </Col>
</Row>

      <Row>
        {favoritePlaces.map((place, idx) => (
          <Col key={idx} xs={12} md={6} lg={4} xl={3} className="mb-4">
            <FavoritesCard
              image={place.image}
              title={place.title}
              locationText={place.locationText}
              rating={place.rating}
              distance={place.distance}
              onDelete={() => handleDelete(idx)}
              onGoTo={() => handleGoTo(idx)}
            />
          </Col>
        ))}
      </Row>

   
      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
<SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />

    </Container>
  );
}
