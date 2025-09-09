import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createPixQrCode, checkPixPaymentStatus } from '../services/paymentService';
import { PixQrCodeData } from '../types';
import Loader from './Loader';
import { SpinnerIcon, ClipboardCopyIcon, CheckCircleIcon, ShieldCheckIcon } from './icons';

interface AbacatePayModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | null;
  onPaymentSuccess: () => Promise<void>;
  onFlowComplete: () => void;
  pixValue: string | null;
}

type PaymentStep = 'loading_qr' | 'display_qr' | 'paid' | 'expired' | 'error';

const AbacatePayModal: React.FC<AbacatePayModalProps> = ({ isOpen, onClose, userEmail, onPaymentSuccess, onFlowComplete, pixValue }) => {
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
    if (!pixValue) {
      setErrorMessage("Valor do PIX não configurado. Tente novamente mais tarde.");
      setStep('error');
      return;
    }

    setStep('loading_qr');
    setErrorMessage(null);
    try {
      const amountInCents = parseInt(pixValue.replace(/[,.]/g, ''), 10);
      const data = await createPixQrCode(userEmail, amountInCents);
      setQrData(data);
      setCountdown(600);
      setStep('display_qr');
    } catch (error) {
      console.error("Erro capturado no AbacatePayModal ao gerar QR code:", error);
      const detailedMessage = error instanceof Error ? error.message : "Falha ao gerar o QR Code.";
      setErrorMessage(detailedMessage);
      setStep('error');
    }
  }, [userEmail, pixValue]);

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
  
  // Handle successful payment: update DB once.
  useEffect(() => {
    if (step === 'paid') {
      onPaymentSuccess(); // Update DB and user status in the parent
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
    // Only allow closing if the flow is finished (expired, error, or manually)
    if (['expired', 'error'].includes(step)) {
      onClose();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'loading_qr':
        return <div className="min-h-[400px] flex items-center justify-center"><Loader text={t('payment_modal_generating')} /></div>;
      case 'display_qr':
        return (
          <div className="text-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('payment_modal_promo_title')}</h3>
            <p className="text-gray-500 line-through mt-2">{t('payment_modal_original_price')}</p>
            <p className="text-sm text-stone-800">{t('payment_modal_for_just')}</p>
            <p className="text-5xl font-bold text-amber-600 my-1">{`R$ ${pixValue}`}</p>
            <p className="text-sm text-green-600 font-semibold mb-4">{t('payment_modal_instant_access')}</p>
            
            <img src={qrData?.brCodeBase64} alt="PIX QR Code" className="mx-auto w-48 h-48 border-4 border-stone-200 rounded-lg shadow-md" />
            
            <div className="my-4">
              <button 
                onClick={handleCopy} 
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-200 text-stone-800 font-bold rounded-lg hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              >
                  {isCopied ? <CheckCircleIcon className="w-6 h-6 text-green-600" /> : <ClipboardCopyIcon className="w-6 h-6" />}
                  <span>{isCopied ? t('results_link_copied') : t('payment_modal_copy_button')}</span>
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
          </div>
        );
      case 'paid':
         return (
            <div className="text-center py-4 flex flex-col items-center min-h-[400px] justify-center">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-stone-800">{t('payment_modal_paid_title')}</h2>
                <p className="text-stone-600 mb-6">{t('payment_modal_paid_subtitle')}</p>
                <button
                  onClick={onFlowComplete}
                  className="w-full px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
                >
                  {t('payment_modal_ok_button')}
                </button>
            </div>
         );
      case 'expired':
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-700">{t('payment_modal_expired_title')}</h2>
            <p className="text-stone-600 my-4">{t('payment_modal_expired_subtitle')}</p>
            <button onClick={generateQr} className="w-full px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700">
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
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6 bg-stone-50 rounded-t-2xl border-b border-stone-200 flex items-center justify-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-xs font-semibold text-stone-600">{t('payment_modal_secure_title')}</h3>
        </div>
        <div className="p-4 sm:p-6">
            {renderContent()}
        </div>
        <div className="p-4 bg-stone-50 rounded-b-2xl border-t border-stone-200 flex items-center justify-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4" /> {t('payment_modal_secure_badge')}</span>
            <span className="flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> {t('payment_modal_satisfaction_guarantee')}</span>
        </div>
      </div>
    </div>
  );
};

export default AbacatePayModal;