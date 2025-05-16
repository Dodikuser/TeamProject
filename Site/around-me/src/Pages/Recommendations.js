import React, { useRef, useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';

const categories = [
  'Туризм', 'Їжа', 'Природа', 'Шопінг', 'Історія', 'Спорт',
  'Для дітей', 'Тихі місця', 'Романтика', 'Екзотика', 'Екстрим','Розваги', 'Банк', 'Місця поруч', 'Архітектура'
];

function RecommendationsCard({ image, title, location, rating = 4, distance = '100 км' }) {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleLike = () => {
    if (!liked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500); // длительность анимации 0.5s
    }
    setLiked(!liked);
  };

  return (
    <Card className="shadow-sm border-0 h-100 rounded-3"> 
      <Card.Img
        variant="top"
        src={image}
        className="rounded-top"
        style={{ height: '160px', objectFit: 'cover' }}
      />
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1 fs-6">{title}</Card.Title>
            <small className="text-muted d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">location_on</span> {location}
            </small>
          </div>
          {/* Сердечко с анимацией и кликом */}
          <span
            className={`material-symbols-outlined ${liked ? 'text-danger' : 'text-muted'} ${animating ? 'animate-heart' : ''}`}
            role="button"
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={toggleLike}
            title={liked ? 'Видалити з обраного' : 'Додати в обране'}
          >
            favorite
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            <div className="text-muted small mb-1 d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">distance</span>
              {distance}
            </div>
            <div className="text-warning" aria-label={`Рейтинг: ${rating} з 5`}>
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </div>
          </div>
          <Button size="sm" variant="outline-primary" className="custom-animated-button">
            Перейти
          </Button>
        </div>
      </Card.Body>

      {/* Стили анимации сердечка */}
      <style>{`
        .animate-heart {
          animation: pulse 0.5s ease forwards;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  );
}

export default function Recommendations() {
  const scrollRef = useRef(null);

  const recommendations = new Array(6).fill(null).map((_, i) => ({
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    title: `Назва місця`,
    location: 'м. Київ',
    rating: 4,
    distance: '100 км',
  }));

  const scrollCategories = (direction) => {
    const scrollAmount = 200;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: '#E7E0EC', minHeight: '100vh' }}>
      
      {/* Пошук */}
      <div className="d-flex justify-content-center mb-5 mt-4">
        <div className="position-relative" style={{ width: '60%', maxWidth: '600px' }}>
          <Form.Control
            type="search"
            placeholder="Пошук"
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

      {/* Категорії зі стрілками */}
      <div className="position-relative mb-5">
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
        {recommendations.map((rec, idx) => (
          <Col key={idx} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <RecommendationsCard {...rec} />
          </Col>
        ))}
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
}
