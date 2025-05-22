import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import FavoritesCard from '../Components/FavoritesCard';

export default function Favorites() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [favoritePlaces, setFavoritePlaces] = useState([
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
  ]);

  
  const [searchTerm, setSearchTerm] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleDelete = (idx) => {
    setDeleteIndex(idx);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    setFavoritePlaces(prev => prev.filter((_, i) => i !== deleteIndex));
    setShowConfirmModal(false);
    setDeleteIndex(null);
  };

  const handleGoTo = (idx) => {
    alert(`Перейти до місця з індексом ${idx}`);
  };

 
  const filteredPlaces = favoritePlaces.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '90vh' }}>
      <Row className="mb-4">
        <Col xs={12}>
          <div className="bg-white p-3 rounded-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-3">
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
                placeholder="Пошук"
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
        </Col>
      </Row>

      <Row>
        {filteredPlaces.length === 0 ? (
          <Col xs={12} className="text-center py-5 text-muted fs-6">
            Улюблених поки немає
          </Col>
        ) : (
          filteredPlaces.map((place, idx) => (
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
          ))
        )}
      </Row>

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p className="fs-5 mb-4">Ви дійсно хочете видалити улюблене?</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              Скасувати
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Так, видалити
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
