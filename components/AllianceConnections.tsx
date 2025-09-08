import React from 'react';
import { useTranslation } from 'react-i18next';
import { RelationshipAnalysis } from '../services/database.types';
import { UsersIcon } from './icons';
import { getTranslatedValue } from '../utils/translation';

interface AllianceConnectionsProps {
  analyses: RelationshipAnalysis[];
}

const AllianceConnections: React.FC<AllianceConnectionsProps> = ({ analyses }) => {
  const { t, i18n } = useTranslation();
  if (!analyses || analyses.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="flex items-center text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-4">
        <UsersIcon className="w-6 h-6 mr-3 text-amber-700" />
        {t('alliance_connections_title')}
      </h3>
      <div className="space-y-4">
        {analyses.map((analysis, index) => (
          <div key={index}>
            <h4 className="font-bold text-lg text-stone-700">{getTranslatedValue(analysis.title, i18n.language)}</h4>
            <p className="text-stone-700 leading-relaxed">{getTranslatedValue(analysis.text, i18n.language)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllianceConnections;