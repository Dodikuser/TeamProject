import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';

export default function HistoryCard({
  image,
  title = 'Назва місця',
  locationText = 'Адреса закладу',
  dateVisited = '10 травня 2025',
  onClear,
  onGoTo,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleFavorite = () => {
    if (!isFavorite) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500); // длина анимации
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="shadow-sm border-0 h-100 rounded-3">
      <Card.Img
        variant="top"
        src={image}
        className="rounded-top"
        style={{ height: '180px', objectFit: 'cover' }}
        alt={title}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="mb-1 fs-6">{title}</Card.Title>
            <small className="text-muted d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">location_on</span> {locationText}
            </small>
            <div className="text-muted small mt-1 d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">calendar_month</span> {dateVisited}
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span
              className={`material-symbols-outlined ${isFavorite ? 'text-danger' : 'text-muted'} ${animating ? 'animate-heart' : ''}`}
              role="button"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={toggleFavorite}
              title={isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
            >
              favorite
            </span>
            <span
              className="material-symbols-outlined text-muted"
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={onClear}
              title="Очистити"
            >
              delete
            </span>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-auto">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={onGoTo}
            className="custom-animated-button"
          >
            Перейти
          </Button>
        </div>

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
      </Card.Body>
    </Card>
  );
}
