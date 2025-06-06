// Components/MyPlaceCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const MyPlaceCard = ({
  image,
  title,
  locationText,
  rating,
  distance,
  onDelete,
  onGoTo,
  extraInfo,
}) => {
  // Функция для отображения звезд рейтинга
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-warning">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">⯪</span>); // ползвезды
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
        src={image || 'https://via.placeholder.com/300x200'}
        alt={title}
        style={{ height: '160px', objectFit: 'cover' }}
        className="rounded-top"
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title className="fs-6 mb-1">{title}</Card.Title>
            <div className="rating mb-1">{renderStars(rating)}</div>
            <small className="text-muted d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">location_on</span>
              {locationText}
            </small>
          </div>
         <span
            className="material-symbols-outlined text-muted"
            role="button"
            title="Видалити"
            onClick={(e) => {
                e.stopPropagation(); 
                onDelete();
            }}
            style={{ cursor: 'pointer' }}
            >
            delete
            </span>

        </div>

        {extraInfo && (
          <div className="mb-2">{extraInfo}</div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Button
  size="sm"
  variant="outline-primary"
  onClick={(e) => {
    e.stopPropagation();
    if (onGoTo) {
      onGoTo(); 
    }
  }}
  className="custom-animated-button"
>
  Перейти
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
};

export default MyPlaceCard;
