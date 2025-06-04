import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import FavoritesCard from '../Components/Cards/FavoritesCard';
import {useNavigate} from "react-router-dom";
import FavoriteService from '../services/FavoriteService';


export default function Favorites() {
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [sortType, setSortType] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // API related states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [take] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  const handleSort = (type, order) => {
    setSortType(type);
    setSortOrder(order);
  };

  // Filter and sort places
  const sortedAndFilteredPlaces = React.useMemo(() => {
    let result = [...favoritePlaces];

    // Фильтрация по поисковому запросу
    if (searchTerm) {
      result = result.filter(place =>
        place.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Сортировка
    if (sortType) {
      result.sort((a, b) => {
        let comparison = 0;
        
        switch (sortType) {
          case 'distance':
            // Преобразуем строку дистанции в число (удаляем 'км' и пробелы)
            const distA = parseFloat(String(a.distance).replace(/[^\d.]/g, '')) || 0;
            const distB = parseFloat(String(b.distance).replace(/[^\d.]/g, '')) || 0;
            comparison = distA - distB;
            break;
          case 'rating':
            const ratingA = parseFloat(a.rating) || 0;
            const ratingB = parseFloat(b.rating) || 0;
            comparison = ratingA - ratingB;
            break;
          case 'price':
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            comparison = priceA - priceB;
            break;
          default:
            return 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [favoritePlaces, searchTerm, sortType, sortOrder]);

  // Function to load favorites from API
  const loadFavorites = async (skipCount = 0, isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await FavoriteService.getFavorites({ 
        skip: skipCount, 
        take: take 
      });

      // Проверяем и трансформируем данные
      let transformedData = [];
      if (response && response.favorites && response.favorites.$values) {
        transformedData = FavoriteService.transformFavoriteData(response);
      }

      if (isLoadMore) {
        setFavoritePlaces(prev => [...prev, ...transformedData]);
      } else {
        setFavoritePlaces(transformedData);
      }

      // Check if there are more items to load
      setHasMore(transformedData.length === take);
      
    } catch (err) {
      setError('Помилка при завантаженні улюблених місць');
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
      const placeToDelete = sortedAndFilteredPlaces[deleteIndex];
      
      await FavoriteService.toggleFavorite(placeToDelete.id, '1');

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
    const place = sortedAndFilteredPlaces[idx];
    localStorage.setItem("openPlace", `${place.id}`);
    navigate("/");
  };

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

        {sortedAndFilteredPlaces.length === 0 && !loading ? (
          <Col xs={12} className="text-center py-5 text-muted fs-6">
            {searchTerm ? 'Нічого не знайдено за вашим запитом' : 'Улюблених поки немає'}
          </Col>
        ) : (
          sortedAndFilteredPlaces.map((place, idx) => (
            <Col key={place.id || idx} xs={12} md={6} lg={4} xl={3} className="mb-4">
              <FavoritesCard
                image={place.image}
                title={place.title}
                location={place.locationText}
                rating={place.rating}
                distance={place.distance}
                onDelete={() => handleDelete(idx)}
                onGoTo={() => handleGoTo(idx)}
              />
            </Col>
          ))
        )}

        {/* Load More Button */}
        {hasMore && !loading && sortedAndFilteredPlaces.length > 0 && (
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
      <SortOffcanvas 
        show={showSort} 
        onClose={() => setShowSort(false)} 
        onSort={handleSort}
        currentSortType={sortType}
        currentSortOrder={sortOrder}
      />

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