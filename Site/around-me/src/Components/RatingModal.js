import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ReviewService from '../services/ReviewService';

const modalDialogStyle = {
  position: 'fixed',
  bottom: '10px',  
  right: '20px',  
  margin: 0,
  width: '700px',     
  maxWidth: '100%',   
};

const RatingModal = ({ show, onHide, placeName = 'Назва місця', onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Будь ласка, поставте оцінку');
      return;
    }


    try {
      setIsSubmitting(true);
      setError(null);

      const reviewData = {
        stars: rating,
        text: review.trim()
      };

      if (file) {
        // Если есть файл, создаем FormData и добавляем его
        const formData = new FormData();
        formData.append('image', file);
        formData.append('review', JSON.stringify(reviewData));
        reviewData.image = formData;
      }

      await onSubmit(reviewData);
      
      // Сбрасываем форму
      setRating(0);
      setReview('');
      setFile(null);
      setError(null);
      onHide();
    } catch (err) {
      setError(err.message || 'Помилка при відправці відгуку');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      dialogClassName="custom-modal-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>{placeName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <div className="mb-3 d-flex align-items-center gap-2">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '2.5rem',
                  color: '#6c63ff',
                }}
              >
                account_circle
              </span>
              <span style={{ fontWeight: 500 }}>Ім'я та прізвище</span>
            </div>

            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Написати відгук"
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                  setError(null);
                }}
                isInvalid={!!error && !review.trim()}
              />
              <Form.Control.Feedback type="invalid">
                {error && !review.trim() ? error : null}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label className="d-block">
                <div
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '25px',
                    padding: '10px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: '#6c63ff',
                    fontWeight: '500',
                    display: 'inline-block',
                  }}
                >
                  <span className="material-symbols-outlined align-middle me-2">add_photo_alternate</span>
                  Додати фото або відео
                  <input
                    type="file"
                    accept="image/*,video/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                          setError('Файл занадто великий. Максимальний розмір: 5MB');
                          return;
                        }
                        setFile(selectedFile);
                        setError(null);
                      }
                    }}
                  />
                </div>
              </Form.Label>
              {file && (
                <div className="mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-success">check_circle</span>
                    <span className="text-truncate">{file.name}</span>
                    <Button 
                      variant="link" 
                      className="p-0 text-danger" 
                      onClick={() => setFile(null)}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </Button>
                  </div>
                </div>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="text-center d-flex flex-column justify-content-center">
            <h5>Оцініть місце</h5>
            <div style={{ fontSize: '2rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="material-symbols-outlined"
                  style={{
                    cursor: 'pointer',
                    color: rating >= star ? '#f5b50a' : '#ccc',
                    fontSize: '2.5rem',
                    transition: 'color 0.2s',
                  }}
                  onClick={() => {
                    setRating(star);
                    setError(null);
                  }}
                >
                  {rating >= star ? 'star' : 'star_border'}
                </span>
              ))}
            </div>
            {error && rating === 0 && (
              <div className="text-danger mt-2 small">{error}</div>
            )}
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={onHide}
          disabled={isSubmitting}
        >
          <span className="material-symbols-outlined align-middle me-1">close</span>
          Скасувати
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Відправка...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined align-middle me-1">send</span>
              Надіслати
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RatingModal;
