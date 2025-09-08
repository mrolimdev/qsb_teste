import React from 'react';
import { useTranslation } from 'react-i18next';
import { StudyPlan, StudyPlanReading, Json } from '../services/database.types';
import { ClipboardListIcon } from './icons';
import { getTranslatedValue } from '../utils/translation';

interface StudyPlanSectionProps {
  plan: StudyPlan;
}

const StudyPlanSection: React.FC<StudyPlanSectionProps> = ({ plan }) => {
  const { t, i18n } = useTranslation();
  
  const readings = Array.isArray(plan?.readings) ? (plan.readings as unknown as StudyPlanReading[]) : [];
  const questions = Array.isArray(plan?.reflectionQuestions) ? (plan.reflectionQuestions as Json[]) : [];
  const prayer = plan?.prayer;

  if (!plan || (readings.length === 0 && questions.length === 0 && !prayer)) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="flex items-center text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-4">
        <ClipboardListIcon className="w-6 h-6 mr-3 text-amber-700" />
        {t('study_plan_title')}
      </h3>
      <div className="space-y-6">
        
        {readings.length > 0 && (
          <div>
            <h4 className="font-bold text-lg text-stone-700 mb-2">{t('study_plan_subtitle_readings')}</h4>
            <ul className="list-disc list-inside space-y-2 pl-2">
              {readings.map((reading, index) => (
                <li key={index} className="text-stone-700">
                  <span className="font-semibold">{getTranslatedValue(reading.reference, i18n.language)}:</span> {getTranslatedValue(reading.description, i18n.language)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {questions.length > 0 && (
          <div>
            <h4 className="font-bold text-lg text-stone-700 mb-2">{t('study_plan_subtitle_questions')}</h4>
            <ul className="list-decimal list-inside space-y-2 pl-2">
              {questions.map((question, index) => (
                <li key={index} className="text-stone-700 italic">
                  {getTranslatedValue(question, i18n.language)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {prayer && (
          <div>
            <h4 className="font-bold text-lg text-stone-700 mb-2">{t('study_plan_subtitle_prayer')}</h4>
            <p className="text-stone-700 leading-relaxed bg-stone-100 p-3 rounded-md">
              {getTranslatedValue(prayer, i18n.language)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanSection;