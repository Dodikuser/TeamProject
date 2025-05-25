import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import RecommendationsCard from '../Components/RecommendationsCard';
import RecommendationService from '../services/RecommendationService';
import FavoriteService from '../services/FavoriteService';

const categories = [
  'Туризм', 'Їжа', 'Природа', 'Шопінг', 'Історія', 'Спорт',
  'Для дітей', 'Тихі місця', 'Романтика', 'Екзотика', 'Екстрим', 'Розваги', 'Банк', 'Місця поруч', 'Архітектура'
];

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in recommendations:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-5 text-danger">
          Щось пішло не так. Спробуйте оновити сторінку.
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Recommendations() {
  const scrollRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

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
        
        const data = await RecommendationService.getRecommendations({
          hashTagId: 8,
          radius: 10000,
          latitude: 47.81052,
          longitude: 35.18286
        });
        
        const favoritesSet = await fetchFavorites();
        
        // Transform API data and include isFavorite flag
        const transformedPlaces = Array.isArray(data) ? data.map(item => ({
          id: item.gmapsPlaceId || item.id,
          originalItem: item,
          image: item.photo?.path || item.photos?.[0]?.path || 'https://cdn-icons-png.flaticon.com/512/2966/2966959.png',
          title: item.title || item.name || 'Без назви',
          location: item.location || item.address || 'Місцезнаходження невідоме',
          rating: parseFloat(item.rating || item.stars || 4),
          distance: item.distance || item.distanceText || '100 км',
          isFavorite: favoritesSet.has(item.gmapsPlaceId || item.id)
        })) : [];

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
  }, []);

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

  const content = (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '100vh' }}>
      {/* Пошук */}
      <Row className="mb-4">
        <Col xs={12}>
          <div className="bg-white p-3 rounded-3 shadow-sm d-flex justify-content-end">
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
              className="rounded-pill px-3 py-1 text-dark flex-shrink-0"
              style={{ whiteSpace: 'nowrap', backgroundColor: '#D0BCFF' }}
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
                Спробувати знову
              </Button>
            </div>
          </Col>
        ) : filteredRecommendations.length === 0 ? (
          <Col xs={12} className="text-center py-5 text-muted fs-6">
            {searchTerm ? 'За вашим запитом нічого не знайдено' : 'Рекомендацій не знайдено'}
          </Col>
        ) : (
          filteredRecommendations.map((rec, idx) => (
            <Col key={rec.id || idx} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <RecommendationsCard 
                {...rec}
                isFavorite={favorites.has(rec.id)}
                onToggleFavorite={() => handleToggleFavorite(rec.id)}
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

  return (
    <ErrorBoundary>
      {content}
    </ErrorBoundary>
  );
}