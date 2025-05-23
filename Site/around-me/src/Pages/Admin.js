import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import AdminCard from '../Components/AdminCard';
import StatisticAdmin from '../Components/StatisticAdmin';

const Admin = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState('');
  const [placeId, setPlaceId] = useState('');

  // NEW: Модальное окно статистики
  const [showStatisticModal, setShowStatisticModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleLinkUser = () => {
    alert(`Зв'язано UserID: ${userId} із PlaceID: ${placeId}`);
  };

  const [places] = useState([
    {
      id: 1,
      title: 'Назва місця 1',
      locationText: 'м. Київ',
      rating: 4,
      distance: '100 км',
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    },
    {
      id: 2,
      title: 'Назва місця 2',
      locationText: 'м. Київ',
      rating: 3,
      distance: '150 км',
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    },
    {
      id: 3,
      title: 'Інша назва',
      locationText: 'м. Львів',
      rating: 5,
      distance: '200 км',
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    },
    {
      id: 4,
      title: 'Назва місця 4',
      locationText: 'м. Одеса',
      rating: 2,
      distance: '300 км',
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    },
  ]);

  const filteredPlaces = places.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleOpenStatistic = (place) => {
    setSelectedPlace(place);
    setShowStatisticModal(true);
  };

  return (
    <div style={{ backgroundColor: '#f1eaea', minHeight: '100vh' }}>
      <Container fluid className="p-4">
        {/* Заголовок и блок связывания */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h4 className="fw-bold m-0">Панель адміністратора</h4>
          <div className="bg-white p-2 rounded-3 shadow-sm d-flex align-items-center gap-2">
            <div>Зв’язати користувача із закладом</div>
            <Form.Control
              type="number"
              placeholder="UserID"
              style={{ width: '100px' }}
              value={userId}
              onChange={e => setUserId(e.target.value)}
            />
            <span className="fw-bold">+</span>
            <Form.Control
              type="number"
              placeholder="PlaceID"
              style={{ width: '100px' }}
              value={placeId}
              onChange={e => setPlaceId(e.target.value)}
            />
            <Button variant="success" onClick={handleLinkUser}>ok</Button>
          </div>
        </div>

        {/* Панель фильтров и поиска */}
        <div className="bg-white p-3 rounded-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div className="d-flex gap-2 flex-wrap">
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

          <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
            <Form.Control
              type="search"
              placeholder="Пошук за назвою..."
              className="ps-3 pe-5"
              style={{ borderRadius: '8px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span
              className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
              style={{ pointerEvents: 'none' }}
            >
              search
            </span>
          </div>
        </div>

        {/* Сетка карточек */}
        <Row xs={1} sm={2} md={3} lg={4}>
          {filteredPlaces.length === 0 ? (
            <Col xs={12} className="text-center py-5 text-muted fs-6">
              Місця не знайдені
            </Col>
          ) : (
            filteredPlaces.map(place => (
              <Col key={place.id} className="mb-4">
                <AdminCard
                  image={place.image}
                  title={place.title}
                  locationText={place.locationText}
                  rating={place.rating}
                  distance={place.distance}
                  onEdit={() => handleOpenStatistic(place)}
                />
              </Col>
            ))
          )}
        </Row>
      </Container>

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />

      {/* Модальное окно статистики */}
      <StatisticAdmin
        show={showStatisticModal}
        onHide={() => setShowStatisticModal(false)}
        place={selectedPlace}
      />
    </div>
  );
};

export default Admin;
