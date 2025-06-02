import React from 'react';
import { Card, Button } from 'react-bootstrap';
import HistoryService from '../services/HistoryService';

export default function SearchHistoryCard({
  id,
  historyId,
  searchTerm,
  searchDate,
  results = [],
  onClear,
  onSearch,
}) {
  const handleClear = async () => {
    try {
      await HistoryService.deleteSearchHistoryItem({ id, searchTerm, searchDate });
      if (onClear) {
        onClear(id);
      }
    } catch (error) {
      console.error('Помилка при видаленні історії пошуку:', error);
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <Card.Title className="h6 mb-1">{searchTerm}</Card.Title>
            <small className="text-muted">{searchDate}</small>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onSearch(searchTerm)}
              className="d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                search
              </span>
              Шукати
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleClear}
              className="d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                delete
              </span>
              Видалити
            </Button>
          </div>
        </div>
        {results.length > 0 && (
          <div>
            <small className="text-muted d-block mb-2">Результати:</small>
            <div className="d-flex flex-wrap gap-2">
              {results.map((result, index) => (
                <span
                  key={index}
                  className="badge bg-light text-dark border"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSearch(result.placeTitle)}
                >
                  {result.placeTitle}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
} 