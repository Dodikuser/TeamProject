import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import MyPlaceCard from '../Components/MyPlaceCard';
import AddPlaceModal from '../Components/AddPlaceModal';
import UserService from '../services/UserService';

const MyPlaces = () => {
  const { t } = useTranslation();


  const [places, setPlaces] = useState([]);


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

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchMyPlaces = async () => {
      try {
        const response = await UserService.getMyPlaces();
        // Корректная обработка структуры ответа
        const placesArr = response?.result?.$values || [];
        setPlaces(placesArr.map(item => {
          let image = '';
          const getPhotoSrc = (photo) => {
            if (photo?.id) {
              return `https://localhost:7103/api/place/photo/${photo.id}`;
            }
            return photo?.path || 'https://via.placeholder.com/300x180?text=No+Image';
          };
          if (item.photos && item.photos.$values && item.photos.$values.length > 0) {
            image = getPhotoSrc(item.photos.$values[0]);
          } else if (item.photo) {
            image = getPhotoSrc(item.photo);
          } else {
            image = 'https://via.placeholder.com/300x180?text=No+Image';
          }
          return {
            title: item.name || 'Без названия',
            locationText: item.address || 'Адрес не указан',
            rating: item.stars,
            image,
            gmapsPlaceId: item.gmapsPlaceId,
            latitude: item.latitude,
            longitude: item.longitude,
            isFavorite: item.isFavorite,
            openingHours: Array.isArray(item.openingHours?.$values) ? item.openingHours.$values : (item.openingHours ? [item.openingHours] : []),
            description: item.description,
            site: item.site,
            phone: item.phoneNumber,
            email: item.email,
            radius: item.radius,
            tokensAvailable: item.tokensAvailable,
            lastPromotionDateTime: item.lastPromotionDateTime,
            userId: item.userId,
            photos: item.photos?.$values || [],
          };
        }));
      } catch (err) {
        setPlaces([]);
      }
    };
    fetchMyPlaces();
  }, []);

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


      {/* Список мест */}
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
