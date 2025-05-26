import React, { useState } from 'react';

import { Container, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationsMenu from './NotificationsMenu';
import { useAuth } from '../context/AuthContext';


function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
const [showLanguageMenu, setShowLanguageMenu] = useState(false);
const { isAuthenticated, logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/');
};

  return (
    <Navbar expand="lg" className="shadow-sm bg-white py-2 sticky-top">
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 text-dark fw-bold fs-4"
          style={{ fontFamily: "'Righteous', sans-serif" }}
        >
          <span className="material-symbols-outlined fs-2 text-primary">location_on</span>
          Around Me
        </Navbar.Brand>

        <div className="d-flex gap-4 align-items-center mx-auto">
          {[
            { icon: 'home', label: 'Головна', path: '/' },
            { icon: 'favorite', label: 'Улюблене', path: '/favorites' },
            { icon: 'recommend', label: 'Рекомендації', path: '/recommendations' },
            { icon: 'history', label: 'Історія', path: '/history' },
          ].map((item, idx) => {
            const isActive = currentPath === item.path;

            return (
              <Link
              key={idx}
              to={item.path}
              className="text-center small text-decoration-none"
              style={{ color: isActive ? '#626FC2' : '#6c757d' }}
            >
              <span className="material-symbols-outlined d-block">
                {item.icon}
              </span>
              {item.label}
            </Link>

            );
          })}
        </div>

        <div className="d-flex align-items-center gap-3 ms-auto text-secondary">
         <NotificationsMenu />


          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 text-decoration-none text-secondary d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined fs-1">account_circle</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-3">
              {!isAuthenticated ? (
                <Dropdown.Item as={Link} to="/login">Вхід / Реєстрація</Dropdown.Item>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/account">Мій акаунт</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-places">Мої заклади</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Вийти</Dropdown.Item>
                </>
              )}
              <Dropdown.Item onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
                Мова інтерфейсу
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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

export default Header;
