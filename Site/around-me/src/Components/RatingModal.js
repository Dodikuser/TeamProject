import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const modalDialogStyle = {
  position: 'fixed',
  bottom: '10px',  // отступ снизу
  right: '20px',   // отступ справа
  margin: 0,
   width: '700px',      // НЕ maxWidth, а именно width
  maxWidth: '100%',    // можно подстроить ширину
};

const RatingModal = ({ show, onHide, placeName = 'Назва місця', onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit?.({ rating, review, file });
      onHide();
      setRating(0);
      setReview('');
      setFile(null);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      // Убираем centered, чтобы не было центрирования по вертикали
      dialogClassName="custom-modal-dialog"
      // size можно оставить или убрать, зависит от ваших предпочтений
    >
      <Modal.Dialog style={modalDialogStyle}>
        <Modal.Header closeButton>
          <Modal.Title>{placeName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              {/* Имя и аватар */}
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
                <span style={{ fontWeight: 500 }}>Ім’я та прізвище</span>
              </div>

              {/* Текст отзыва */}
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Написати відгук"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </Form.Group>

              {/* Фото или видео */}
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
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                </Form.Label>
                {file && <p className="mt-2 text-muted">{file.name}</p>}
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
                    onClick={() => setRating(star)}
                  >
                    {rating >= star ? 'star' : 'star_border'}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <span className="material-symbols-outlined align-middle me-1">close</span>
            Скасувати
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={rating === 0}>
            <span className="material-symbols-outlined align-middle me-1">send</span>
            Надіслати
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
};

export default RatingModal;
