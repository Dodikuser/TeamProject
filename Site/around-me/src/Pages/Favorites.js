import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

// Карточка одного місця
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
          <Button size="sm" variant="outline-primary" onClick={onGoTo}>
            Перейти
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// Главный компонент страницы Улюблене
export default function Favorites() {
  // Пример массива данных
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
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Ресторан "Гармонія"',
      locationText: 'пл. Ринок, 5',
      rating: 3,
      distance: '0.9 км',
    },
  ];

  // Обработчик удаления
  const handleDelete = (idx) => {
    alert(`Видалити місце з індексом ${idx}`);
  };

  // Обработчик перехода
  const handleGoTo = (idx) => {
    alert(`Перейти до місця з індексом ${idx}`);
  };

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#CAC4D0', minHeight: '100vh' }}>
      {/* Панель фільтрів і пошуку */}
     <div className="bg-white p-3 rounded-3 mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3 shadow-sm">
  {/* Левая часть: кнопки */}
  <div className="d-flex gap-2">
    <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
      <span className="material-symbols-outlined">filter_list</span> Фільтри
    </Button>
    <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
      <span className="material-symbols-outlined">sort</span> Сортувати
    </Button>
  </div>

  {/* Правая часть: поиск */}
  <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
    <Form.Control
      type="search"
      placeholder="Пошук"
      className="ps-3 pe-5"
      style={{ borderRadius: '8px' }} // без скруглений
    />
    <span
      className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
      style={{ pointerEvents: 'none' }}
    >
      search
    </span>
  </div>
</div>

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
    </Container>
  );
}
