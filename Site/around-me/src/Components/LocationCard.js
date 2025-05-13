import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

const LocationCard = ({
  image,
  title = 'Назва місця',
  locationText = 'Адреса закладу',
  rating = 4,
  distance = '100 км', // Расстояние между пользователем и этим местом
  isFavorite,
  onClick,
  onToggleFavorite,
}) => {
  const [currentRating, setCurrentRating] = useState(rating);
  const [isAnimating, setIsAnimating] = useState(false);


  const cardStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '350px',
    borderRadius: '12px',
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    overflow: 'hidden',
    backgroundColor: 'white',
    position: 'relative',
    padding: '1px', // делаем карточку тоньше
    marginLeft: '-105px',
  };

  const imageStyle = {
    width: '90px', // уменьшение размера картинки
    height: '90px', // уменьшение размера картинки
    objectFit: 'cover',
    flexShrink: 0,
    borderRadius: '8px',
    transform: 'translateY(12px)', 
    marginLeft: '10px', 
  };

  const contentStyle = {
    flex: 1,
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // раздвигаем элементы на всю высоту
    gap: '6px',
  };

  const locationStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#777',
    gap: '4px',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#000',
  };

  const ratingAndDistanceStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', 
  };

  const ratingStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px',
    gap: '2px',
    color: '#000',
  };

  const distanceStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#777',
    gap: '4px',
  };

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
    <Card style={cardStyle} onClick={onClick}>
      <img src={image} alt={title} style={imageStyle} />

      <div style={contentStyle}>
        <div style={locationStyle}>
          <span className="material-symbols-outlined">location_on</span>
          <span>{locationText}</span>
        </div>
        <div style={titleStyle}>{title}</div>

      
        <div style={ratingAndDistanceStyle}>
          <div style={distanceStyle}>
            <span className="material-symbols-outlined">pin_drop</span>
            <span>{distance}</span>
          </div>
          <div style={ratingStyle}>{renderStars(currentRating)}</div>
        </div>
      </div>

     <span
  className="material-symbols-outlined"
  style={{
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '26px',
    color: '#626FC2',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, color 0.3s ease',
    transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
  }}
  onClick={(e) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggleFavorite();
    setTimeout(() => setIsAnimating(false), 200);
  }}
>
  {isFavorite ? 'favorite' : 'favorite_border'}
</span>
    </Card>
  );
};

export default LocationCard;
