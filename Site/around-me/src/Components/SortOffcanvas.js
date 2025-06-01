import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Form } from 'react-bootstrap';

export default function SortOffcanvas({ show, onClose, onSort, currentSortType, currentSortOrder }) {
  const [sortType, setSortType] = useState(currentSortType || '');
  const [sortOrder, setSortOrder] = useState(currentSortOrder || 'asc');

  useEffect(() => {
    setSortType(currentSortType || '');
    setSortOrder(currentSortOrder || 'asc');
  }, [currentSortType, currentSortOrder]);

  const handleApply = () => {
    onSort?.(sortType, sortOrder);
    onClose();
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Сортувати за категорією</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column gap-3">
        <div>
          <div className="fw-semibold mb-2">Відстань</div>
          <Form.Check 
            name="sortType" 
            type="radio" 
            label="від ближнього до дальнього" 
            checked={sortType === 'distance' && sortOrder === 'asc'}
            onChange={() => {
              setSortType('distance');
              setSortOrder('asc');
            }}
          />
          <Form.Check 
            name="sortType" 
            type="radio" 
            label="від дальнього до ближнього" 
            checked={sortType === 'distance' && sortOrder === 'desc'}
            onChange={() => {
              setSortType('distance');
              setSortOrder('desc');
            }}
          />
        </div>
        <div>
          <div className="fw-semibold mb-2">Рейтинг</div>
          <Form.Check 
            name="sortType" 
            type="radio" 
            label="від найвищого до найнижчого" 
            checked={sortType === 'rating' && sortOrder === 'desc'}
            onChange={() => {
              setSortType('rating');
              setSortOrder('desc');
            }}
          />
          <Form.Check 
            name="sortType" 
            type="radio" 
            label="від найнижчого до найвищого" 
            checked={sortType === 'rating' && sortOrder === 'asc'}
            onChange={() => {
              setSortType('rating');
              setSortOrder('asc');
            }}
          />
        </div>
        <div>
          <div className="fw-semibold mb-2">Ціна</div>
          <Form.Check 
            name="sortType" 
            type="radio" 
            label="від дешевих до дорогих" 
            checked={sortType === 'price' && sortOrder === 'asc'}
            onChange={() => {
              setSortType('price');
              setSortOrder('asc');
            }}
          />
          <Form.Check 
            name="sortType" 
            type="radio" 
            label="від дорогих до дешевих" 
            checked={sortType === 'price' && sortOrder === 'desc'}
            onChange={() => {
              setSortType('price');
              setSortOrder('desc');
            }}
          />
        </div>
        <div className="border-top pt-3 mt-3">
          <Button
            style={{ backgroundColor: '#626FC2', borderColor: '#626FC2' }}
            className="w-100 text-white"
            onClick={handleApply}
          >
            Застосувати
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
