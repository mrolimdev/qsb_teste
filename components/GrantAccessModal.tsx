import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyIcon } from './icons';

interface GrantAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const GrantAccessModal: React.FC<GrantAccessModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      onSubmit(email.trim().toLowerCase());
    } else {
        alert(t('alert_invalid_email'));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
            <KeyIcon className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-stone-800">{t('grant_access_title')}</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
            <p className="text-stone-600 mb-4">
                {t('grant_access_subtitle')}
            </p>
            <div>
                <label htmlFor="userEmail" className="sr-only">{t('grant_access_label')}</label>
                <input
                    id="userEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('grant_access_placeholder')}
                    className="w-full px-4 py-3 text-lg border-2 border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    autoFocus
                    required
                />
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-stone-200 text-stone-800 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
                >
                    {t('button_cancel')}
                </button>
                <button
                    type="submit"
                    disabled={!email.trim()}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
                >
                    {t('grant_access_button')}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default GrantAccessModal;