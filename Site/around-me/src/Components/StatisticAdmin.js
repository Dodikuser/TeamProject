import React, { useState } from 'react';
import { Modal, Row, Col, Form } from 'react-bootstrap';

const StatisticAdmin = ({ show, onHide, place }) => {
  const [filters, setFilters] = useState({
    ресторани: false,
    кафе: false,
    магазини: false,
    банки: false,
    туризм: false,
  });

  const [radius, setRadius] = useState('');
  const [currentBalance, setCurrentBalance] = useState('1000');
  const [addBalance, setAddBalance] = useState('0');

  const [reviews, setReviews] = useState([
    { id: 1, text: 'Дуже задоволена покупками в Сільпо...', rating: 4, sentiment: 'positive' },
    { id: 2, text: 'Залишився незадоволений...', rating: 2, sentiment: 'negative' },
    { id: 3, text: 'Люблю цей магазин за великий вибір...', rating: 4, sentiment: 'positive' },
  ]);

  if (!place) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body>
          <div>Завантаження...</div>
        </Modal.Body>
      </Modal>
    );
  }

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    const selectedFilters = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const dataToSave = {
      filters: selectedFilters,
      radius,
      newBalance: parseFloat(currentBalance) + parseFloat(addBalance),
    };

    console.log('Збережено:', dataToSave);

    setCurrentBalance(dataToSave.newBalance.toString());
    setAddBalance('0');
  };

  const handleDeleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Modal show={show} onHide={onHide} fullscreen centered>
      <Modal.Body style={{ backgroundColor: '#f1eaea', overflowY: 'auto' }}>
        <div className="px-4 pt-3 mb-2">
          <div
            onClick={onHide}
            style={{ cursor: 'pointer', color: '#0d6efd', fontWeight: '500' }}
          >
            ← Повернутися
          </div>
        </div>

        <div className="bg-white rounded-4 shadow-sm p-4 mx-3 mb-4 d-flex flex-wrap gap-4">
          <div style={{ minWidth: '300px', flex: '1 1 300px' }}>
            <div className="fw-bold fs-5 mb-2">Назва: {place.title}</div>
            <div>Адрес: вулиця Академіка Павлова, 44 6, Харків, Харківська область, 61000</div>
            <div>PlaceId: ChIJURDKN2eAhYARN0AMzUEaiKo</div>
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-warning">Відв’язати</button>
              <button className="btn btn-danger">Видалити</button>
            </div>
          </div>

          <div style={{ minWidth: '300px', flex: '1 1 300px' }}>
            <div className="fw-semibold mb-2">Фільтри для показу реклами</div>
            <Form.Group>
              {['ресторани', 'кафе', 'магазини', 'банки', 'туризм'].map((name) => (
                <Form.Check
                  key={name}
                  type="checkbox"
                  label={name[0].toUpperCase() + name.slice(1)}
                  name={name}
                  checked={filters[name]}
                  onChange={handleFilterChange}
                />
              ))}
            </Form.Group>
            <div className="mt-3">Радіус</div>
            <Form.Check
              type="radio"
              label="1 км"
              name="radius"
              checked={radius === '1'}
              onChange={() => setRadius('1')}
            />
            <Form.Check
              type="radio"
              label="1-5 км"
              name="radius"
              checked={radius === '1-5'}
              onChange={() => setRadius('1-5')}
            />
            <Form.Check
              type="radio"
              label="10 км або більше"
              name="radius"
              checked={radius === '10+'}
              onChange={() => setRadius('10+')}
            />
          </div>

          <div style={{ minWidth: '300px', flex: '1 1 300px' }}>
            <div className="fw-semibold mb-2">Баланс реклами</div>
            <div className="mb-3">
              <div>Зараз на рахунку</div>
              <Form.Control
                type="text"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
              />
            </div>
            <div>
              <div>Додати</div>
              <Form.Control
                type="text"
                value={addBalance}
                onChange={(e) => setAddBalance(e.target.value)}
              />
            </div>
            <button className="btn btn-success mt-3" onClick={handleSave}>
              Зберегти зміни
            </button>
          </div>
        </div>

        <div className="bg-white rounded-4 shadow-sm p-4 mx-3">
          <Row>
            <Col md={4}>
              <h6 className="fw-bold">Статистика</h6>
              <div>Було показано разів: 100</div>
              <div>Було обрано разів: 20</div>
              <div>Додано в “Улюблене”: 20</div>
            </Col>
            <Col md={8}>
              <h6 className="fw-bold">Відгуки</h6>
              <div className="mb-2">
                <span className="badge bg-success me-2">
                  Позитивних: {reviews.filter((r) => r.sentiment === 'positive').length}
                </span>
                <span className="badge bg-danger">
                  Негативних: {reviews.filter((r) => r.sentiment === 'negative').length}
                </span>
              </div>

              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="position-relative border rounded-3 p-3 mb-3"
                  style={{
                    borderLeft: `8px solid ${review.sentiment === 'positive' ? 'green' : 'red'}`,
                  }}
                >
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
                    aria-label="Видалити"
                  >
                    ✕
                  </button>
                  <div>
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                  <p>{review.text}</p>
                </div>
              ))}
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default StatisticAdmin;
