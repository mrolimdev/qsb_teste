import React from 'react';
import { useTranslation } from 'react-i18next';

interface AboutScreenProps {
  onStart: () => void;
  hasPreviousResult?: boolean;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onStart, hasPreviousResult }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-3xl p-6 md:p-8 bg-white rounded-2xl shadow-xl animate-fade-in text-left">
      <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-6 text-center">{t('about_main_title')}</h2>

      <div className="space-y-6 text-stone-700 leading-relaxed">
        <div>
          <h3 className="text-xl font-bold text-amber-700 mb-2">{t('about_what_is_title')}</h3>
          <p>{t('about_what_is_p1')}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-amber-700 mb-2">{t('about_bible_title')}</h3>
          <p>{t('about_bible_p1')}</p>
          <blockquote className="my-4 p-4 bg-stone-100 border-l-4 border-amber-500 italic">
            {t('about_bible_quote_text')}
            <cite className="block text-right font-semibold text-amber-700 mt-2 not-italic">{t('about_bible_quote_reference')}</cite>
          </blockquote>
          <p>{t('about_bible_p2')}</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-amber-700 mb-2">{t('about_how_it_helps_title')}</h3>
          <p>{t('about_how_it_helps_p1')}</p>
        </div>
      </div>

      <div className="text-center mt-10 pt-6 border-t border-stone-200">
        <h3 className="text-2xl font-bold text-stone-800 mb-2">{t('about_cta_title')}</h3>
        <p className="text-stone-600 mb-6 max-w-lg mx-auto">{t('about_cta_subtitle')}</p>
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg sm:text-xl"
        >
          {hasPreviousResult ? t('button_see_my_result') : t('button_do_test_now')}
        </button>
      </div>
    </div>
  );
};

export default AboutScreen;