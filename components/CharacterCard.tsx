import React from 'react';
import { useTranslation } from 'react-i18next';
import { Character } from '../types';
import { getTranslatedValue } from '../utils/translation';
import { SoundIcon } from './icons';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick }) => {
  const { t, i18n } = useTranslation();
  const name = getTranslatedValue(character.name, i18n.language);
  const tagline = getTranslatedValue(character.tagline, i18n.language);
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300 group"
    >
      <div className="relative w-full h-40 md:h-48 bg-stone-200">
        <img 
          src={character.imageUrl || ''} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        {character.audio && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5" title={t('has_audio')}>
            <SoundIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-stone-800">{name}</h3>
        <p className="text-sm text-amber-700 font-medium">{tagline}</p>
      </div>
    </div>
  );
};

export default CharacterCard;