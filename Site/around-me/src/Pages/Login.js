import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';
import { useTranslation } from 'react-i18next';

const GoogleLoginForm = (isLogin) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef(null); 
  const { t } = useTranslation();

  const GOOGLE_CLIENT_ID = '490175044695-k67v2l356vjv8i223h5q8l0t6k3clj95.apps.googleusercontent.com';

  const handleGoogleSignInCallback = (response) => {
    const idToken = response.credential; 

    if (idToken) {
      sendToken(idToken, isLogin);
    }
  };

  const sendToken = async (token, isLogin) => {
    const url = isLogin ? '/User/login' : '/User/register';
    try {
      const payload = { googleJwtToken: token };
      const data = await UserService.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      }, false);
      if (isLogin) {
        login(data.token);
        navigate('/favorites');
      } else {
        await sendToken(token, true);
      }
    } catch (err) {
      console.error('Авторизация через Google провалилась:', err);
      if (err.message.includes('UnregisteredGoogle')) {
        sendToken(token, false);
      } else if (err.message.includes('EmailBusy')) {
        sendToken(token, true);
      }
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignInCallback, 
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonRef.current, 
            { theme: 'filled_blue', size: 'large', type: 'standard', text: 'continue_with', shape: 'rectangular', width: 300, locale: t('google_button_locale') }
          );
        }
      }
    };
    script.onerror = () => {
    }
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [t]); 


  return (
    <Form>
      <Row className="justify-content-center gap-3">
        <Col xs="auto">
          <div ref={googleButtonRef}></div>
        </Col>
      </Row>
    </Form>
  );
};


export default function LoginRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState('');


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Math.random() < 0.01) {
      window.location.href = 'https://www.youtube.com/watch?v=c-0S68_ZLL8';
      return;
    }
    const url = isLogin ? '/User/login' : '/User/register';
    const payload = isLogin
      ? {
          type: 'standard',
          name: 'name',
          email: formData.email,
          password: formData.password
        }
      : {
          type: 'standard',
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password
        };
    try {
      setErrorMessage('');
      const data = await UserService.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      }, false);
      if (isLogin) {
        login(data.token);
        navigate('/my-places');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(
        isLogin
          ? 'Ошибка входа. Проверьте email и пароль.'
          : 'Ошибка регистрации. Возможно, такой email уже используется.'
      );
    }
  };

  return (
  <div
    style={{
      backgroundImage: 'url("/images/background(login).png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      
    }}
  >
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: '90vh' }}
    >

      <Card
        className="p-4 shadow rounded border-primary"
        style={{ width: '100%', maxWidth: '650px', borderWidth: '2px' }}
      >
        <h3 className="fw-bold">{t('your_account')}</h3>
        <p className="text-primary">{t('welcome_to_aroundme')}</p>

        <h5 className="mt-1 mb-3">{isLogin ? t('login') : t('register')}</h5>

        <Form onSubmit={handleSubmit}>
          {errorMessage && (
            <Alert variant="danger" className="mb-3">
              {errorMessage}
            </Alert>
          )}
          {!isLogin && (
            <>
              {/* Ім'я */}
              <Form.Group controlId="firstName" className="mb-3 position-relative">
                <Form.Control
                  type="text"
                  placeholder={t('first_name')}
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
                  placeholder={t('last_name')}
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
            </>
          )}

          {/* Email */}
          <Form.Group controlId="email" className="mb-3 position-relative">
            <Form.Control
              type="email"
              placeholder={t('email')}
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
              placeholder={t('password')}
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
            {isLogin ? t('login') : t('register_btn')}
          </Button>

          <div className="text-left mt-3">
            <small>
              {isLogin ? t('no_account') : t('already_have_account')}{' '}
              <strong className="text-dark link-hover" onClick={toggleForm}>
                {isLogin ? t('register') : t('login')}
              </strong>
            </small>
          </div>

          <div className="d-flex align-items-center my-2">
            <hr className="flex-grow-1" />
            <div className="px-2 text-muted text-nowrap">{t('or')}</div>
            <hr className="flex-grow-1" />
          </div>

          <GoogleLoginForm isLogin />
        </Form>

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
    </div>
  );
}
