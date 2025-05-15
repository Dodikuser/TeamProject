import React, { useState } from 'react';

import { Container, Form, FormControl, Button, Row, Col, Offcanvas } from 'react-bootstrap';

function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
return (
    <div className="bg-white py-3 px-4 mt-2">
      <Container fluid>
        <Form className="d-flex">
          <div className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
            <FormControl
              type="search"
              placeholder="Запит"
              className="bg-light border-0 rounded px-3 py-3"
              style={{ height: '60px' }}
            />
            <span className="material-symbols-outlined position-absolute bottom-0 end-0 me-3 mb-2 text-secondary" style={{ cursor: 'pointer' }}>
              mic
            </span>
          </div>
        </Form>

                <Row className="mt-3">
          <Col xs="auto">
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-2"
              onClick={() => setShowFilters(true)}
            >
              <span className="material-symbols-outlined">filter_list</span>
              Фільтри
            </Button>
          </Col>

          <Col xs="auto">
          <Button
          variant="outline-secondary"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowSort(true)}
        >
          <span className="material-symbols-outlined">sort</span>
          Сортувати
        </Button>

          </Col>
        </Row>

      </Container>
             <Offcanvas
  show={showFilters}
  onHide={() => setShowFilters(false)}
  placement="start"
>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Фільтри</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body className="d-flex flex-column">
    <div className="flex-grow-1 overflow-auto pe-2">
      <Form>
        <Form.Check label="Тільки невідвідані" />

        <hr />
        <div className="fw-semibold mt-3 mb-2">Напрями</div>
        {[
          '#Туризм', '#Їжа', '#Природа', '#Шопінг',
          '#Історія', '#Спорт', '#Для дітей',
          '#Романтика', '#Екзотика', '#Тихі місця',
        ].map((label, i) => (
          <Form.Check key={i} label={label} />
        ))}

        <hr />
        <div className="fw-semibold mt-3 mb-2">Рейтинг</div>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {[5, 4, 3, 2].map((star) => (
            <Button key={star} variant="light" className="border rounded px-3 py-2 d-flex align-items-center gap-1">
              <span className="material-symbols-outlined">star</span>
              {star}.0+
            </Button>
          ))}
        </div>

        <Form.Check label="Відчинено зараз" />

        <hr />
        <div className="fw-semibold mt-3 mb-2">Відстань</div>
        {['1 км', '1–5 км', '10 км або більше'].map((label, i) => (
          <Form.Check
            key={i}
            label={label}
            name="distance"
            type="radio"
            id={`distance-${i}`}
          />
        ))}
      </Form>
    </div>

    {/* Apply Button */}
    <div className="border-top pt-3">
          <Button
      style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
      className="w-100 text-white"
      onClick={() => setShowFilters(false)}
    >
      Застосувати
    </Button>

    </div>
  </Offcanvas.Body>
</Offcanvas>
<Offcanvas
  show={showSort}
  onHide={() => setShowSort(false)}
  placement="start"
>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Сортувати за категорією</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body className="d-flex flex-column gap-3">
    <div>
      <div className="fw-semibold mb-2">Відстань</div>
      <Form.Check name="distance" type="radio" label="від ближнього до дальнього" />
      <Form.Check name="distance" type="radio" label="від дальнього до ближнього" />
    </div>

    <div>
      <div className="fw-semibold mb-2">Рейтинг</div>
      <Form.Check name="rating" type="radio" label="від найвищого до найнижчого" />
      <Form.Check name="rating" type="radio" label="від найнижчого до найвищого" />
    </div>

    <div>
      <div className="fw-semibold mb-2">Ціна</div>
      <Form.Check name="price" type="radio" label="від дешевих до дорогих" />
      <Form.Check name="price" type="radio" label="від дорогих до дешевих" />
    </div>

    <div className="border-top pt-3 mt-3">
      <Button
        style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
        className="w-100 text-white"
        onClick={() => setShowSort(false)}
      >
        Застосувати
      </Button>
    </div>
  </Offcanvas.Body>
</Offcanvas>

    </div>
  );
}

export default Home;
