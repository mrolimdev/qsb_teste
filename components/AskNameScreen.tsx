import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AskNameScreenProps {
  onNameSubmit: (name: string) => Promise<void>;
}

const AskNameScreen: React.FC<AskNameScreenProps> = ({ onNameSubmit }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('ask_name_error_required'));
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await onNameSubmit(name.trim());
    } catch (submissionError) {
      setError(t('ask_name_error_submit'));
      setLoading(false);
    }
    // On success, the component will be unmounted, no need to set loading to false.
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl animate-fade-in w-full max-w-md">
      <img 
        src="https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Logo%20compacto%20Quem%20sou%20eu%20na%20Bi%CC%81blia.png" 
        alt={t('logo_alt')} 
        className="w-32 h-auto mb-4 drop-shadow-lg"
      />
      <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{t('ask_name_title')}</h2>
      <p className="text-stone-600 mb-6 text-center">
        {t('ask_name_subtitle')}
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">{t('ask_name_label')}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('ask_name_placeholder')}
            className="w-full px-4 py-3 text-lg border-2 border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white text-stone-900"
            aria-describedby="name-error"
            disabled={loading}
          />
          {error && <p id="name-error" className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-stone-400 disabled:cursor-not-allowed"
        >
          {loading ? t('button_wait') : t('button_continue')}
        </button>
      </form>
    </div>
  );
};

export default AskNameScreen;