import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function AdminCard({
  image = 'https://i.pinimg.com/736x/b9/23/9f/b9239fe224538cbe52d7e5fe9a5084f9.jpg',
  title = 'Назва місця',
  locationText = 'location',
  rating = 4,
  distance = '100 км',
  onEdit,
}) {
  return (
    <Card className="shadow-sm border-0 rounded-3 h-100">
      <Card.Img
        variant="top"
        src={image}
        className="rounded-top"
        style={{ height: '150px', objectFit: 'cover' }}
        alt={title}
      />
      <Card.Body>
        <small className="text-muted d-flex align-items-center gap-1 mb-1">
          <span className="material-symbols-outlined fs-6">location_on</span> {locationText}
        </small>
        <Card.Title className="fs-6 mb-2">{title}</Card.Title>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted small mb-1 d-flex align-items-center gap-1">
              <span className="material-symbols-outlined fs-6">distance</span> {distance}
            </div>
            <div className="text-warning" aria-label={`Рейтинг: ${rating} з 5`}>
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </div>
          </div>
          <Button
            size="sm"
            className="custom-animated-button"
            onClick={onEdit}
          >
            Редагувати
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
}
