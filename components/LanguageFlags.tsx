import React from 'react';
import { Character } from '../types';
import { BrazilFlagIcon, USFlagIcon, SpainFlagIcon } from './icons';
import { getTranslatedValue } from '../utils/translation';

interface LanguageFlagsProps {
  character: Character;
}

const LanguageFlags: React.FC<LanguageFlagsProps> = ({ character }) => {
  const hasPt = !!getTranslatedValue(character.name, 'pt');
  const hasEn = !!getTranslatedValue(character.name, 'en');
  const hasEs = !!getTranslatedValue(character.name, 'es');

  // Check if EN/ES translations are distinct from PT
  const isEnTranslated = hasEn && getTranslatedValue(character.name, 'en') !== getTranslatedValue(character.name, 'pt');
  const isEsTranslated = hasEs && getTranslatedValue(character.name, 'es') !== getTranslatedValue(character.name, 'pt');

  return (
    <div className="flex items-center space-x-1.5">
      {hasPt && <BrazilFlagIcon title="Português" />}
      {isEnTranslated && <USFlagIcon title="English" />}
      {isEsTranslated && <SpainFlagIcon title="Español" />}
    </div>
  );
};

export default LanguageFlags;