// src/Components/RecommendationsCard.js
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

export default function RecommendationsCard({
  id,
  image,
  title = 'Назва місця',
  location = 'Адреса закладу',
  rating = 4,
  distance = '100 км',
  isFavorite = false,
  onToggleFavorite
}) {
  const [animating, setAnimating] = useState(false);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-warning">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">⯪</span>);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-secondary">☆</span>);
    }

    return stars;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setAnimating(true);
    onToggleFavorite();
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <Card className="shadow-sm border-0 h-100 rounded-3">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={image}
          className="rounded-top"
          style={{ height: '180px', objectFit: 'cover' }}
          alt={title}
        />
        <Button
          variant="link"
          className={`position-absolute top-0 end-0 p-2 ${animating ? 'animate-favorite' : ''}`}
          onClick={handleFavoriteClick}
          style={{ textDecoration: 'none' }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: isFavorite ? '#DC3545' : '#6C757D',
              fontSize: '24px',
              transition: 'color 0.3s ease',
              fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
            }}
          >
            favorite
          </span>
        </Button>
      </div>
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="mb-1 fs-6">{title}</Card.Title>
          <small className="text-muted d-flex align-items-center gap-1">
            <span className="material-symbols-outlined fs-6">location_on</span> {location}
          </small>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>
            <div className="text-muted small mb-1 d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">distance</span>
              {distance}
            </div>
            <div className="rating" aria-label={`Рейтинг: ${rating} з 5`}>
              {renderStars(rating)}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline-primary"
            className="custom-animated-button"
          >
            Перейти
          </Button>
        </div>
      </Card.Body>

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

          .rating span {
            font-size: 1.1rem;
          }

          @keyframes favoriteAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }

          .animate-favorite {
            animation: favoriteAnimation 0.5s ease;
          }
        `}
      </style>
    </Card>
  );
}
