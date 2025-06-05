import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function NotificationsMenu() {
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(false);
  const toggleRef = useRef(null);
  const { t } = useTranslation();

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = () => {
    setShow((prev) => !prev);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300); 
  };

  return (
    <div ref={toggleRef} className="position-relative">
      <span
        className={`material-symbols-outlined fs-3 ${animate ? 'bell-animate' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      >
        notifications
      </span>

      <Dropdown show={show} align="end">
        <Dropdown.Menu
          show
          className="shadow border-0 mt-2"
          style={{
            minWidth: '300px',
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)', 
            zIndex: 1050,
          }}
        >
          <Dropdown.Header>{t('notifications')}</Dropdown.Header>
          <div
            className="mx-2 my-2"
            style={{
              borderTop: '1px solid #dee2e6',
            }}
          />
          <div className="text-center text-muted py-3">
            {t('no_new_notifications')}
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <style>{`
        @keyframes bell {
          0% { transform: rotate(0); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
          100% { transform: rotate(0); }
        }

        .bell-animate {
          animation: bell 0.3s ease-in-out;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
}
