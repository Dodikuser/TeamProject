import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import RecommendationsCard from '../Components/RecommendationsCard';
import RecommendationService from '../services/RecommendationService';
import FavoriteService from '../services/FavoriteService';
import { useNavigate } from 'react-router-dom';
import GeoService from '../services/GeoService';
import { useTranslation } from 'react-i18next';

export default function Recommendations() {
  const { t } = useTranslation();
  const categories = [
    t('interesting_places'), t('tourism'), t('food'), t('nature'), t('shopping'), t('history_category'), t('sport'),
    t('for_kids'), t('quiet_places'), t('romance'), t('exotic'), t('extreme'), t('entertainment'), t('bank'), t('places_nearby'), t('architecture')
  ];
  const scrollRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('Туризм');
  const navigate = useNavigate();

  // Add fetchFavorites function
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
    const fetchRecommendations = async () => {
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
        
        const data = await RecommendationService.getRecommendations({
          hashTagId: 8,
          radius: 1,
          latitude: latitude,
          longitude: longitude,
          tag: selectedCategory
        });
        
        const favoritesSet = await fetchFavorites();

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
        
        // Transform API data and include isFavorite flag
        const transformedPlaces = Array.isArray(data) ? data.map(item => {
          const placeLat = item.latitude || item.lat || (item.location && item.location.lat);
          const placeLng = item.longitude || item.lng || (item.location && item.location.lng);
          let distance = item.distance || item.distanceText || 'N/A';
          if ((!item.distance && !item.distanceText) && placeLat && placeLng) {
            distance = `${getDistance(latitude, longitude, placeLat, placeLng).toFixed(1)} км`;
          }
          const getPhotoSrc = (photo) => {
            if (photo?.id) {
                return `https://localhost:7103/api/place/photo/${photo.id}`;
            }
            return photo?.path || 'https://cdn-icons-png.flaticon.com/512/2966/2966959.png';
          }
          return {
            id: item.gmapsPlaceId || item.id,
            originalItem: item,
            image: getPhotoSrc(item.photo) || getPhotoSrc(item.photos?.[0]),
            title: item.title || item.name || 'Без назви',
            location: item.location || item.address || 'Місцезнаходження невідоме',
            rating: parseFloat(item.rating || item.stars || 4),
            distance,
            isFavorite: favoritesSet.has(item.gmapsPlaceId || item.id)
          };
        }) : [];

        setRecommendations(transformedPlaces);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(`Помилка при завантаженні рекомендацій: ${err.message}`);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedCategory]);

  // Add handleToggleFavorite function
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

      // Update the recommendation's isFavorite status
      setRecommendations(prev => prev.map(rec => {
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

  const scrollCategories = (direction) => {
    const scrollAmount = 200;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Ensure recommendations is always an array before filtering
  const filteredRecommendations = Array.isArray(recommendations) 
    ? recommendations.filter(rec => {
        // Логируем структуру каждого элемента для отладки
        if (!rec) {
          console.log('Empty recommendation item:', rec);
          return false;
        }
        
        // Проверяем разные возможные поля для названия
        const title = rec.title || rec.name || rec.placeName || rec.Title || rec.Name;
        if (!title) {
          console.log('No title found in recommendation:', rec);
          return false;
        }
        
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  // Добавим логирование для отладки
  console.log('Total recommendations:', recommendations.length);
  console.log('Filtered recommendations:', filteredRecommendations.length);
  console.log('Search term:', searchTerm);

  const handleGoTo = (placeId) => {
    navigate("/");
    localStorage.setItem("openPlace", `${placeId}`);
  };

  const content = (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '100vh' }}>
      {/* Пошук */}
      <Row className="mb-4">
        <Col xs={12}>
          <div className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-end">
            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
              <Form.Control
                type="search"
                placeholder={t('search')}
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

      {/* Категорії зі стрілками */}
      <div className="position-relative mb-4">
        <Button
          variant="light"
          className="position-absolute top-50 start-0 translate-middle-y shadow-none border-0 p-1"
          style={{ zIndex: 1, background: 'transparent' }}
          onClick={() => scrollCategories('left')}
        >
          <span className="material-symbols-outlined text-dark">chevron_left</span>
        </Button>

        <div
          className="d-flex overflow-auto gap-2 px-5"
          ref={scrollRef}
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
        >
          {categories.map((cat, idx) => (
            <Button
              key={idx}
              variant="light"
              className={`rounded-pill px-3 py-1 text-dark flex-shrink-0 ${
                selectedCategory === cat ? 'active' : ''
              }`}
              style={{ 
                whiteSpace: 'nowrap', 
                backgroundColor: selectedCategory === cat ? '#9747FF' : '#D0BCFF',
                color: selectedCategory === cat ? 'white' : 'black'
              }}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <Button
          variant="light"
          className="position-absolute top-50 end-0 translate-middle-y shadow-none border-0 p-1"
          style={{ zIndex: 1, background: 'transparent' }}
          onClick={() => scrollCategories('right')}
        >
          <span className="material-symbols-outlined text-dark">chevron_right</span>
        </Button>
      </div>

      {/* Карточки рекомендацій */}
      <Row>
        {loading ? (
          <Col xs={12} className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Завантаження...</span>
            </div>
          </Col>
        ) : error ? (
          <Col xs={12} className="text-center py-5 text-danger">
            {error}
            <div className="mt-3">
              <Button 
                variant="outline-primary" 
                onClick={() => window.location.reload()}
              >
                {t('try_again')}
              </Button>
            </div>
          </Col>
        ) : filteredRecommendations.length === 0 ? (
          <Col xs={12} className="text-center py-5 text-muted fs-6">
            {searchTerm ? t('nothing_found_for_query') : t('no_recommendations_found')}
          </Col>
        ) : (
          filteredRecommendations.map((rec, idx) => (
            <Col key={rec.id || idx} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <RecommendationsCard 
                {...rec}
                isFavorite={favorites.has(rec.id)}
                onToggleFavorite={() => handleToggleFavorite(rec.id)}
                onGoTo={() => handleGoTo(rec.id)}
              />
            </Col>
          ))
        )}
      </Row>

      <style>
        {`
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

          /* Скрытие скролла */
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </Container>
  );

  return content;
}