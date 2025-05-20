import React, { useState } from 'react';
import { Container, Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import FilterOffcanvas from '../Components/FilterOffcanvas';
import SortOffcanvas from '../Components/SortOffcanvas';


function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="bg-white py-3 px-4 mt-2">
      <Container fluid>
        <Form className="d-flex justify-content-start w-100 px-2">
  <div
    className="position-relative w-100"
    style={{
      maxWidth: '20%',
    }}
  >
    <FormControl
      type="search"
      placeholder="Запит"
      className="bg-light border-0 rounded px-3 py-3"
      style={{
        height: '60px',
        paddingRight: '45px', 
      }}
    />
    <span
      className="material-symbols-outlined position-absolute"
      style={{
        bottom: '10px',
        right: '15px',
        color: '#6c757d',
        cursor: 'pointer',
      }}
    >
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

      <FilterOffcanvas show={showFilters} onClose={() => setShowFilters(false)} />
      <SortOffcanvas show={showSort} onClose={() => setShowSort(false)} />
    </div>
  );
}

export default Home;
