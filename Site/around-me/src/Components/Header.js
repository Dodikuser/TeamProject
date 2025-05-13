import React from 'react';
import { Container, Navbar, Form, FormControl, Button, Row, Col } from 'react-bootstrap';

function Header() {
  return (
    <>
      <Navbar expand="lg" className="shadow-sm bg-white py-2">
        <Container fluid>
          <Navbar.Brand href="#" className="d-flex align-items-center gap-2 text-dark fw-bold fs-4" style={{ fontFamily: "'Righteous', sans-serif" }}>
            <span className="material-symbols-outlined fs-2 text-primary">location_on</span>
            Around Me
          </Navbar.Brand>

          <div className="d-flex gap-4 align-items-center mx-auto">
            {['home', 'favorite', 'recommend', 'history'].map((icon, idx) => (
              <div key={idx} className="text-center text-secondary small">
                <span className="material-symbols-outlined d-block">{icon}</span>
                {['Головна', 'Улюблене', 'Рекомендації', 'Історія'][idx]}
              </div>
            ))}
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto text-secondary">
            <span className="material-symbols-outlined fs-4">notifications</span>
            <span className="material-symbols-outlined fs-1">account_circle</span>
            <span className="material-symbols-outlined fs-4">keyboard_arrow_down</span>
          </div>
        </Container>
      </Navbar>

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
              <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined">filter_list</span>
                Фільтри
              </Button>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" className="d-flex align-items-center gap-2">
                <span className="material-symbols-outlined">sort</span>
                Сортувати
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Header;
