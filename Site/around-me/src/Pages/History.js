import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, OverlayTrigger, Tooltip, Modal, Spinner, Alert } from 'react-bootstrap';
import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import VisitHistory from '../Components/VisitHistory';
import SearchHistory from '../Components/SearchHistory';
import HistoryService from '../services/HistoryService';
import FavoriteService from '../services/FavoriteService';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [activeTab, setActiveTab] = useState('visit');
  const [isIncognito, setIsIncognito] = useState(() => {
    const saved = localStorage.getItem('isIncognito');
    return saved === 'true';
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // API-related state
  const [historyPlaces, setHistoryPlaces] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [confirmText, setConfirmText] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const navigate = useNavigate();

  // API call to get user's favorites
  const fetchFavorites = async () => {
    try {
      const response = await FavoriteService.getFavorites({ skip: 0, take: 1000 });
      const favoriteIds = new Set(response.favorites.$values.map(fav => fav.placeDTO.gmapsPlaceId));
      setFavorites(favoriteIds);
      return favoriteIds;
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  // API call for visit history
  const fetchVisitHistory = async (skipCount = 0, takeCount = 10, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await HistoryService.getVisitHistory({ skip: skipCount, take: takeCount });
      const favoritesSet = await fetchFavorites();
      const getPhotoSrc = (photo) => {
        if (photo?.id) {
            console.warn("!!!I HAVE A PHOTO ID!!!", photo.id);
            return `https://localhost:7103/api/place/photo/${photo.id}`;
        }
        return photo?.path || 'https://via.placeholder.com/300x180?text=No+Image';
    };
      // Transform API data to match component structure
      const transformedPlaces = data.histoires.$values.map(item => ({
        id: item.placeDTO.gmapsPlaceId,
        historyId: item.placeDTO.historyId,
        originalItem: item,
        image: getPhotoSrc(item.placeDTO.photo),
        title: item.placeDTO.name,
        locationText: item.placeDTO.address,
        dateVisited: new Date(item.visitDateTime).toLocaleString('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        isFavorite: favoritesSet.has(item.placeDTO.gmapsPlaceId)
      }));

      if (append) {
        setHistoryPlaces(prev => [...prev, ...transformedPlaces]);
      } else {
        setHistoryPlaces(transformedPlaces);
      }

      setHasMore(transformedPlaces.length === takeCount);
      setSkip(skipCount + transformedPlaces.length);
    } catch (err) {
      console.error('Error fetching visit history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // API call for search history
  const fetchSearchHistory = async (skipCount = 0, takeCount = 10, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await HistoryService.getSearchHistory({ skip: skipCount, take: takeCount });
      
      // Transform API data to match component structure
      const transformedSearches = data.searches.$values.map(item => ({
        id: item.$id,
        originalItem: item,
        query: item.text,
        date: new Date(item.searchDateTime).toLocaleDateString('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        time: new Date(item.searchDateTime).toLocaleTimeString('uk-UA', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        userId: item.userId
      }));

      if (append) {
        setSearchHistory(prev => [...prev, ...transformedSearches]);
      } else {
        setSearchHistory(transformedSearches);
      }

      setHasMore(transformedSearches.length === takeCount);
    } catch (err) {
      console.error('Error fetching search history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // API call to delete single visit history item
  const deleteVisitHistoryItem = async (place) => {
    setLoading(true);
    setError(null);
    
    try {
      const placeHistoryDTO = {
        // gmapsPlaceId: place.originalItem.placeDTO.gmapsPlaceId,
        // visitDateTime: place.originalItem.visitDateTime
        historyId: place.originalItem.historyId
      };

      await HistoryService.deleteVisitHistoryItem(placeHistoryDTO);

      // Remove item from local state
      setHistoryPlaces(prev =>
        prev.filter(item =>
          !(item.id === place.id && item.dateVisited === place.dateVisited)
        )
      );
    } catch (err) {
      console.error('Error deleting visit history item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // API call to delete single search history item
  const deleteSearchHistoryItem = async (searchItem) => {
    setLoading(true);
    setError(null);
    
    try {
      const searchDTO = {
        // text: searchItem.originalItem.text,
        // searchDateTime: searchItem.originalItem.searchDateTime,
        historyId: searchItem.originalItem.historyId
      };

      await HistoryService.deleteSearchHistoryItem(searchDTO);

      // Remove item from local state
      setSearchHistory(prev => prev.filter(item => item.id !== searchItem.id));
    } catch (err) {
      console.error('Error deleting search history item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // API call to clear all visit history
  const clearAllVisitHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await HistoryService.clearVisitHistory();

      // Clear local state
      setHistoryPlaces([]);
      setSkip(0);
      setHasMore(false);
    } catch (err) {
      console.error('Error clearing visit history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // API call to clear all search history
  const clearAllSearchHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await HistoryService.clearSearchHistory();

      // Clear local state
      setSearchHistory([]);
      setSkip(0);
      setHasMore(false);
    } catch (err) {
      console.error('Error clearing search history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (activeTab === 'visit') {
      fetchVisitHistory(0, 10);
    } else {
      fetchSearchHistory(0, 10);
    }
  }, [activeTab]);

  // Load more data when scrolling
  const loadMore = () => {
    if (loading || !hasMore) return;
    
    if (activeTab === 'visit') {
      fetchVisitHistory(skip, 10, true);
    } else {
      fetchSearchHistory(skip, 10, true);
    }
  };

  const openConfirmModal = (text, action) => {
    setConfirmText(text);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleClearVisit = (idx) => {
    const place = historyPlaces[idx];
    openConfirmModal('Ви дійсно хочете видалити цю історію відвідування?', () =>
      deleteVisitHistoryItem(place)
    );
  };

  const handleGoToVisit = (idx) => {
    const place = historyPlaces[idx];
    if (place) {
      navigate("/");
      localStorage.setItem("openPlace", `${place.id}`);
      alert(`Перейти до місця: ${place.title}`);
    }
  };

  const handleClearSearch = (idx) => {
    const searchItem = searchHistory[idx];
    openConfirmModal('Ви дійсно хочете видалити цей пошуковий запит?', () =>
      deleteSearchHistoryItem(searchItem)
    );
  };

  const handleGoToSearch = (query) => {
    alert(`Пошук за запитом: "${query}"`);
  };

  const clearAllHistory = () => {
    const historyType = activeTab === 'visit' ? 'історію відвідування' : 'історію пошуку';
    openConfirmModal(`Ви дійсно хочете повністю очистити ${historyType}?`, () => {
      if (activeTab === 'visit') {
        clearAllVisitHistory();
      } else {
        clearAllSearchHistory();
      }
    });
  };

  const refreshHistory = () => {
    setSkip(0);
    if (activeTab === 'visit') {
      fetchVisitHistory(0, 10);
    } else {
      fetchSearchHistory(0, 10);
    }
  };

  // Filter data based on search term
  const filteredHistoryPlaces = historyPlaces.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.locationText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSearchHistory = searchHistory.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик для кнопки инкогнито
  const handleIncognitoToggle = async () => {
    const newValue = !isIncognito;
    setIsIncognito(newValue);
    localStorage.setItem('isIncognito', newValue);
    try {
      await UserService.setIncognitoMode(newValue);
    } catch (err) {
      setIsIncognito(!newValue);
      localStorage.setItem('isIncognito', !newValue);
      alert('Ошибка при обновлении инкогнито на сервере');
    }
  };

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', height: '91vh', display: 'flex', flexDirection: 'column' }}>
      <Row className="mb-4 flex-shrink-0" style={{ height: '70px' }}>
        <Col xs={12}>
          <div className="bg-white p-3 rounded-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center h-100">
            <div className="d-flex gap-2 mb-2 mb-md-0 align-items-center">
              <Button 
                variant={activeTab === 'visit' ? 'primary' : 'outline-primary'} 
                onClick={() => setActiveTab('visit')}
                disabled={loading}
              >
                Історія відвідування
              </Button>
              <Button 
                variant={activeTab === 'search' ? 'primary' : 'outline-primary'} 
                onClick={() => setActiveTab('search')}
                disabled={loading}
              >
                Історія пошуку
              </Button>
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

      {error && (
        <Row className="mb-3">
          <Col xs={12}>
            <Alert variant="danger" className="d-flex justify-content-between align-items-center">
              <span>Помилка: {error}</span>
              <Button variant="outline-danger" size="sm" onClick={refreshHistory}>
                Спробувати знову
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      <Row style={{ flex: 1, overflow: 'hidden', height: 'calc(90vh - 80px)' }}>
        <Col xs="auto" className="d-flex flex-column gap-3" style={{ paddingLeft: 0, flexShrink: 0 }}>
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{isIncognito ? 'Вимкнути інкогніто' : 'Увімкнути інкогніто'}</Tooltip>}>
            <Button 
              variant={isIncognito ? 'dark' : 'outline-dark'} 
              onClick={handleIncognitoToggle}
              className="d-flex align-items-center gap-1" 
              style={{ minWidth: '130px' }}
            >
              <span className="material-symbols-outlined">{isIncognito ? 'visibility_off' : 'visibility'}</span>
              Інкогніто
            </Button>
          </OverlayTrigger>
          <Button 
            variant="outline-primary" 
            onClick={refreshHistory} 
            style={{ minWidth: '130px' }}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Оновити'}
          </Button>
          <Button 
            variant="outline-danger" 
            onClick={clearAllHistory} 
            style={{ minWidth: '130px' }}
            disabled={loading}
          >
            Очистити всю історію
          </Button>
        </Col>

        <Col style={{ overflowY: 'auto', paddingRight: '10px', height: '100%' }}>
          {loading && historyPlaces.length === 0 && searchHistory.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Завантаження...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {activeTab === 'visit' ? (
                <VisitHistory 
                  places={filteredHistoryPlaces} 
                  onClear={handleClearVisit} 
                  onGoTo={handleGoToVisit} 
                />
              ) : (
                <SearchHistory 
                  searches={filteredSearchHistory} 
                  onClearSearch={handleClearSearch} 
                  onGoToSearch={handleGoToSearch} 
                />
              )}
              
              {hasMore && !loading && (
                <div className="text-center mt-3">
                  <Button variant="outline-primary" onClick={loadMore}>
                    Завантажити більше
                  </Button>
                </div>
              )}
              
              {loading && (historyPlaces.length > 0 || searchHistory.length > 0) && (
                <div className="text-center mt-3">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
            </>
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