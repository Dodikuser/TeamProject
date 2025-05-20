import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import HistoryCard from '../Components/HistoryCard';

export default function History() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeTab, setActiveTab] = useState('visit');
  const [isIncognito, setIsIncognito] = useState(false);

  const historyPlaces = [
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Музей "Культура"',
      locationText: 'вул. Франка, 21',
      dateVisited: '15 травня 2025',
    },
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Галерея "АртПлюс"',
      locationText: 'вул. Дорошенка, 3',
      dateVisited: '14 травня 2025',
    },
    {
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      title: 'Парк "Зелений гай"',
      locationText: 'просп. Шевченка, 44',
      dateVisited: '12 травня 2025',
    },
    // добавь больше карточек для теста прокрутки
  ];

  const handleClear = (idx) => {
    alert(`Видалити історію з індексом ${idx}`);
  };

  const handleGoTo = (idx) => {
    alert(`Перейти до місця з індексом ${idx}`);
  };

  return (
    <Container
      fluid
      className="py-4 px-lg-5"
      style={{ backgroundColor: '#E7E0EC', height: '100vh', overflow: 'hidden' }}
    >
      {/* Панель вкладок, поиск и инкогнито */}
      <Row className="mb-4">
        <Col xs={12}>
          <div className="bg-white p-3 rounded-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center">
            <div className="d-flex gap-2 mb-2 mb-md-0 align-items-center">
              <Button
                variant={activeTab === 'visit' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('visit')}
              >
                Історія відвідування
              </Button>
              <Button
                variant={activeTab === 'search' ? 'primary' : 'outline-primary'}
                onClick={() => setActiveTab('search')}
              >
                Історія пошуку
              </Button>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{isIncognito ? 'Вимкнути інкогніто' : 'Увімкнути інкогніто'}</Tooltip>}
              >
                <Button
                  variant={isIncognito ? 'dark' : 'outline-dark'}
                  onClick={() => setIsIncognito(!isIncognito)}
                  className="d-flex align-items-center gap-1"
                >
                  <span className="material-symbols-outlined">
                    {isIncognito ? 'visibility_off' : 'visibility'}
                  </span>
                  Інкогніто
                </Button>
              </OverlayTrigger>
            </div>

            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
              <Form.Control
                type="search"
                placeholder={`Пошук в ${activeTab === 'visit' ? 'історії відвідування' : 'історії пошуку'}`}
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

      {/* Контент по вкладкам */}
   {activeTab === 'visit' && (
  <div
    style={{
      height: 'calc(100vh - 200px)', // учитываем высоту верхнего блока
      overflowY: 'auto',
      overflowX: 'hidden',
    }}
  >
    <Row className="g-4">
      {historyPlaces.map((place, idx) => (
        <Col key={idx} xs={12} md={6} lg={4} xl={3}>
          <HistoryCard
            image={place.image}
            title={place.title}
            locationText={place.locationText}
            dateVisited={place.dateVisited}
            onClear={() => handleClear(idx)}
            onGoTo={() => handleGoTo(idx)}
          />
        </Col>
      ))}
    </Row>
  </div>
)}


      {activeTab === 'search' && (
        <div className="text-center text-muted mt-5">
          <p>Тут буде історія пошуку.</p>
        </div>
      )}

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />
    </Container>
  );
}
