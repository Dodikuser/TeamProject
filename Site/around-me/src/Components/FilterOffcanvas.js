import React from 'react';
import { Offcanvas, Button, Form } from 'react-bootstrap';

export default function FilterOffcanvas({ show, onClose }) {
  return (
    <Offcanvas show={show} onHide={onClose} placement="start">
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
        <div className="border-top pt-3">
          <Button
            style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
            className="w-100 text-white"
            onClick={onClose}
          >
            Застосувати
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
