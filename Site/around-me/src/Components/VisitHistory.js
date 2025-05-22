import React from 'react';
import HistoryCard from './HistoryCard';

export default function VisitHistory({ places = [], onClear, onGoTo }) {
  if (!Array.isArray(places)) return null;

  if (places.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', fontSize: '1rem', color: '#555' }}>
        Історія відвідувань порожня.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
      {places.map((place, idx) => (
        <div key={idx} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
          <HistoryCard
            image={place.image}
            title={place.title}
            locationText={place.locationText}
            dateVisited={place.dateVisited}
            onClear={() => onClear(idx)}
            onGoTo={() => onGoTo(idx)}
          />
        </div>
      ))}
    </div>
  );
}
