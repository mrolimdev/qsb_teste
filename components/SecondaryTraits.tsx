import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Character, Scores, UserInfo, EneagramaTrait } from '../types';
import { generateSecondaryTraitsAnalysis, getErrorMessage } from '../services/geminiService';
import { saveSecondaryAnalysis, getUserProfile } from '../services/databaseService';
import { ENEAGRAMA_FILTER_NAMES } from '../constants';
import Loader from './Loader';
import { getTranslatedValue } from '../utils/translation';
import { Json } from '../services/database.types';

interface SecondaryTraitsProps {
  scores: Scores;
  userInfo: UserInfo | null;
  userEmail: string | null;
  mainCharacter: Character;
  secondaryCharacter: Character | null;
  tertiaryCharacter: Character | null;
  preloadedSecondaryAnalysis: Json | null;
  language: string;
}

const SecondaryTraits: React.FC<SecondaryTraitsProps> = ({ scores, userInfo, userEmail, mainCharacter, secondaryCharacter, tertiaryCharacter, preloadedSecondaryAnalysis, language }) => {
  const { t, i18n } = useTranslation();
  const [analysis, setAnalysis] = useState<Json | null>(preloadedSecondaryAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string; } | null>(null);
  const currentLang = i18n.language.split('-')[0];

  const sortedScores = useMemo(() => {
    return (Object.entries(scores) as [EneagramaTrait, number][])
      .map(([trait, score]) => ({ trait, score }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const maxScore = useMemo(() => {
    if (sortedScores.length === 0) return 1;
    return Math.max(...sortedScores.map(s => s.score), 1);
  }, [sortedScores]);

  const loadAnalysis = useCallback(async () => {
    if (!userEmail) {
      setError({
        message: t('secondary_traits_error_no_email'),
        details: "O e-mail do usuário é nulo, o que impede a chamada da API de salvamento."
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await getUserProfile(userEmail);
      const existingAnalysis = profile?.secondary_analysis;

      if (existingAnalysis && typeof existingAnalysis === 'object' && !Array.isArray(existingAnalysis) && (existingAnalysis as any)[currentLang]) {
          setAnalysis(existingAnalysis);
      } else {
          const result = await generateSecondaryTraitsAnalysis(
            userInfo?.nome || null,
            mainCharacter,
            secondaryCharacter,
            tertiaryCharacter,
            language
          );
          const finalAnalysis = { ...(typeof existingAnalysis === 'object' ? existingAnalysis : {}), ...result.secondaryAnalysisText };
          setAnalysis(finalAnalysis);
          await saveSecondaryAnalysis(userEmail, finalAnalysis);
      }
    } catch (err) {
      const details = getErrorMessage(err);
      console.error("Error generating secondary traits analysis:", details);
      setError({
        message: t('secondary_traits_error_generating'),
        details: details
      });
    } finally {
      setLoading(false);
    }
  }, [userInfo, userEmail, mainCharacter, secondaryCharacter, tertiaryCharacter, t, language, currentLang]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis, currentLang]);

  const topThreeTraits = useMemo(() => sortedScores.slice(0, 3).map(s => s.trait), [sortedScores]);

  const getBarColor = (trait: EneagramaTrait) => {
    const index = topThreeTraits.indexOf(trait);
    if (index === 0) return 'bg-amber-600';
    if (index === 1) return 'bg-amber-500';
    if (index === 2) return 'bg-amber-400';
    return 'bg-stone-300';
  };

  const getTraitName = (traitKey: EneagramaTrait) => {
    const key = ENEAGRAMA_FILTER_NAMES[traitKey];
    return t(key).replace(/(\d+ - )/, '');
  };

  const analysisText = analysis ? getTranslatedValue(analysis, i18n.language, { noFallback: true }) : '';
  const needsTranslation = !!analysis && !analysisText;

  return (
    <div className="mt-8 border-t-2 border-amber-200 pt-6">
      <h3 className="text-2xl font-bold text-stone-800 text-center mb-6">{t('secondary_traits_title')}</h3>
      
      <div className="space-y-3 mb-6 p-4 bg-stone-50 rounded-lg">
        {Object.keys(ENEAGRAMA_FILTER_NAMES)
          .filter(key => key !== 'all')
          .map(traitKey => {
            const trait = traitKey as EneagramaTrait;
            const score = scores[trait] || 0;
            const percentage = (score / maxScore) * 100;
            return (
              <div key={trait} className="flex items-center gap-2 md:gap-4">
                <span className="w-1/3 text-xs sm:text-sm text-stone-600 text-right">{getTraitName(trait)}</span>
                <div className="w-2/3 bg-stone-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full flex items-center justify-end pr-2 text-white font-bold text-xs transition-all duration-500 ${getBarColor(trait)}`}
                    style={{ width: `${percentage}%` }}
                  >
                    {score > 0 && score}
                  </div>
                </div>
              </div>
            );
        })}
      </div>

      <div>
        {(loading || needsTranslation) && <Loader text={t('loader_analyzing_nuances')} />}
        {error && !loading && (
          <div id="error-log-container" className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold mb-2">{error.message}</p>
              <details className="text-left text-xs text-red-600">
                  <summary className="cursor-pointer font-medium">{t('results_error_log_title')}</summary>
                  <pre className="mt-2 p-2 bg-red-100 rounded whitespace-pre-wrap break-all">{error.details}</pre>
              </details>
          </div>
        )}
        {!loading && !needsTranslation && analysis && (
          <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <p className="text-stone-700 leading-relaxed">{getTranslatedValue(analysis, i18n.language)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryTraits;