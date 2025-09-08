import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SparklesIcon, SpinnerIcon } from './icons';
import Loader from './Loader';

interface AICharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (characterName: string) => void;
  isLoading: boolean; // For profile generation
  onSuggestName: (gender: 'male' | 'female' | 'any') => Promise<string | null>;
}

const AICharacterModal: React.FC<AICharacterModalProps> = ({ isOpen, onClose, onSubmit, isLoading, onSuggestName }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false); // For name suggestion
  const [gender, setGender] = useState<'male' | 'female' | 'any'>('any');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isLoading) {
      onSubmit(name.trim());
    }
  };

  const handleSuggest = async () => {
    setIsSuggesting(true);
    const suggestedName = await onSuggestName(gender);
    if (suggestedName) {
        setName(suggestedName);
    }
    setIsSuggesting(false);
  };
  
  const handleClose = () => {
    if (isLoading || isSuggesting) return;
    setName('');
    setGender('any');
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center mb-4">
            <SparklesIcon className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-stone-800">{t('ai_modal_title')}</h2>
        </div>
        
        {isLoading ? (
            <div className="min-h-[260px] flex items-center justify-center">
              <Loader text={t('ai_modal_loader_text')} />
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
                <p className="text-stone-600 mb-4">
                    {t('ai_modal_subtitle')}
                </p>
                <div>
                    <label htmlFor="characterName" className="block text-sm font-medium text-stone-700 mb-1">{t('ai_modal_label')}</label>
                    <input
                        id="characterName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('ai_modal_placeholder')}
                        className="w-full px-4 py-3 text-lg border-2 border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        autoFocus
                    />
                </div>

                <div className="my-4 pt-4 border-t border-stone-200">
                  <p className="text-sm font-semibold text-stone-700 mb-2">{t('ai_modal_suggest_title')}</p>
                  <div className="flex items-center gap-3">
                      <div className="flex-grow">
                          <label htmlFor="gender-select" className="sr-only">{t('ai_modal_suggest_gender_label')}</label>
                          <select
                            id="gender-select"
                            value={gender}
                            onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'any')}
                            className="w-full p-2 border border-stone-300 rounded-md shadow-sm text-sm h-[38px]"
                          >
                            <option value="any">{t('ai_modal_suggest_gender_any')}</option>
                            <option value="male">{t('ai_modal_suggest_gender_male')}</option>
                            <option value="female">{t('ai_modal_suggest_gender_female')}</option>
                          </select>
                      </div>
                      <button type="button" onClick={handleSuggest} disabled={isSuggesting} className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-stone-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-stone-700 transition-all disabled:bg-stone-400">
                          {isSuggesting && <SpinnerIcon className="w-4 h-4" />}
                          {t('ai_modal_suggest_button')}
                      </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2 bg-stone-200 text-stone-800 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
                    >
                        {t('button_cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
                    >
                        {t('ai_modal_button_submit')}
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default AICharacterModal;