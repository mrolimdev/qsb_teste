import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createPixQrCode, checkPixPaymentStatus } from '../services/paymentService';
import { PixQrCodeData } from '../types';
import Loader from './Loader';
import { SpinnerIcon, ClipboardCopyIcon, CheckCircleIcon } from './icons';

interface AbacatePayModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | null;
  onPaymentSuccess: () => void;
}

type PaymentStep = 'loading_qr' | 'display_qr' | 'paid' | 'expired' | 'error';

const AbacatePayModal: React.FC<AbacatePayModalProps> = ({ isOpen, onClose, userEmail, onPaymentSuccess }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<PaymentStep>('loading_qr');
  const [qrData, setQrData] = useState<PixQrCodeData | null>(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const generateQr = useCallback(async () => {
    if (!userEmail) {
      setErrorMessage("E-mail do usuário não encontrado. Não é possível gerar o PIX.");
      setStep('error');
      return;
    }
    setStep('loading_qr');
    setErrorMessage(null);
    try {
      const data = await createPixQrCode(userEmail);
      setQrData(data);
      setCountdown(600);
      setStep('display_qr');
    } catch (error) {
      console.error("Erro capturado no AbacatePayModal ao gerar QR code:", error);
      const detailedMessage = error instanceof Error ? error.message : "Falha ao gerar o QR Code.";
      setErrorMessage(detailedMessage);
      setStep('error');
    }
  }, [userEmail]);

  useEffect(() => {
    if (isOpen) {
      generateQr();
    }
  }, [isOpen, generateQr]);

  // Countdown timer effect
  useEffect(() => {
    if (step === 'display_qr' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0 && step === 'display_qr') {
      setStep('expired');
    }
  }, [countdown, step]);

  // Polling for payment status effect
  useEffect(() => {
    if (step !== 'display_qr' || !qrData) return;

    const interval = setInterval(async () => {
      try {
        const statusData = await checkPixPaymentStatus(qrData.id);
        if (statusData.status === 'PAID') {
          clearInterval(interval);
          setStep('paid');
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, qrData]);
  
  // Call onPaymentSuccess only when the step changes to 'paid'
  useEffect(() => {
    if (step === 'paid') {
      onPaymentSuccess();
    }
  }, [step, onPaymentSuccess]);

  const handleManualCheck = async () => {
    if (!qrData) return;
    setIsChecking(true);
    try {
      const statusData = await checkPixPaymentStatus(qrData.id);
      if (statusData.status === 'PAID') {
        setStep('paid');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Falha ao verificar o pagamento.");
      setStep('error');
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleCopy = () => {
    if (qrData?.brCode) {
        navigator.clipboard.writeText(qrData.brCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOverlayClick = () => {
    // Prevent closing while payment is in progress
    if (!['loading_qr', 'display_qr'].includes(step)) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'loading_qr':
        return <Loader text={t('payment_modal_generating')} />;
      case 'display_qr':
        return (
          <>
            <h2 className="text-xl font-bold text-stone-800 text-center mb-4">{t('payment_modal_promo_text')}</h2>
            <img src={qrData?.brCodeBase64} alt="PIX QR Code" className="mx-auto w-48 h-48 border-4 border-stone-200 rounded-lg" />
            
            <div className="my-4">
              <input type="text" value={qrData?.brCode} readOnly className="w-full p-2 pr-4 border border-stone-300 rounded-md bg-stone-100 text-xs text-center" />
              <button 
                onClick={handleCopy} 
                className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-stone-200 text-stone-800 font-bold rounded-lg hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              >
                  {isCopied ? <CheckCircleIcon className="w-6 h-6 text-green-600" /> : <ClipboardCopyIcon className="w-6 h-6" />}
                  <span>{t('payment_modal_copy_button')}</span>
              </button>
            </div>

            <div className="text-center font-semibold text-red-600 my-4">
                {t('payment_modal_expires_in')} {formatTime(countdown)}
            </div>
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 transition-colors disabled:bg-stone-400"
            >
              {isChecking && <SpinnerIcon className="w-5 h-5" />}
              {isChecking ? t('payment_modal_checking') : t('payment_modal_check_payment')}
            </button>
          </>
        );
      case 'paid':
         return (
            <div className="text-center py-4 flex flex-col items-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-stone-800">{t('payment_modal_paid_title')}</h2>
                <p className="text-stone-600 mb-6">{t('payment_modal_paid_subtitle')}</p>
                <button
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
                >
                    {t('payment_modal_success_button')}
                </button>
            </div>
         );
      case 'expired':
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-700">{t('payment_modal_expired_title')}</h2>
            <p className="text-stone-600 my-4">{t('payment_modal_expired_subtitle')}</p>
            <button onClick={generateQr} className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700">
              {t('payment_modal_generate_new')}
            </button>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-700">{t('payment_modal_error_title')}</h2>
            <p className="text-stone-600 my-4 break-words">{errorMessage}</p>
            <button onClick={generateQr} className="w-full px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700">
              {t('button_retry')}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default AbacatePayModal;