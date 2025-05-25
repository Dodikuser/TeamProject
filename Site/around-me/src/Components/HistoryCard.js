import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import FavoriteService from '../services/FavoriteService';

export default function HistoryCard({
  id,
  image,
  title = 'Назва місця',
  locationText = 'Адреса закладу',
  dateVisited = '10 травня 2025',
  initialFavorite = false,
  onClear,
  onGoTo,
}) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [animating, setAnimating] = useState(false);

  const toggleFavorite = async () => {
    const action = isFavorite ? "Remove" : "Add";

    try {
      setAnimating(true);
      await FavoriteService.toggleFavorite(id, action);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Помилка при зміні статусу обраного:", error);
    } finally {
      setTimeout(() => setAnimating(false), 500);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={image}
          style={{ height: '150px', objectFit: 'cover' }}
        />
        <Button
          variant="link"
          className={`position-absolute top-0 end-0 p-2 ${animating ? 'animate-favorite' : ''}`}
          onClick={toggleFavorite}
          style={{ textDecoration: 'none' }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: isFavorite ? '#DC3545' : '#6C757D',
              fontSize: '24px',
              transition: 'color 0.3s ease'
            }}
          >
            favorite
          </span>
        </Button>
      </div>
      <Card.Body>
        <Card.Title className="mb-1">{title}</Card.Title>
        <Card.Text className="text-muted small mb-2">{locationText}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{dateVisited}</small>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={onGoTo}
              className="d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                directions
              </span>
              Перейти
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onClear}
              className="d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                delete
              </span>
              Видалити
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
