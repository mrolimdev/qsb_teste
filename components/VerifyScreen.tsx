import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface VerifyScreenProps {
  userEmail: string;
  errorKey: string | null;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void;
  onBack: () => void;
}

const VerifyScreen: React.FC<VerifyScreenProps> = ({ userEmail, errorKey, onVerify, onResend, onBack }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleSubmit = async (fullCode: string) => {
    setLoading(true);
    const success = await onVerify(fullCode);
    
    // If verification failed, the component is still mounted.
    // We can safely update the state to give user feedback.
    if (!success) {
      setLoading(false);
      setCode(Array(6).fill('')); // Clear inputs for retry
      inputsRef.current[0]?.focus(); // Focus on the first input
    }
    // If successful, the component will be unmounted, so no state update is needed.
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    // Only allow single digit numbers
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    
    // If all inputs are filled, submit
    const fullCode = newCode.join('');
    if (fullCode.length === 6) {
      handleSubmit(fullCode);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
        const newCode = pasteData.split('');
        setCode(newCode);
        handleSubmit(pasteData);
        inputsRef.current[5]?.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
        handleSubmit(fullCode);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl animate-fade-in w-full max-w-md">
      <img 
        src="https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Logo%20compacto%20Quem%20sou%20eu%20na%20Bi%CC%81blia.png" 
        alt={t('logo_alt')} 
        className="w-32 h-auto mb-4 drop-shadow-lg"
      />
      <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{t('verify_title')}</h2>
      <p className="text-stone-600 mb-6 text-center" dangerouslySetInnerHTML={{ __html: t('verify_subtitle', { email: userEmail }) }} />
        

      <form onSubmit={handleFormSubmit}>
        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-stone-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-stone-900"
              disabled={loading}
              autoComplete="one-time-code"
            />
          ))}
        </div>
        
        {errorKey && <p className="text-red-600 mb-4 text-sm">{t(errorKey)}</p>}
        
        <button
          type="submit"
          disabled={loading || code.join('').length !== 6}
          className="w-full px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-stone-400 disabled:cursor-not-allowed"
        >
          {loading ? t('button_verifying') : t('button_verify')}
        </button>
      </form>
      
      <div className="mt-4 text-center w-full">
        <p className="text-xs text-stone-500 bg-stone-100 p-3 rounded-lg border border-stone-200">
            <strong>{t('verify_spam_title')}</strong> {t('verify_spam_text')}
        </p>
      </div>

      <div className="mt-4 text-sm text-stone-600">
        {t('verify_did_not_receive')}{' '}
        <button onClick={onResend} className="font-semibold text-amber-600 hover:underline">
          {t('button_resend')}
        </button>
        <span className="mx-2">|</span>
        <button onClick={onBack} className="font-semibold text-amber-600 hover:underline">
          {t('button_change_email')}
        </button>
      </div>
    </div>
  );
};

export default VerifyScreen;