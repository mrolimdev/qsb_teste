import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SpinnerIcon } from './icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  titleKey: string;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, titleKey, children }) => {
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);
  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-stone-800 mb-4">{t(titleKey)}</h2>
        <div className="text-stone-600 mb-6">
          {children}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="px-6 py-2 bg-stone-200 text-stone-800 font-semibold rounded-lg hover:bg-stone-300 transition-colors disabled:opacity-50"
          >
            {t('button_cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex items-center justify-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors disabled:bg-stone-400"
          >
            {isConfirming && <SpinnerIcon className="w-5 h-5 mr-2" />}
            {isConfirming ? t('button_wait') : t('button_confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;