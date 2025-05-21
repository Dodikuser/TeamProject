import React, { useState } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';

const ratingDistribution = {
  5: 0.45,
  4: 0.25,
  3: 0.15,
  2: 0.10,
  1: 0.05,
};

const modalWrapperStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '500px',
  maxWidth: '100%',
  height: '100%',
  margin: 0,
  backgroundColor: '#fff',
  zIndex: 1055,
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  borderLeft: '1px solid #dee2e6',
};

const ReviewsModal = ({ show, onHide, reviews = [], rating = 3.5 }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [search, setSearch] = useState('');

  const filteredReviews = reviews
    .filter((r) => r.text.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const then = new Date(dateString);
    const diff = now - then;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'сьогодні';
    if (days < 7) return `${days} днів тому`;
    if (days < 30) return `${Math.floor(days / 7)} тижнів тому`;
    if (days < 365) return `${Math.floor(days / 30)} місяців тому`;
    return `${Math.floor(days / 365)} роки тому`;
  };

  if (!show) return null;

  return (
    <div style={modalWrapperStyle}>
      <Modal.Dialog className="h-100 m-0 d-flex flex-column">
        <Modal.Body className="p-4 d-flex flex-column h-100">
          <Button
            variant="link"
            onClick={onHide}
            className="mb-3 p-0 text-decoration-none d-flex align-items-center"
            style={{ gap: '0.4rem' }} 
            >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                arrow_back
            </span>
            Повернутися
            </Button>


          <Container fluid className="flex-grow-1 overflow-hidden d-flex flex-column">
            <Row className="mb-4">
              <Col md={8}>
                <h5 className="mb-3">Відгуки</h5>
                {Object.entries(ratingDistribution)
                  .sort((a, b) => b[0] - a[0])
                  .map(([score, percent]) => (
                    <div key={score} className="d-flex align-items-center mb-2">
                      <div className="me-2 text-end" style={{ width: '20px' }}>
                        {score}
                      </div>
                      <div className="flex-grow-1 bg-light rounded-pill" style={{ height: '6px' }}>
                        <div
                          className="bg-primary rounded-pill"
                          style={{ width: `${percent * 100}%`, height: '100%' }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </Col>

              <Col md={4} className="text-center">
                <div className="display-4 fw-bold">{rating.toFixed(1)}</div>
                <div className="text-warning fs-4">
                  {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
                </div>
                <div className="text-muted">Відгуків: {reviews.length}</div>
              </Col>
            </Row>

            <Row className="align-items-center mb-3">
              <Col md={8}>
                <div className="d-flex align-items-center border rounded px-3 py-2">
                  <span className="material-symbols-outlined me-2 text-secondary">search</span>
                  <Form.Control
                    type="text"
                    placeholder="Пошук у відгуках"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-0 shadow-none"
                  />
                </div>
              </Col>
              <Col md={4} className="text-end">
                <div
                  role="button"
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="fw-bold d-inline-flex align-items-center"
                >
                  {sortOrder === 'newest' ? 'Найновіші' : 'Найстаріші'}
                  <span
                    className="material-symbols-outlined ms-1"
                    style={{
                      transform: sortOrder === 'newest' ? 'rotate(0deg)' : 'rotate(180deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    expand_more
                  </span>
                </div>
              </Col>
            </Row>

            <Row className="flex-grow-1">
  <Col>
    <div
      style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}
    >
      {filteredReviews.length === 0 && (
        <div className="text-center text-muted">Відгуки не знайдено</div>
      )}
      {filteredReviews.map((review, index) => (
        <div key={index} className="border-bottom py-3 d-flex gap-3">
          <div
            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
            style={{ width: '40px', height: '40px' }}
          >
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <div className="fw-bold">{review.name}</div>
            <div className="text-muted small">{getRelativeTime(review.date)}</div>
            <div className="text-warning">
              {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
            </div>
            <p className="mt-2 mb-0">{review.text}</p>
          </div>
        </div>
      ))}
    </div>
  </Col>
</Row>


            <div className="text-end mt-3">
              <Button variant="secondary" onClick={onHide}>
                Закрити
              </Button>
            </div>
          </Container>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default ReviewsModal;
