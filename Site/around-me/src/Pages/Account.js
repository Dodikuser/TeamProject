import React from 'react';

const reviews = [
  {
    placeName: 'Назва місця',
    address: 'вулиця Академіка Павлова, 446, Харків, Харківська область',
    rating: 4,
    comment: 'Відгук про місце...',
    image: 'https://via.placeholder.com/120x80',
  },
];

const AccountPage = () => (
  <div className="container py-5" style={{ fontFamily: 'Arial, sans-serif' }}>
    {/* Обліковий запис */}
    <div className="card mb-4 p-4">
      <h2 className="h5 mb-3">Обліковий запис</h2>
      <div className="row align-items-center gx-4">
  {/* Иконка профиля со смещением */}
  <div className="col-auto ms-4">
    <div
      className="rounded-circle d-flex align-items-center justify-content-center"
      style={{
        width: '130px',
        height: '130px',
        backgroundColor: '#ddd',
        fontSize: '3rem',
        color: '#666',
      }}
    >
      <span className="material-symbols-outlined">person</span>
    </div>
  </div>

  {/* Характеристика со смещением */}
  <div className="col ps-3">
    <h5>Ім’я Прізвище</h5>
    <a
      href="mailto:example@gmail.com"
      className="d-block mb-1 text-primary text-decoration-none"
    >
      example@gmail.com
    </a>
    <p className="mb-2 text-muted">Дата реєстрації: 25.04.2025</p>
    <button className="btn btn-primary btn-sm me-2">Змінити</button>
    <button className="btn btn-secondary btn-sm">Вийти</button>
  </div>
</div>

    </div>

    {/* Мої відгуки */}
    <div
  className="card p-4"
  style={{ minHeight: '250px', display: 'flex', flexDirection: 'column' }}
>
  <h3 className="h6 mb-3">Мої відгуки</h3>
  <div style={{ overflowY: 'auto', flexGrow: 1 }}>
    {reviews.map((r, i) => (
      <div
        key={i}
        className="d-flex justify-content-between align-items-center border-bottom py-3"
      >
        <div className="flex-grow-1 pe-3">
          <h6 className="mb-1">{r.placeName}</h6>
          <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
            Адреса: {r.address}
          </p>
          <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>
            {'★'.repeat(r.rating)}
            {'☆'.repeat(5 - r.rating)}
          </div>
          {r.comment && (
            <p className="mb-0 mt-1" style={{ fontSize: '0.9rem' }}>
              Коментар: {r.comment}
            </p>
          )}
        </div>
        <div className="text-end">
          <button className="btn btn-primary btn-sm">Перейти</button>
        </div>
      </div>
    ))}
  </div>
</div>

  </div>
);

export default AccountPage;
