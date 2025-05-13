import React from 'react';
import { Container, Navbar, Form, FormControl, Button, Row, Col} from 'react-bootstrap';

function Header() {
  const brandStyle = {
    display: 'flex',
    alignItems: 'center',
    color: 'black',
    fontFamily: "'Righteous', sans-serif",
    fontSize: '28px',
    marginLeft: '-80px',
    paddingTop: '4px',
    paddingBottom: '4px',
    height: '48px',
    minHeight: '48px',
  };

  const navbarStyle = {
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    zIndex: 1000,
  };

  const logoIconStyle = {
    fontSize: '46px',
    marginRight: '20px',
    color: '#626FC2',
  };

  const iconContainerStyle = {
    display: 'flex',
    gap: '50px',
    alignItems: 'center',
    marginLeft: '160px',
  };

  const iconItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '12px',
    color: '#5F6368',
    textDecoration: 'none',
  };

  const iconStyle = {
    fontSize: '28px',
  };

  const rightIconsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginLeft: '580px',
    color: '#5F6368',
  };

  const notifIcon = { fontSize: '32px' };
  const accountIcon = { fontSize: '46px' };
  const arrowIcon = { fontSize: '28px' };

  

  return (
    <>
      <Navbar style={navbarStyle} expand="lg">
        <Container className="d-flex align-items-center justify-content-start">
          <Navbar.Brand href="#" style={brandStyle}>
            <span className="material-symbols-outlined" style={logoIconStyle}>location_on</span>
            Around Me
          </Navbar.Brand>

          <div style={iconContainerStyle}>
            <div style={iconItemStyle}>
              <span className="material-symbols-outlined" style={iconStyle}>home</span>
              <span>Головна</span>
            </div>
            <div style={iconItemStyle}>
              <span className="material-symbols-outlined" style={iconStyle}>favorite</span>
              <span>Улюблене</span>
            </div>
            <div style={iconItemStyle}>
              <span className="material-symbols-outlined" style={iconStyle}>recommend</span>
              <span>Рекомендації</span>
            </div>
            <div style={iconItemStyle}>
              <span className="material-symbols-outlined" style={iconStyle}>history</span>
              <span>Історія</span>
            </div>
          </div>
          <div style={rightIconsStyle}>
            <span className="material-symbols-outlined" style={notifIcon}>notifications</span>
            <span className="material-symbols-outlined" style={accountIcon}>account_circle</span>
            <span className="material-symbols-outlined" style={arrowIcon}>keyboard_arrow_down</span>
          </div>
        </Container>
      </Navbar>

      <div style={{ backgroundColor: 'white', padding: '12px 20px', marginTop: '10px' }}>
        <Container fluid="true" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Form className="d-flex">
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <FormControl
                type="search"
                placeholder="Запит"
                className="me-2"
                style={{
                  width: '100%',
                  fontSize: '14px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: '#ECE6F0',
                  color: '#49454F',
                  height: '80px',
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '16px',
                  fontSize: '24px',
                  color: '#5F6368',
                  cursor: 'pointer',
                }}
              >
                mic
              </span>
            </div>
          </Form>

       
          <Row className="mt-3">
  <Col xs="auto">
    <Button
      variant="outline-secondary"
      className="d-flex align-items-center"
      style={{ gap: '6px' }}
    >
      <span className="material-symbols-outlined">filter_list</span>
      Фільтри
    </Button>
  </Col>
  <Col xs="auto">
    <Button
      variant="outline-secondary"
      className="d-flex align-items-center"
      style={{ gap: '6px' }}
    >
      <span className="material-symbols-outlined">sort</span>
      Сортувати
    </Button>
  </Col>
</Row>

        </Container>
      </div>
       
      
    </>
  );
}

export default Header;
