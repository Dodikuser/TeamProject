import React from 'react';
import { Container, Navbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Navbar expand="lg" className="shadow-sm bg-white py-2">
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
          <span className="material-symbols-outlined fs-4">notifications</span>

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="p-0 text-decoration-none text-secondary d-flex align-items-center gap-1"
            >
              <span className="material-symbols-outlined fs-1">account_circle</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="mt-3">
              <Dropdown.Item as={Link} to="/login">Вхід / Реєстрація</Dropdown.Item>
              <Dropdown.Item href="#language">Мова інтерфейсу</Dropdown.Item>
              <Dropdown.Item as={Link} to="/my-places">Мої заклади</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
