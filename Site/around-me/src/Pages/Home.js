import React, {useEffect, useState} from 'react';
import { Container, Form, FormControl, Row, Col } from 'react-bootstrap';
import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';
import LocationModal from '../Components/LocationModal';
import PlaceService from '../services/PlaceService';
import AISearchService from '../services/AISearchService';
import FavoriteService from '../services/FavoriteService';
import LocationCard from '../Components/LocationCard';
import GeoService from '../services/GeoService';
import MapStateService from '../services/MapStateService';


function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState(new Set());

  // Function to load place details from API
  const loadPlaceDetails = async (placeId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await PlaceService.getPlaceById(placeId);
      if (data?.coordinates?.lat && data?.coordinates?.lng) {
        MapStateService.setCenter({ lat: data.coordinates.lat, lng: data.coordinates.lng });
      }
      setSelectedPlace(data);
      setShowModal(true);

      
    } catch (err) {
      console.error('Error loading place details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      localStorage.removeItem('openPlace');
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await FavoriteService.getFavorites({ skip: 0, take: 1000 });
      const favoriteIds = new Set(response.favorites.$values.map(fav => fav.placeDTO.gmapsPlaceId));
      setFavorites(favoriteIds);
      return favoriteIds;
    } catch (err) {
      console.error('Error fetching favorites:', err);
      return new Set();
    }
  };

  useEffect(() => {
    const placeId = localStorage.getItem("openPlace");
    if (placeId) {
      loadPlaceDetails(placeId);
    }
    fetchFavorites();
  }, []);

  useEffect(() => {
    // Когда searchResults обновляются, обновляем маркеры на карте
    if (searchResults && searchResults.length > 0) {
      const markers = searchResults
        .map(place =>
          place.originalItem && place.originalItem.latitude && place.originalItem.longitude
            ? { lat: place.originalItem.latitude, lng: place.originalItem.longitude }
            : null
        )
        .filter(Boolean);
      MapStateService.setMarkers(markers);
      MapStateService.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
    } else {
      MapStateService.setMarkers([]);
    }
  }, [searchResults]);

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        try {
          setLoading(true);
          setError(null);
          
          let latitude = 47.81052;
          let longitude = 35.18286;
          try {
            const pos = await GeoService.getCurrentPosition();
            latitude = pos.lat;
            longitude = pos.lng;
          } catch (geoErr) {
            // Если не удалось получить геолокацию — используем дефолт
          }
          
          const data = await AISearchService.searchPlaces({
            text: searchQuery,
            radius: 20,
            latitude,
            longitude
          });

          // Функция для расчёта расстояния
          const getDistance = (lat1, lng1, lat2, lng2) => {
            const toRad = (value) => value * Math.PI / 180;
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
          };

          // Преобразуем результаты с реальным расстоянием
          const transformedPlaces = Array.isArray(data) ? data.map(item => {
            const placeLat = item.latitude || item.lat || (item.location && item.location.lat);
            const placeLng = item.longitude || item.lng || (item.location && item.location.lng);
            let distance = 'N/A';
            if (placeLat && placeLng) {
              distance = `${getDistance(latitude, longitude, placeLat, placeLng).toFixed(1)} км`;
            }
            return {
              id: item.gmapsPlaceId || item.id,
              image: item.photo?.path || item.photos?.[0]?.path || 'https://cdn-icons-png.flaticon.com/512/2966/2966959.png',
              title: item.title || item.name || 'Без назви',
              locationText: item.location || item.address || 'Місцезнаходження невідоме',
              rating: item.rating || item.stars || 0,
              distance,
              isFavorite: favorites.has(item.gmapsPlaceId || item.id),
              originalItem: item
            };
          }) : [];

          setSearchResults(transformedPlaces);
        } catch (err) {
          console.error('Error searching places:', err);
          setError('Помилка при пошуку місць');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Введіть запит');
      }
    }
  };

  const handleToggleFavorite = async (placeId) => {
    try {
      const isFavorite = favorites.has(placeId);
      const action = isFavorite ? "Remove" : "Add";
      
      await FavoriteService.toggleFavorite(placeId, action);
      
      setFavorites(prev => {
        const newFavorites = new Set(prev);
        if (isFavorite) {
          newFavorites.delete(placeId);
        } else {
          newFavorites.add(placeId);
        }
        return newFavorites;
      });

      setSearchResults(prev => prev.map(rec => {
        if (rec.id === placeId) {
          return { ...rec, isFavorite: !isFavorite };
        }
        return rec;
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setError("Помилка при зміні статусу обраного місця");
    }
  };

  const handleCardClick = (place) => {
    openPlaceModal(place.id);
  };

  const openPlaceModal = async (placeId) => {
    try {
      setLoading(true);
      setError(null);
      const placeData = await PlaceService.getPlaceById(placeId);
      setSelectedPlace(placeData);
      setShowModal(true);
    } catch (err) {
      console.error('Error loading place details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-3 px-4 mt-2">
      <Container fluid>
        <Form className="d-flex justify-content-start w-100 px-2">
          <div
            className="position-relative w-100"
            style={{ maxWidth: '20%' }}
          >
            <FormControl
              placeholder="Запит"
              className="bg-light border-0 rounded px-3 py-3"
              style={{ height: '80px', paddingRight: '45px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
            <span
              className="material-symbols-outlined position-absolute"
              style={{
                bottom: '10px',
                right: '15px',
                color: '#6c757d',
                cursor: 'pointer',
              }}
              title="Мікрофон (не активний)"
            >
              mic
            </span>
          </div>
        </Form>

        <Row className="mt-3">
          <Col xs="auto">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setShowFilters(true)}
            >
              <span className="material-symbols-outlined">filter_list</span>
              Фільтри
            </button>
          </Col>
          <Col xs="auto">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => setShowSort(true)}
            >
              <span className="material-symbols-outlined">sort</span>
              Сортувати
            </button>
          </Col>
        </Row>

        {/* Search Results */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: '70vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            marginTop: '1rem'
          }}
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Завантаження...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              {error}
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((place) => (
              <div key={place.id} style={{ width: '100%', maxWidth: '23%' }}>
                <LocationCard
                  image={place.image}
                  title={place.title}
                  locationText={place.locationText}
                  rating={place.rating}
                  distance={place.distance}
                  isFavorite={place.isFavorite}
                  onToggleFavorite={() => handleToggleFavorite(place.id)}
                  onClick={() => handleCardClick(place)}
                />
              </div>
            ))
          ) : searchQuery && !loading ? (
            <div className="text-center py-5 text-muted">
              За вашим запитом нічого не знайдено
            </div>
          ) : null}
        </div>
      </Container>

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />
      {selectedPlace && (
        <LocationModal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedPlace(null);
          }}
          place={selectedPlace}
        />
      )}
    </div>
  );
}

export default Home;
