import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function FavoritesCard({
  id,
  image,
  title = 'Назва місця',
  location = 'Адреса закладу',
  rating = 4,
  distance = '100 км',
  onDelete,
  onGoTo,
  favoritedAt,
}) {
  const { t } = useTranslation();

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-warning">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">⯪</span>); // ⯪ is a half-star approximation
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-secondary">☆</span>);
    }

    return stars;
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
              <span className="material-symbols-outlined fs-6">location_on</span> {location}
            </small>
          </div>
          <span
            className="material-symbols-outlined text-muted"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={onDelete}
            title={t('delete')}
          >
            delete
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
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
            onClick={onGoTo}
            className="custom-animated-button"
          >
            {t('go_to')}
          </Button>
        </div>

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
          `}
        </style>
      </Card.Body>
    </Card>
  );
}
