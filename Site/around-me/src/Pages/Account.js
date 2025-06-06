import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import ReviewService from '../services/ReviewService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BuyTokens from '../Components/BuyTokens';

const AccountPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [showBuyTokens, setShowBuyTokens] = useState(false);
  const [tokensAvailable, setTokensAvailable] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await UserService.getUserData();
        if (userData) {
          setName(userData.name);
          setEmail(userData.email);
          const date = new Date(userData.createdAt);
          setCreatedAt(date.toLocaleDateString());
        }
      } catch (err) {
        setError('Помилка завантаження даних користувача');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        
        const reviews = await ReviewService.getUserReviews({ skip: 0, take: 100 });
        setReviews(reviews);
      } catch (err) {
        console.error('Error fetching user reviews:', err);
        setReviewsError('Помилка завантаження відгуків');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await UserService.getUserData();
        if (userData && typeof userData.TokensAvailable !== 'undefined') {
          setTokensAvailable(userData.TokensAvailable);
        }
      } catch (e) {
        // ignore
      }
    }
    fetchUserData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Імя обовязкове';
    if (password && !oldPassword) 
      newErrors.oldPassword = 'Введіть поточний пароль';
    if (password && password.length < 6)
      newErrors.password = 'Пароль повинен містити щонайменше 6 символів';
    if (password && password !== confirmPassword)
      newErrors.confirmPassword = 'Паролі не співпадають';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const userData = {
        name: name.trim(),
      };

      if (password) {
        userData.passwordOld = oldPassword;
        userData.passwordNew = password;
      }

      await UserService.editUser(userData);
      setShowModal(false);
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err) {
      setErrors({ oldPassword: 'Невірний поточний пароль' });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="account-background">
      <style>{`
        .account-background {
          position: relative;
          min-height: 100vh;
          background-image: url("/images/background(login).png");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        @keyframes mapMove {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
        }
        .modal-content input {
          width: 100%;
          margin-bottom: 8px;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error-text {
          color: red;
          font-size: 0.85rem;
          margin-bottom: 10px;
        }
        .btn-hover:hover {
          opacity: 0.85;
        }

        .container {
          position: relative;
          z-index: 2;
        }

        .card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 2px solid #626FC2;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5 className="mb-3">Редагувати профіль</h5>

            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ім'я"
            />
            {errors.name && <div className="error-text">{errors.name}</div>}

            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              placeholder="Поточний пароль"
            />
            {errors.oldPassword && <div className="error-text">{errors.oldPassword}</div>}

            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Новий пароль (необов'язково)"
            />
            {errors.password && <div className="error-text">{errors.password}</div>}

            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Підтвердження нового пароля"
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}

            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2 btn-hover" onClick={() => setShowModal(false)}>
                Скасувати
              </button>
              <button
                className="btn btn-sm btn-hover"
                style={{ backgroundColor: '#626FC2', borderColor: '#626FC2', color: '#fff' }}
                onClick={handleSave}
              >
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}

      {showBuyTokens && (
        <div className="modal-overlay" onClick={() => setShowBuyTokens(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="btn btn-secondary btn-sm mb-3" onClick={() => setShowBuyTokens(false)}>
              Закрити
            </button>
            <BuyTokens />
          </div>
        </div>
      )}

      <div className="container py-5" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="card mb-4 p-4">
          <h2 className="h5 mb-3">Обліковий запис</h2>
          {tokensAvailable !== null && (
            <div className="mb-3">
              <b>Ваш баланс токенов:</b> {tokensAvailable}
            </div>
          )}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="row align-items-center gx-4">
              <div className="col-auto ms-4">
                <input
                  type="file"
                  accept="image/*"
                  id="avatarInput"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                  style={{
                    width: '130px',
                    height: '130px',
                    backgroundColor: '#ddd',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('avatarInput').click()}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#666' }}>
                      person
                    </span>
                  )}
                  <div
                    className="position-absolute bottom-0 start-0 end-0 text-center py-1"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      color: 'white',
                      fontSize: '0.75rem',
                    }}
                  >
                    Змінити
                  </div>
                </div>
              </div>

              <div className="col ps-3">
                <h5>{name}</h5>
                <a
                  href={`mailto:${email}`}
                  className="d-block mb-1 text-primary text-decoration-none"
                >
                  {email}
                </a>
                <p className="mb-2 text-muted">Дата реєстрації: {createdAt}</p>
                <div className="d-flex justify-content-between align-items-center mb-2" style={{gap: '10px'}}>
                  <div></div>
                  <button
                    className="btn btn-success btn-sm btn-hover"
                    onClick={() => setShowBuyTokens(true)}
                  >
                    Поповнити баланс
                  </button>
                </div>
                <button
                  className="btn btn-sm me-2 btn-hover"
                  style={{ backgroundColor: '#626FC2', borderColor: '#626FC2', color: '#fff' }}
                  onClick={() => setShowModal(true)}
                >
                  Змінити
                </button>
                <button className="btn btn-secondary btn-sm btn-hover" onClick={handleLogout}>Вийти</button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-4" style={{ minHeight: '250px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="h6 mb-3">Мої відгуки</h3>
          <div style={{ overflowY: 'auto', flexGrow: 1 }}>
            {reviewsLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Завантаження...</span>
                </div>
              </div>
            ) : reviewsError ? (
              <div className="alert alert-danger" role="alert">
                {reviewsError}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center text-muted py-4">
                У вас поки немає відгуків
              </div>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="d-flex justify-content-between align-items-start border-bottom py-3">
                  <div className="d-flex gap-3">
                    
                    <div className="flex-grow-1 pe-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0">{review.placeName || 'Без назви'}</h6>
                        <small className="text-muted">
                          {new Date(review.reviewDateTime).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                        {review.placeAddress || 'Адреса не вказана'}
                      </p>
                      <div className="d-flex gap-3 mb-2">
                        <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>
                          {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                        </div>
                      </div>
                      {review.text && (
                        <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                          {review.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-end ms-3">
                    <button
                      className="btn btn-sm btn-hover"
                      style={{ backgroundColor: '#626FC2', borderColor: '#626FC2', color: '#fff' }}
                      onClick={() => {
                        navigate("/");
                        localStorage.setItem("openPlace", review.gmapId);
                      }}
                    >
                      Перейти
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
