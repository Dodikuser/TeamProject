import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useEffect } from 'react';

const GoogleLoginForm = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

 const handleGoogleLogin = () => {
  const clientId = '490175044695-k67v2l356vjv8i223h5q8l0t6k3clj95.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000';
  const scope = 'email profile openid';

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(scope)}`;

  const width = 600;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  const popup = window.open(
    authUrl,
    'googleLoginPopup',
    `width=${width},height=${height},top=${top},left=${left}`
  );

  const interval = setInterval(() => {
    try {
      if (popup.location.href.includes(redirectUri)) {
        const hash = popup.location.hash;
        const params = new URLSearchParams(hash.substr(1));
        const token = params.get('access_token');
        console.log('TOKEN:', token);
        handleCredentialResponse(token);
        popup.close();
        clearInterval(interval);
      }
    } catch (err) {
    }
  }, 1000);
};


  const handleCredentialResponse = (token) => {
    //const token = response.credential;

    fetch('https://localhost:7103/api/user/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '',
    email: '',
    password: '',
    googleId: token,
    facebookId: ''
  })
})
  .then(res => {
    if (!res.ok) throw new Error('Ошибка регистрации');
    return res.text();
  })
  .then(data => {
    console.log('Успешно зарегистрирован через Google:', data);
  })
  .catch(err => {
    console.error('Регистрация через Google провалилась:', err);
  });

  };

  return (
    <Form>
      <Row className="justify-content-center gap-3">
        <Col xs="auto">
          <i className="bi bi-facebook social-icon facebook"></i>
        </Col>
        <Col xs="auto">
          <i
            className="bi bi-google social-icon google"
            style={{ cursor: 'pointer' }}
            onClick={handleGoogleLogin}
          ></i>
        </Col>
      </Row>
    </Form>
  );
};


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const SERVER_URL = 'https://localhost:7103/api/User';
    const url = isLogin ? `${SERVER_URL}/login` : `${SERVER_URL}/register`;


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
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (isLogin){
        localStorage.setItem('authToken', data.token);
        const token = localStorage.getItem('authToken');
      console.log('Token:', token);
      }
      console.log('Response:', data);

    } catch (error) {
      console.error('Error:', error);
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
        <h3 className="fw-bold">Твій аккаунт</h3>
        <p className="text-primary">Ласкаво просимо до AroundMe!</p>

        <h5 className="mt-1 mb-3">{isLogin ? 'Вхід' : 'Реєстрація'}</h5>

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
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
            </>
          )}

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

          <GoogleLoginForm />
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
