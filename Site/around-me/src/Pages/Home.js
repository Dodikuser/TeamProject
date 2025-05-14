import React from 'react';
import { Container, Form, FormControl, Button, Row, Col } from 'react-bootstrap';


function Home() {
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
  );
}

export default Home;
