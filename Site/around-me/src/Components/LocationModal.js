import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import ReviewsModal from './ReviewsModal';
import RatingModal from './RatingModal';
import ReviewService from '../services/ReviewService';

const LocationModal = ({ show, onHide, place, onBuildRoute }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  const loadReviews = async () => {
    if (!place?.id) return;
    
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const response = await ReviewService.getReviews(place.id);
      
      // Предполагаем, что API возвращает { reviews: [], averageRating: number }
      if (response && response.reviews) {
        setReviews(response.reviews);
        setAverageRating(response.averageRating || 0);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviewsError('Помилка при завантаженні відгуків');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Загружаем отзывы при открытии модального окна отзывов
  useEffect(() => {
    if (showReviews) {
      loadReviews();
    }
  }, [showReviews, place?.id]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      await ReviewService.createReview(place.id, reviewData);
      // После успешного создания отзыва, перезагружаем список отзывов
      await loadReviews();
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      // Здесь можно добавить обработку ошибки, например показать уведомление
    }
  };

  const ScheduleInfo = ({ hours, schedule }) => {
    const [open, setOpen] = useState(false);

    // Пример расписания, если не передано
    const workSchedule = schedule || [
      { day: 'Понеділок', hours: '09:00 - 21:00' },
      { day: 'Вівторок', hours: '09:00 - 21:00' },
      { day: 'Середа', hours: '09:00 - 21:00' },
      { day: 'Четвер', hours: '09:00 - 21:00' },
      { day: 'Пʼятниця', hours: '09:00 - 21:00' },
      { day: 'Субота', hours: '10:00 - 20:00' },
      { day: 'Неділя', hours: 'Вихідний' },
    ];

    return (
      <div className="info-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined">schedule</span>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#5b6dc0',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '1rem',
            }}
            aria-expanded={open}
            aria-controls="work-schedule"
          >
            {hours || 'Відчинено'}
          </button>
        </div>
        {open && (
          <div
            id="work-schedule"
            style={{
              marginTop: '0.5rem',
              background: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '8px 12px',
              maxWidth: '250px',
              fontSize: '0.9rem',
              color: '#333',
            }}
          >
            {workSchedule.map(({ day, hours }) => (
              <div key={day}>
                <strong>{day}:</strong> {hours}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [place]);

  if (!place) return null;

  const images = Array.isArray(place.images) ? place.images : [place.image];

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    console.log(place.images);
  };

  return (
    <>
      <style>{`
        .fullscreen-modal {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 1150px;
          margin: 0 auto;
          height: 100vh;
        }

        .fullscreen-modal-content {
          height: 100vh;
          padding: 0;
          border-radius: 0;
          display: flex;
          flex-direction: column;
        }

        .modal-wrapper {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .modal-header-fixed {
          flex: 0 0 auto;
          border-bottom: 1px solid #dee2e6;
          padding: 1rem 1.5rem;
        }

        .modal-body-scroll {
          flex: 1 1 auto;
          overflow-y: auto;
          padding: 0;
        }

        .modal-main-image-wrapper {
          position: relative;
          text-align: center;
          margin-bottom: 1rem;
        }

        .modal-main-image {
          width: 100%;
          max-height: 350px;
          object-fit: cover;
          display: block;
          margin: 0 auto;
        }

        .image-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          z-index: 1;
        }

        .image-nav-button.left {
          left: 10px;
        }

        .image-nav-button.right {
          right: 10px;
        }

        .modal-footer-fixed {
          flex: 0 0 auto;
          border-top: 1px solid #dee2e6;
          justify-content: flex-end;
          padding: 0.75rem 1.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .action-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #5b6dc0;
          cursor: pointer;
          font-size: 14px;
          transition: transform 0.2s ease;
        }

        .action-button:hover {
          transform: scale(1.1);
        }

        .action-button .material-symbols-outlined {
          background-color: #5b6dc0;
          color: white;
          border-radius: 50%;
          padding: 10px;
          font-size: 24px;
          margin-bottom: 0.5rem;
        }

        .review-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 2px solid #5b6dc0;
          border-radius: 999px;
          background: transparent;
          color: #5b6dc0;
          font-size: 16px;
          padding: 0.5rem 1.5rem;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
        }

        .review-button:hover {
          background: #5b6dc0;
          color: white;
          transform: scale(1.05);
        }

        .review-button .material-symbols-outlined {
          font-size: 20px;
        }

        @media (max-width: 768px) {
          .modal-main-image {
            max-height: 250px;
          }
        }
      `}</style>

      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        dialogClassName="fullscreen-modal"
        contentClassName="fullscreen-modal-content"
        centered
        size="lg"
      >
        <div className="modal-wrapper">
          <Modal.Header closeButton className="modal-header-fixed">
            <Modal.Title>{place.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body className="modal-body-scroll">
            <Container fluid>
              <Row className="justify-content-center">
                <Col xs={12} md={8} className="modal-main-image-wrapper">
                  {images.length > 1 && (
                    <>
                      <button className="image-nav-button left" onClick={prevImage}>
                        &#8592;
                      </button>
                      <button className="image-nav-button right" onClick={nextImage}>
                        &#8594;
                      </button>
                    </>
                  )}
                  <img
                    src={images[currentImageIndex]}
                    alt={`${place.title} ${currentImageIndex + 1}`}
                    className="modal-main-image"
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={5} className="modal-info">
                  {place.location && (
                    <div className="info-item">
                      <span className="material-symbols-outlined">location_on</span>
                      <span>{place.location}</span>
                    </div>
                  )}
                  
                  {(place.hours || (place.schedule && place.schedule.length > 0)) && (
                    <ScheduleInfo hours={place.hours} schedule={place.schedule} />
                  )}

                  {place.phone && (
                    <div className="info-item">
                      <span className="material-symbols-outlined">call</span>
                      <span>{place.phone}</span>
                    </div>
                  )}

                  {place.email && (
                    <div className="info-item">
                      <span className="material-symbols-outlined">mail</span>
                      <span>{place.email}</span>
                    </div>
                  )}

                  {place.description && (
                    <div className="info-item">
                      <span className="material-symbols-outlined">info</span>
                      <span>{place.description}</span>
                    </div>
                  )}
                </Col>

                <Col xs={12} md={7} className="d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-center gap-4 mb-3">
                    <div className="action-button" onClick={onBuildRoute} style={{cursor: 'pointer'}}>
                      <span className="material-symbols-outlined">turn_right</span>
                      <span>Маршрути</span>
                    </div>
                    <div className="action-button">
                      <span className="material-symbols-outlined">favorite</span>
                      <span>Зберегти</span>
                    </div>
                    <div className="action-button">
                      <span className="material-symbols-outlined">share</span>
                      <span>Поділитися</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button className="review-button" onClick={() => setShowRatingModal(true)}>
                      <span className="material-symbols-outlined">add</span>
                      Залишити відгук
                    </button>

                    <button className="review-button" onClick={() => setShowReviews(true)}>
                      <span className="material-symbols-outlined">reviews</span>
                      Переглянути відгуки
                    </button>
                  </div>
                </Col>
              </Row>
            </Container>
          </Modal.Body>

          <Modal.Footer className="modal-footer-fixed">
            <Button variant="secondary" onClick={onHide}>
              Закрити
            </Button>
          </Modal.Footer>
        </div>
        <ReviewsModal
          show={showReviews}
          onHide={() => setShowReviews(false)}
          reviews={reviews}
          rating={averageRating}
          isLoading={reviewsLoading}
          error={reviewsError}
        />
        <RatingModal
          show={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          placeName={place?.title}
          onSubmit={handleReviewSubmit}
        />
      </Modal>
    </>
  );
};

export default LocationModal;
