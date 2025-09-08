import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface EmailScreenProps {
  onEmailSubmit: (email: string) => Promise<void>;
}

const EmailScreen: React.FC<EmailScreenProps> = ({ onEmailSubmit }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(t('email_error_required'));
      return;
    }
    // Simple regex for email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('email_error_invalid'));
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await onEmailSubmit(email.trim().toLowerCase());
    } catch (submissionError) {
      setError(t('email_error_submit_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl animate-fade-in w-full max-w-md">
      <img 
        src="https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Logo%20compacto%20Quem%20sou%20eu%20na%20Bi%CC%81blia.png" 
        alt={t('logo_alt')} 
        className="w-32 h-auto mb-4 drop-shadow-lg"
      />
      <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{t('email_title')}</h2>
      <p className="text-stone-600 mb-6 text-center">
        {t('email_subtitle')}
      </p>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">{t('email_label')}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email_placeholder')}
            className="w-full px-4 py-3 text-lg border-2 border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-stone-900"
            aria-describedby="email-error"
            disabled={loading}
          />
          {error && <p id="email-error" className="text-red-600 mt-2 text-sm">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-stone-400 disabled:cursor-not-allowed"
        >
          {loading ? t('button_sending') : t('email_button_submit')}
        </button>
      </form>
    </div>
  );
};

export default EmailScreen;