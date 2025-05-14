import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleClear = (field) => {
    setFormData({ ...formData, [field]: '' });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-white"
      style={{ height: '90vh' }}
    >
      <Card
        className="p-4 shadow rounded border-primary"
        style={{ width: '100%', maxWidth: '650px', borderWidth: '2px' }}
      >
        <h3 className="fw-bold">Твій аккаунт</h3>
        <p className="text-primary">Ласкаво просимо до AroundMe!</p>

        <h5 className="mt-1 mb-3">{isLogin ? 'Вхід' : 'Реєстрація'}</h5>

        <Form>
          {/* Ім’я */}
          <Form.Group controlId="firstName" className="mb-3 position-relative">
            <Form.Control
              type="text"
              placeholder="Ім’я"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              className="bg-light-subtle p-2 pe-5"
            />
            {formData.firstName && (
              <i
                className="bi bi-x-circle-fill"
                onClick={() => handleClear('firstName')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6c757d'
                }}
              ></i>
            )}
          </Form.Group>

          {/* Прізвище */}
          <Form.Group controlId="lastName" className="mb-3 position-relative">
            <Form.Control
              type="text"
              placeholder="Прізвище"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              className="bg-light-subtle p-2 pe-5"
            />
            {formData.lastName && (
              <i
                className="bi bi-x-circle-fill"
                onClick={() => handleClear('lastName')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6c757d'
                }}
              ></i>
            )}
          </Form.Group>

          {/* Email */}
          <Form.Group controlId="email" className="mb-3 position-relative">
            <Form.Control
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange('email')}
              className="bg-light-subtle p-2 pe-5"
            />
            {formData.email && (
              <i
                className="bi bi-x-circle-fill"
                onClick={() => handleClear('email')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6c757d'
                }}
              ></i>
            )}
          </Form.Group>

          {/* Пароль */}
          <Form.Group controlId="password" className="mb-3 position-relative">
            <Form.Control
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange('password')}
              className="bg-light-subtle p-2 pe-5"
            />
            {formData.password && (
              <i
                className="bi bi-x-circle-fill"
                onClick={() => handleClear('password')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6c757d'
                }}
              ></i>
            )}
          </Form.Group>

          <Button
            type="submit"
            className="w-100 fw-bold"
            style={{ backgroundColor: '#5C6BC0', borderColor: '#5C6BC0' }}
          >
            {isLogin ? 'Вхід' : 'Зареєструватися'}
          </Button>

          <div className="text-left mt-3">
            <small>
              {isLogin ? 'Ще не маєте аккаунту?' : 'Вже маєте аккаунт?'}{' '}
              <strong className="text-dark link-hover" onClick={toggleForm}>
                {isLogin ? 'Реєстрація' : 'Вхід'}
              </strong>
            </small>
          </div>

          <div className="d-flex align-items-center my-2">
            <hr className="flex-grow-1" />
            <div className="px-2 text-muted text-nowrap">Або</div>
            <hr className="flex-grow-1" />
          </div>

          <Row className="justify-content-center gap-3">
            <Col xs="auto">
              <i className="bi bi-facebook social-icon facebook"></i>
            </Col>
            <Col xs="auto">
              <i className="bi bi-google social-icon google"></i>
            </Col>
          </Row>
        </Form>

        {/* Стилі для підсвічування */}
        <style>
          {`
            .link-hover {
              cursor: pointer;
              transition: color 0.2s, text-decoration 0.2s;
            }
            .link-hover:hover {
              color: #5C6BC0;
              text-decoration: underline;
            }

            .social-icon {
              font-size: 32px;
              transition: opacity 0.2s, transform 0.2s;
              cursor: pointer;
            }
            .social-icon:hover {
              opacity: 0.7;
              transform: scale(1.1);
            }
            .facebook {
              color: #3b5998;
            }
            .google {
              color: #db4437;
            }
          `}
        </style>
      </Card>
    </Container>
  );
}
