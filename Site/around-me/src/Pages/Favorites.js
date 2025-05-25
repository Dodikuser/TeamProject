import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import FavoritesCard from '../Components/Cards/FavoritesCard';

const API_BASE_URL = 'https://localhost:7103/api';

export default function Favorites() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  
  // API related states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [take] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // Function to get auth token (adjust based on your auth implementation)
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  // Function to calculate distance (placeholder - replace with actual calculation)
  const calculateDistance = (lat, lng) => {
    // This is a placeholder. You should implement actual distance calculation
    // based on user's current location
    return `${(Math.random() * 10).toFixed(1)} км`;
  };

  // Function to transform API response to component format
  const transformFavoriteData = (apiData) => {
    return apiData.favorites.$values.map(favorite => ({
      id: favorite.placeDTO.gmapsPlaceId,
      image: favorite.placeDTO.photo?.path || 'https://via.placeholder.com/300x180?text=No+Image',
      title: favorite.placeDTO.name,
      locationText: favorite.placeDTO.address || 'Адреса не вказана',
      rating: favorite.placeDTO.stars || 0,
      distance: calculateDistance(favorite.placeDTO.latitude, favorite.placeDTO.longitude),
      favoritedAt: favorite.favoritedAt,
      placeDTO: favorite.placeDTO
    }));
  };

  // Function to load favorites from API
  const loadFavorites = async (skipCount = 0, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('Токен авторизації не знайдено');
      }

      const response = await fetch(`${API_BASE_URL}/Favorites/get?skip=${skipCount}&take=${take}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Необхідна авторизація');
        }
        throw new Error(`Помилка сервера: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = transformFavoriteData(data);

      if (isLoadMore) {
        setFavoritePlaces(prev => [...prev, ...transformedData]);
      } else {
        setFavoritePlaces(transformedData);
      }

      // Check if there are more items to load
      setHasMore(transformedData.length === take);
      
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load favorites on component mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Function to load more favorites
  const loadMoreFavorites = () => {
    const newSkip = skip + take;
    setSkip(newSkip);
    loadFavorites(newSkip, true);
  };

  // Function to refresh favorites
  const refreshFavorites = () => {
    setSkip(0);
    loadFavorites(0, false);
  };

  const handleDelete = (idx) => {
    setDeleteIndex(idx);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      const placeToDelete = filteredPlaces[deleteIndex];
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Токен авторизації не знайдено');
      }

      // API call to remove favorite
      const response = await fetch(`${API_BASE_URL}/Favorites/action?gmapsPlaceId=${placeToDelete.id}&action=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });


      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Необхідна авторизація');
        }
        throw new Error(`Помилка сервера: ${response.status}`);
      }

      // Remove from local state only after successful API call
      setFavoritePlaces(prev => prev.filter((_, i) => i !== deleteIndex));
      setShowConfirmModal(false);
      setDeleteIndex(null);
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Помилка при видаленні улюбленого місця');
      setShowConfirmModal(false);
      setDeleteIndex(null);
    }
  };

  const handleGoTo = (idx) => {
    const place = filteredPlaces[idx];
    // Here you would typically navigate to the place details or map
    alert(`Перейти до місця: ${place.title}`);
  };

  // Filter places based on search term
  const filteredPlaces = favoritePlaces.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && favoritePlaces.length === 0) {
    return (
      <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '91vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Завантаження улюблених місць...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '91vh' }}>
      {error && (
        <Row className="mb-3">
          <Col xs={12}>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <Alert.Heading>Помилка</Alert.Heading>
              <p>{error}</p>
              <Button variant="outline-danger" size="sm" onClick={refreshFavorites}>
                Спробувати знову
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

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
              <Button
                variant="outline-primary"
                className="d-flex align-items-center gap-2"
                onClick={refreshFavorites}
                disabled={loading}
              >
                <span className="material-symbols-outlined">refresh</span> 
                {loading ? 'Оновлення...' : 'Оновити'}
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
        {filteredPlaces.length === 0 && !loading ? (
          <Col xs={12} className="text-center py-5 text-muted fs-6">
            {searchTerm ? 'Нічого не знайдено за вашим запитом' : 'Улюблених поки немає'}
          </Col>
        ) : (
          filteredPlaces.map((place, idx) => (
            <Col key={place.id || idx} xs={12} md={6} lg={4} xl={3} className="mb-4">
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

        {/* Load More Button */}
        {hasMore && !loading && filteredPlaces.length > 0 && (
          <Col xs={12} className="text-center mt-4">
            <Button 
              variant="outline-primary" 
              onClick={loadMoreFavorites}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Завантаження...
                </>
              ) : (
                'Завантажити більше'
              )}
            </Button>
          </Col>
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