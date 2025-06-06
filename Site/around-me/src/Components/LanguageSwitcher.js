import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <div className="fw-semibold mb-2">{t('choose_language')}</div>
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
  );
}

export default LanguageSwitcher; 