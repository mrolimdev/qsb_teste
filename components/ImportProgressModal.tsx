import React from 'react';
import { SpinnerIcon } from './icons';

interface ImportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  statusText: string;
}

const ImportProgressModal: React.FC<ImportProgressModalProps> = ({ isOpen, onClose, progress, statusText }) => {
  if (!isOpen) return null;

  const isComplete = progress >= 100 && statusText.toLowerCase().includes('concluída');

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300"
      >
        <div className="flex items-center mb-4">
            <SpinnerIcon className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-stone-800">Progresso da Importação</h2>
        </div>
        
        <div className="my-4">
          <p className="text-sm text-stone-600 mb-2 text-center">{statusText}</p>
          <div className="w-full bg-stone-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm font-semibold text-stone-700 mt-1">{Math.round(progress)}%</p>
        </div>

        {isComplete && (
            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Fechar
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImportProgressModal;
