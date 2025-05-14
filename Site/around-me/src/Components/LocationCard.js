import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const LocationCard = ({
  image,
  title = 'Назва місця',
  locationText = 'Адреса закладу',
  rating = 4,
  distance = '100 км',
  isFavorite,
  onClick,
  onToggleFavorite,
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const [isAnimating, setIsAnimating] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ cursor: 'pointer' }}
          onClick={() => setCurrentRating(i)}
        >
          {i <= currentRating ? 'star' : 'star_border'}
        </span>
      );
    }
    return stars;
  };

  return (
    <Card className="h-100 shadow-sm rounded overflow-hidden" onClick={onClick}>
      <div className="d-flex">
        <img src={image} alt={title} className="img-fluid rounded m-2" style={{ width: '90px', height: '90px', objectFit: 'cover' }} />

        <div className="flex-grow-1 d-flex flex-column justify-content-between py-2 pe-2">
          <div>
            <div className="d-flex align-items-center text-muted small">
              <span className="material-symbols-outlined me-1">location_on</span>
              {locationText}
            </div>
            <div className="fw-semibold">{title}</div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center text-muted small">
              <span className="material-symbols-outlined me-1">pin_drop</span>
              {distance}
            </div>
            <div className="text-warning d-flex">{renderStars(currentRating)}</div>
          </div>
        </div>
      </div>

     <span
  className="material-symbols-outlined position-absolute top-0 end-0 m-2"
  style={{
    fontSize: '26px',
    cursor: 'pointer',
    color: isFavorite ? '#dc3545' : '#6c757d',
    fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
    transition: 'font-variation-settings 0.3s ease, transform 0.2s ease',
    transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
  }}
  onClick={(e) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggleFavorite(); // Меняет isFavorite
    setTimeout(() => setIsAnimating(false), 200);
  }}
>
  favorite
</span>

    </Card>
  );
};

export default LocationCard;
