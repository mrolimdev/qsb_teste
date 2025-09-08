import React, { useState, useRef, useEffect } from 'react';
import { Screen, UserInfo } from '../types';
import { GalleryIcon, HomeIcon, DiamondGoldIcon, DiamondSilverIcon, InfoIcon, LogoutIcon, AdminIcon, ChevronDownIcon } from './icons';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  userInfo: UserInfo | null;
  onLogout: () => void;
  isAdmin: boolean;
  isViewingAsAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate, userInfo, onLogout, isAdmin, isViewingAsAdmin }) => {
  const { i18n, t } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { [key: string]: string } = {
    pt: 'Português',
    en: 'English',
    es: 'Español'
  };

  const currentLangCode = i18n.language.split('-')[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsLangDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('welcome')}>
            <img 
              src="https://sites.arquivo.download/Quem%20Sou%20Eu%20na%20Biblia/Logo%20compacto%20Quem%20sou%20eu%20na%20Bi%CC%81blia.png" 
              alt="Quem sou eu na Bíblia Logo" 
              className="h-10 sm:h-12 w-auto drop-shadow-lg"
            />
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white hover:bg-stone-100 text-stone-700 rounded-full transition-colors duration-200 border border-stone-200"
              >
                <span>{currentLangCode.toUpperCase()}</span>
                <ChevronDownIcon className="w-4 h-4 text-stone-500" />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 border border-stone-100">
                  {Object.entries(languages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => changeLanguage(code)}
                      className="w-full text-left block px-4 py-2 text-sm text-stone-700 hover:bg-amber-100"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isViewingAsAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-3 py-1.5 text-sm font-semibold bg-amber-100 text-amber-800 rounded-full hover:bg-amber-200 transition-colors"
              >
                {t('button_back_to_admin')}
              </button>
            )}

            {isAdmin && !isViewingAsAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-stone-600 hover:text-amber-700 transition-colors duration-200 p-2 rounded-full hover:bg-amber-100"
                aria-label="Painel Administrativo"
              >
                <AdminIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            {currentScreen !== 'welcome' && (
              <button 
                onClick={() => onNavigate('welcome')}
                className="text-stone-600 hover:text-amber-700 transition-colors duration-200 p-2 rounded-full hover:bg-amber-100"
                aria-label="Ir para a página inicial"
                >
                <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            {currentScreen !== 'gallery' && (
              <button 
                onClick={() => onNavigate('gallery')}
                className="text-stone-600 hover:text-amber-700 transition-colors duration-200 p-2 rounded-full hover:bg-amber-100"
                aria-label="Ver galeria de personagens"
                >
                <GalleryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
             {currentScreen !== 'about' && (
              <button 
                onClick={() => onNavigate('about')}
                className="text-stone-600 hover:text-amber-700 transition-colors duration-200 p-2 rounded-full hover:bg-amber-100"
                aria-label="Sobre o teste"
                >
                <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
            {userInfo && !isViewingAsAdmin && (
              <>
                {userInfo.acesso != null && (
                  <div title={String(userInfo.acesso) === '1' ? 'Acesso Premium' : 'Acesso Básico'}>
                    {String(userInfo.acesso) === '1' ? 
                      <DiamondGoldIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : 
                      <DiamondSilverIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </div>
                )}
                <button 
                  onClick={onLogout}
                  className="text-stone-600 hover:text-red-600 transition-colors duration-200 p-2 rounded-full hover:bg-red-100"
                  aria-label="Sair"
                >
                  <LogoutIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;