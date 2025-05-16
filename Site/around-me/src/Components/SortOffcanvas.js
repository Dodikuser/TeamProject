import React from 'react';
import { Offcanvas, Button, Form } from 'react-bootstrap';

export default function SortOffcanvas({ show, onClose }) {
  return (
    <Offcanvas show={show} onHide={onClose} placement="start">
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
            onClick={onClose}
          >
            Застосувати
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
