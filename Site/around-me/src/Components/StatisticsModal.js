import React, { useState } from 'react';
import { Button, Row, Col, Badge, Modal } from 'react-bootstrap';

const initialReviews = [
  {
    rating: 4,
    text: "Дуже задоволена покупками в Сільпо! Завжди свіжі фрукти та овочі, приємні ціни на акційні товари...",
    positive: true
  },
  {
    rating: 2,
    text: "Залишився незадоволений... На акції ціна була вказана неправильно, а на касі пробили дорожче...",
    positive: false
  },
  {
    rating: 4,
    text: "Люблю цей магазин за великий вибір та якість! Особливо подобаються власні бренди Сільпо...",
    positive: true
  },
  {
    rating: 4,
    text: "Чудовий асортимент і завжди чисто в залі! Часто купую тут готову їжу – дуже смачно і зручно...",
    positive: true
  }
];

const modalStyle = {
  position: 'fixed',      
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',       
  width: '600px',         
  maxHeight: '90vh',      
  overflowY: 'auto',      
  backgroundColor: '#fff',
  borderRadius: '0.3rem',
  boxShadow: '0 0 15px rgba(0,0,0,0.3)',
  padding: '1rem',
  zIndex: 1050          
};

const StatisticsModal = ({ show, onHide }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  if (!show) return null;

 
  

  
  const confirmDelete = () => {
    if (indexToDelete !== null) {
      setReviews(prev => prev.filter((_, i) => i !== indexToDelete));
    }
    setShowConfirmModal(false);
    setIndexToDelete(null);
  };


  const cancelDelete = () => {
    setShowConfirmModal(false);
    setIndexToDelete(null);
  };

  return (
    <>
      <div style={modalStyle} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 id="modal-title" className="m-0">Статистика та відгуки</h5>
          <Button variant="outline-secondary" size="sm" onClick={onHide}>×</Button>
        </div>

        <Row>
          <Col xs={12} md={6} className="mb-3">
            <h6>Статистика</h6>
            <p>Було показано разів: <strong>100</strong></p>
            <p>Було обрано разів: <strong>20</strong></p>
            <p>Додано в “Улюблене”: <strong>20</strong></p>
          </Col>
          <Col xs={12} md={6} className="mb-3">
            <h6>Відгуки</h6>
            <p>
              <Badge bg="success" className="me-2">Позитивних: 7</Badge>
              <Badge bg="danger">Негативних: 1</Badge>
            </p>
          </Col>
        </Row>

        <div>
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-3 mb-3 d-flex border rounded justify-content-between align-items-start"
              style={{ backgroundColor: '#fff', borderLeft: `5px solid ${review.positive ? 'green' : 'red'}` }}
            >
              <div className="d-flex">
                <div className="me-3 d-flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{ color: i < review.rating ? '#FFC107' : '#E0E0E0' }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <div>{review.text}</div>
              </div>
             
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="secondary" onClick={onHide}>Закрити</Button>
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showConfirmModal} onHide={cancelDelete} centered>
        <Modal.Body className="text-center py-4">
          <p className="fs-5 mb-4">Ви дійсно хочете видалити відгук?</p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="secondary" onClick={cancelDelete}>
              Скасувати
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Так, видалити
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default StatisticsModal;
