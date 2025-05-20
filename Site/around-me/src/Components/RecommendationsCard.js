// src/Components/RecommendationsCard.js
import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

export default function RecommendationsCard({ image, title, location, rating = 4, distance = '100 км' }) {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleLike = () => {
    if (!liked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500); 
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
