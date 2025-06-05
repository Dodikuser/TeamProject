// Components/MyPlaceCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MyPlaceCard = ({
  image,
  title,
  locationText,
  rating,
  distance,
  onDelete,
  onGoTo,
}) => {
  const { t } = useTranslation();
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
            <small className="text-muted d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">location_on</span>
              {locationText}
            </small>
          </div>
         <span
            className="material-symbols-outlined text-muted"
            role="button"
            title={t('delete')}
            onClick={(e) => {
                e.stopPropagation(); 
                onDelete();
            }}
            style={{ cursor: 'pointer' }}
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
            <div className="text-warning" aria-label={`Рейтинг: ${rating} з 5`}>
              {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
            </div>
          </div>
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
          `}
        </style>
      </Card.Body>
    </Card>
  );
};

export default MyPlaceCard;
