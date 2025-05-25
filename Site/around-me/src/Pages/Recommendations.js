import React, { useRef, useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import RecommendationsCard from '../Components/RecommendationsCard';

const categories = [
  'Туризм', 'Їжа', 'Природа', 'Шопінг', 'Історія', 'Спорт',
  'Для дітей', 'Тихі місця', 'Романтика', 'Екзотика', 'Екстрим','Розваги', 'Банк', 'Місця поруч', 'Архітектура'
];

export default function Recommendations() {
  const scrollRef = useRef(null);

  // Добавляем состояние для поиска
  const [searchTerm, setSearchTerm] = useState('');

  const recommendations = new Array(6).fill(null).map((_, i) => ({
    image: 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
    title: `Назва місця ${i + 1}`, // Чтобы было различие в названиях
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

 
  const filteredRecommendations = recommendations.filter(rec =>
    rec.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                value={searchTerm} // привязываем к состоянию
                onChange={e => setSearchTerm(e.target.value)} // обновляем по вводу
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
        {filteredRecommendations.length === 0 ? (
          <Col xs={12} className="text-center py-5 text-muted fs-6">
            Рекомендацій не знайдено
          </Col>
        ) : (
          filteredRecommendations.map((rec, idx) => (
            <Col key={idx} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <RecommendationsCard {...rec} />
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
}
