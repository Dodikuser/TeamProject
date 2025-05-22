import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import VisitHistory from '../Components/VisitHistory';
import SearchHistory from '../Components/SearchHistory';

export default function History() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeTab, setActiveTab] = useState('visit');
  const [isIncognito, setIsIncognito] = useState(false);

  const [searchTerm, setSearchTerm] = useState(''); // <-- состояние для поиска

  const [historyPlaces, setHistoryPlaces] = useState([
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
    
  ]);

  const [searchHistory, setSearchHistory] = useState([
    { query: 'музеї Львова', date: '20 травня 2025', time: '15:30' },
    { query: 'куди піти на вихідні', date: '19 травня 2025', time: '10:15' },
    { query: 'ресторани поруч', date: '18 травня 2025', time: '21:05' },
    { query: 'музеї Львова', date: '20 травня 2025', time: '15:30' },
    { query: 'куди піти на вихідні', date: '19 травня 2025', time: '10:15' },
    { query: 'ресторани поруч', date: '18 травня 2025', time: '21:05' },
    { query: 'музеї Львова', date: '20 травня 2025', time: '15:30' },
    { query: 'куди піти на вихідні', date: '19 травня 2025', time: '10:15' },
    { query: 'ресторани поруч', date: '18 травня 2025', time: '21:05' },
  ]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmText, setConfirmText] = useState('');

  const openConfirmModal = (text, action) => {
    setConfirmText(text);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleClearVisit = (idx) => {
    openConfirmModal('Ви дійсно хочете видалити цю історію відвідування?', () =>
      setHistoryPlaces((prev) => prev.filter((_, i) => i !== idx))
    );
  };

  const handleGoToVisit = (idx) => {
    alert(`Перейти до місця з індексом ${idx}`);
  };

  const handleClearSearch = (idx) => {
    openConfirmModal('Ви дійсно хочете видалити цей пошуковий запит?', () =>
      setSearchHistory((prev) => prev.filter((_, i) => i !== idx))
    );
  };

  const handleGoToSearch = (query) => {
    alert(`Пошук за запитом: "${query}"`);
  };

  const clearAllHistory = () => {
    openConfirmModal('Ви дійсно хочете повністю очистити історію?', () => {
      setHistoryPlaces([]);
      setSearchHistory([]);
    });
  };

 
  const filteredHistoryPlaces = historyPlaces.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.locationText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSearchHistory = searchHistory.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', height: '90vh', display: 'flex', flexDirection: 'column' }}>
      <Row className="mb-4 flex-shrink-0" style={{ height: '90px' }}>
        <Col xs={12}>
          <div className="bg-white p-3 rounded-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center h-100">
            <div className="d-flex gap-2 mb-2 mb-md-0 align-items-center">
              <Button variant={activeTab === 'visit' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('visit')}>Історія відвідування</Button>
              <Button variant={activeTab === 'search' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('search')}>Історія пошуку</Button>
            </div>
            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
              <Form.Control
                type="search"
                placeholder={`Пошук в ${activeTab === 'visit' ? 'історії відвідування' : 'історії пошуку'}`}
                className="ps-3 pe-5"
                style={{ borderRadius: '8px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-muted" style={{ pointerEvents: 'none' }}>search</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ flex: 1, overflow: 'hidden', height: 'calc(90vh - 80px)' }}>
        <Col xs="auto" className="d-flex flex-column gap-3" style={{ paddingLeft: 0, flexShrink: 0 }}>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{isIncognito ? 'Вимкнути інкогніто' : 'Увімкнути інкогніто'}</Tooltip>}>
            <Button variant={isIncognito ? 'dark' : 'outline-dark'} onClick={() => setIsIncognito(!isIncognito)} className="d-flex align-items-center gap-1" style={{ minWidth: '130px' }}>
              <span className="material-symbols-outlined">{isIncognito ? 'visibility_off' : 'visibility'}</span>
              Інкогніто
            </Button>
          </OverlayTrigger>
          <Button variant="outline-danger" onClick={clearAllHistory} style={{ minWidth: '130px' }}>Очистити історію</Button>
        </Col>

        <Col style={{ overflowY: 'auto', paddingRight: '10px', height: '100%' }}>
          {activeTab === 'visit' ? (
            <VisitHistory places={filteredHistoryPlaces} onClear={handleClearVisit} onGoTo={handleGoToVisit} />
          ) : (
            <SearchHistory searches={filteredSearchHistory} onClearSearch={handleClearSearch} onGoToSearch={handleGoToSearch} />
          )}
        </Col>
      </Row>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Body className="text-center py-4">
          <p className="fs-5 mb-4">{confirmText}</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Скасувати</Button>
            <Button variant="danger" onClick={() => { confirmAction(); setShowConfirmModal(false); }}>Так, видалити</Button>
          </div>
        </Modal.Body>
      </Modal>

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />

      <style>{`
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
      `}</style>
    </Container>
  );
}
