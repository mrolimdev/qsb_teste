import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Devotional } from '../services/database.types';
import { BookOpenIcon } from './icons';
import { getTranslatedValue } from '../utils/translation';

interface DailyBreadProps {
  devotionals: Devotional[];
}

const DailyBread: React.FC<DailyBreadProps> = ({ devotionals }) => {
  const { t, i18n } = useTranslation();

  const dailyDevotional = useMemo(() => {
    if (!devotionals || devotionals.length === 0) {
      return null;
    }
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const index = dayOfYear % devotionals.length;
    return devotionals[index];
  }, [devotionals]);

  if (!dailyDevotional) {
    return null;
  }

  return (
    <div className="mt-8">
       <h3 className="flex items-center text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-4">
        <BookOpenIcon className="w-6 h-6 mr-3 text-amber-700" />
        {t('daily_bread_title')}
      </h3>
      <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
        <blockquote className="italic text-stone-800 text-lg">"{getTranslatedValue(dailyDevotional.verse, i18n.language)}"</blockquote>
        <p className="text-right font-semibold text-amber-700 mt-2">{getTranslatedValue(dailyDevotional.reference, i18n.language)}</p>
        <p className="text-stone-700 leading-relaxed mt-4 pt-4 border-t border-amber-200">
            <strong>{t('daily_bread_reflection')}:</strong> {getTranslatedValue(dailyDevotional.reflection, i18n.language)}
        </p>
      </div>
    </div>
  );
};

export default DailyBread;