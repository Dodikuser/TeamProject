import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import MyPlaceCard from '../Components/MyPlaceCard';
import AddPlaceModal from '../Components/AddPlaceModal';

const MyPlaces = () => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([
    {
      title: 'Кавʼярня Aroma',
      locationText: 'Київ, вул. Саксаганського, 30',
      rating: 4,
      distance: '1.2 км',
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      email: 'aroma@coffee.com',
      phone: '+380501112233',
      schedule: '08:00 - 20:00',
      description: 'Затишна кавʼярня з десертами',
    },
    {
      title: 'Піцерія Napoli',
      locationText: 'Львів, площа Ринок, 12',
      rating: 5,
      distance: '2.5 км',
      image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
      email: 'napoli@pizza.com',
      phone: '+380631234567',
      schedule: '10:00 - 23:00',
      description: 'Найкраща неаполітанська піца у місті',
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [newPlace, setNewPlace] = useState({
    title: '',
    locationText: '',
    rating: 3,
    distance: '',
    image: '',
    email: '',
    phone: '',
    schedule: '',
    description: '',
  });

  const resetForm = () => {
    setNewPlace({
      title: '',
      locationText: '',
      rating: 3,
      distance: '',
      image: '',
      email: '',
      phone: '',
      schedule: '',
      description: '',
    });
    setEditIndex(null);
  };
const [showConfirmModal, setShowConfirmModal] = useState(false);
  

  const handleSavePlace = () => {
    if (editIndex === null) return;
    const updatedPlaces = [...places];
    updatedPlaces[editIndex] = newPlace;
    setPlaces(updatedPlaces);
    resetForm();
    setShowEditModal(false);
  };

  const handleDelete = (index) => {
    const updated = [...places];
    updated.splice(index, 1);
    setPlaces(updated);
  };

  const handleEditPlace = (index) => {
    setEditIndex(index);
    setNewPlace(places[index]);
    setShowEditModal(true);
  };

  const filteredPlaces = places.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: "'Righteous', sans-serif" }} className="mb-4">{t('my_places')}</h2>

      {/* Панель пошуку, фільтрів, сортування */}
      <div className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
  <div className="d-flex gap-2 flex-wrap">
    <Button
      variant="outline-secondary"
      className="d-flex align-items-center gap-2 py-1"
      onClick={() => setShowFilters(true)}
    >
      <span className="material-symbols-outlined" style={{ lineHeight: '1.2', fontSize: '20px' }}>
        filter_list
      </span>
      <span>{t('filters')}</span>
    </Button>
    <Button
      variant="outline-secondary"
      className="d-flex align-items-center gap-2 py-1"
      onClick={() => setShowSort(true)}
    >
      <span className="material-symbols-outlined" style={{ lineHeight: '1.2', fontSize: '20px' }}>
        sort
      </span>
      <span>{t('sort')}</span>
    </Button>
  </div>

  <div className="position-relative flex-grow-1" style={{ maxWidth: '500px', minWidth: '250px' }}>
    <Form.Control
      type="search"
      placeholder={t('search')}
      className="ps-3 pe-5"
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
    <span
      className="material-symbols-outlined position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
      style={{ pointerEvents: 'none', lineHeight: '1', fontSize: '20px' }}
    >
      search
    </span>
  </div>
</div>


      {/* Список місць */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center text-muted py-5">{t('no_places')}</div>
      ) : (
        <Row>
          {filteredPlaces.map((place, idx) => (
            <Col key={idx} xs={12} md={6} lg={4} xl={3} className="mb-4">
              <div onClick={() => handleEditPlace(idx)} style={{ cursor: 'pointer' }}>
               <MyPlaceCard
                {...place}
                onDelete={() => {
                    setDeleteIndex(idx);
                    setShowConfirmModal(true);
                }}
                />

              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Модалка редагування */}
      <AddPlaceModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSave={handleSavePlace}
        newPlace={newPlace}
        setNewPlace={setNewPlace}
      />

      {/* Бокові панелі */}
      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
  <Modal.Body className="text-center py-4">
    <p className="fs-5 mb-4">{t('confirm_delete_place')}</p>
    <div className="d-flex justify-content-center gap-3">
      <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
        {t('cancel')}
      </Button>
      <Button
        variant="danger"
        onClick={() => {
          if (deleteIndex !== null) {
            handleDelete(deleteIndex);
            setDeleteIndex(null);
            setShowConfirmModal(false);
          }
        }}
      >
        {t('yes_delete')}
      </Button>
    </div>
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default MyPlaces;
