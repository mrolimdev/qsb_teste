import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-stone-200 text-stone-600 text-center p-4">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 text-sm">
        <p>
          {currentYear} - {t('footer_copyright')} &copy;
        </p>
        <p>{t('footer_rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;