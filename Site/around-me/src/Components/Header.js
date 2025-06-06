import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
const { t, i18n } = useTranslation();

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
            { icon: 'home', label: t('home'), path: '/' },
            { icon: 'favorite', label: t('favorites'), path: '/favorites' },
            { icon: 'recommend', label: t('recommendations'), path: '/recommendations' },
            { icon: 'history', label: t('history'), path: '/history' },
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
                <Dropdown.Item as={Link} to="/login">{t('login_register')}</Dropdown.Item>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/account">{t('my_account')}</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/my-places">{t('my_places')}</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>{t('logout')}</Dropdown.Item>
                </>
              )}
              <Dropdown.Item onClick={() => setShowLanguageMenu(!showLanguageMenu)}>
                {t('interface_language')}
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
      <span className="fw-semibold">{t('choose_language')}</span>
    </div>

    <div className="d-flex flex-column gap-2">
      <label className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
        <span>{t('ukrainian')}</span>
        <input
          type="radio"
          name="language"
          value="uk"
          checked={i18n.language === 'uk'}
          onChange={() => i18n.changeLanguage('uk')}
        />
      </label>
      <label className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
        <span>{t('english')}</span>
        <input
          type="radio"
          name="language"
          value="en"
          checked={i18n.language === 'en'}
          onChange={() => i18n.changeLanguage('en')}
        />
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
