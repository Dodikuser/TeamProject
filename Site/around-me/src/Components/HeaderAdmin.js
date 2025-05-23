import React, { useState } from 'react';
import { Container, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
//import NotificationsMenu from './NotificationsMenu'; // можно закомментировать, если не используете

function HeaderAdmin() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <Navbar expand="lg" className="shadow-sm bg-white py-2 sticky-top">
      <Container fluid>
        {/* Логотип */}
        <Navbar.Brand
          as={Link}
          to="/admin"
          className="d-flex align-items-center gap-2 text-dark fw-bold fs-4"
          style={{ fontFamily: "'Righteous', sans-serif" }}
        >
          <span className="material-symbols-outlined fs-2 text-primary">location_on</span>
          AroundMe
        </Navbar.Brand>

        {/* Меню навигации — только "Головна" */}
        <div className="d-flex gap-4 align-items-center mx-auto">
          <Link
            to="/admin"
            className="text-center small text-decoration-none"
            style={{ color: currentPath === '/admin' ? '#626FC2' : '#6c757d' }}
          >
            <span className="material-symbols-outlined d-block">home</span>
            Головна
          </Link>
        </div>

        {/* Правый блок: уведомления и профиль */}
        <div className="d-flex align-items-center gap-3 ms-auto text-secondary">
          {/* <NotificationsMenu /> если не нужен — удалить компонент */} 

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 text-decoration-none text-secondary d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined fs-1">account_circle</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-3">
              <Dropdown.Item onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
                Мова інтерфейсу
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/login">Вихід</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Языковое меню */}
          {showLanguageMenu && (
            <div
              className="position-absolute bg-white border rounded shadow p-3"
              style={{
                top: '70px',
                right: '10px',
                width: '200px',
                zIndex: 1050,
              }}
            >
              <div className="d-flex align-items-center mb-3 gap-2">
                <span
                  className="material-symbols-outlined cursor-pointer"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowLanguageMenu(false)}
                >
                  arrow_back
                </span>
                <span className="fw-semibold">Обрати мову</span>
              </div>

              <div className="d-flex flex-column gap-2">
                <label className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
                  <span>Українська (uk)</span>
                  <input type="radio" name="language" value="uk" />
                </label>
                <label className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
                  <span>Англійська (en)</span>
                  <input type="radio" name="language" value="en" />
                </label>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Navbar>
  );
}

export default HeaderAdmin;
