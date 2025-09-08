import React from 'react';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  onStart: () => void;
  hasPreviousResult?: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, hasPreviousResult }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white rounded-2xl shadow-xl animate-fade-in max-w-lg">
      <img 
        src="https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Logo%20compacto%20Quem%20sou%20eu%20na%20Bi%CC%81blia.png" 
        alt="Quem sou eu na Bíblia Logo" 
        className="w-48 h-auto mb-6 drop-shadow-lg"
      />
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-800 mb-4 font-display text-center">{t('welcome_title')}</h2>
      <p className="text-stone-600 max-w-md mb-8 text-base sm:text-lg text-center">
        {t('welcome_subtitle')}
      </p>
      <button
        onClick={onStart}
        className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg sm:text-xl"
      >
        {hasPreviousResult ? t('welcome_button_results') : t('welcome_button_start')}
      </button>
    </div>
  );
};

export default WelcomeScreen;