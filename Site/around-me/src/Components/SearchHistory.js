import React from 'react';
import { Button } from 'react-bootstrap';

export default function SearchHistory({ searches = [], onGoToSearch, onClearSearch }) {
  if (!Array.isArray(searches)) {
    console.error('SearchHistory: `searches` is not an array', searches);
    return null;
  }

  if (searches.length === 0) {
    return (
      <div className="text-center text-muted mt-5">
        <p>Історія пошуку порожня.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {searches.map(({ query, date, time }, idx) => (
        <div
          key={idx}
          className="d-flex justify-content-between align-items-center p-3 bg-white rounded-3 shadow-sm mb-2"
          style={{ maxWidth: '700px', margin: '0 auto' }}
        >
          <div>
            <div className="fw-semibold">{query}</div>
            <small className="text-muted">{date} • {time}</small>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => onGoToSearch(query)}
              className="custom-animated-button"
            >
              Перейти
            </Button>
            <span
              className="material-symbols-outlined text-muted"
              role="button"
              style={{ cursor: 'pointer' }}
              onClick={() => onClearSearch(idx)}
              title="Видалити"
            >
              delete
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
