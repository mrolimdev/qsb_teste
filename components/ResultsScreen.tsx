import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Character, Scores, UserInfo, EneagramaTrait, Screen, KeyVerse, Devotional, RelationshipAnalysis, StudyPlan } from '../types';
import { generatePersonalizedAnalysis } from '../services/geminiService';
import { saveQuizResult, getUserProfile, grantPremiumAccess } from '../services/databaseService';
import Loader from './Loader';
import { RetakeIcon, EmailIcon, DiamondGoldIcon, ShareIcon, SpinnerIcon } from './icons';
import SecondaryTraits from './SecondaryTraits';
import DailyBread from './DailyBread';
import AllianceConnections from './AllianceConnections';
import StudyPlanSection from './StudyPlanSection';
import { getTranslatedValue } from '../utils/translation';
import { Json } from '../services/database.types';
import { generateReportHtml } from '../utils/reportGenerator';
import { getScoresFromUserInfo } from '../utils/scoreUtils';
import { SEND_REPORT_WEBHOOK_URL } from '../config';
import AbacatePayModal from './AbacatePayModal';

interface ResultsScreenProps {
  character: Character;
  scores: Scores | null;
  userInfo: UserInfo | null;
  userEmail: string | null;
  onRetake: () => void;
  preloadedAnalysis?: Json | null;
  onNavigate: (screen: Screen) => void;
  checkUserStatus: () => Promise<UserInfo | null>;
  onStartTest: () => void;
  hasPreviousResult?: boolean;
  characters: Character[];
  viewMode: 'result' | 'profile';
  pixValue: string | null;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ character, scores, userInfo, userEmail, onRetake, preloadedAnalysis, onNavigate, checkUserStatus, onStartTest, hasPreviousResult, characters, viewMode, pixValue }) => {
  const { t, i18n } = useTranslation();
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfo | null>(userInfo);
  const [personalizedAnalysis, setPersonalizedAnalysis] = useState<Json | null>(preloadedAnalysis || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details: string } | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [showCopied, setShowCopied] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUserInfo(userInfo);
  }, [userInfo]);

  const isFullReportView = viewMode === 'result';
  const currentLang = i18n.language.split('-')[0];

  const displayScores = useMemo(() => {
    if (!isFullReportView) return null;
    return scores || getScoresFromUserInfo(currentUserInfo);
  }, [scores, currentUserInfo, isFullReportView]);
  
  const isPremiumBlocked = isFullReportView && String(currentUserInfo?.acesso) !== '1' && !!displayScores;

  const handleSendEmail = async () => {
    if (!userEmail || !character) return;
    setEmailStatus('sending');
    try {
        const reportHtml = generateReportHtml(
            character,
            currentUserInfo,
            personalizedAnalysis,
            currentUserInfo?.secondary_analysis || null,
            i18n
        );

        const params = new URLSearchParams();
        params.append('email', userEmail);
        params.append('idioma', i18n.language);
        params.append('relatorio_html', reportHtml);
        
        const response = await fetch(SEND_REPORT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Webhook failed to send report: ${errorBody}`);
        }
        
        setEmailStatus('success');
    } catch (error) {
        console.error("Webhook 'send_report' error:", error);
        setEmailStatus('error');
    }
  };

  const loadPersonalizedData = useCallback(async () => {
    if (!displayScores || !userEmail || !character) return;

    setLoading(true);
    setError(null);
    
    try {
        const profile = await getUserProfile(userEmail);
        const existingAnalysis = profile?.relatorio;

        if (existingAnalysis && typeof existingAnalysis === 'object' && !Array.isArray(existingAnalysis) && (existingAnalysis as any)[currentLang]) {
            setPersonalizedAnalysis(existingAnalysis);
        } else {
            const result = await generatePersonalizedAnalysis(character, displayScores, currentUserInfo?.nome || null, i18n.language);
            
            const existingObject = (typeof existingAnalysis === 'object' && existingAnalysis && !Array.isArray(existingAnalysis)) 
                ? existingAnalysis 
                : {};

            const newAnalysisObject = (typeof result.compatibilityAnalysis === 'object' && result.compatibilityAnalysis && !Array.isArray(result.compatibilityAnalysis))
                ? result.compatibilityAnalysis
                : {};

            const finalAnalysis = { ...existingObject, ...newAnalysisObject };

            setPersonalizedAnalysis(finalAnalysis);
            // The result is already saved, so we only update the analysis part.
            await saveQuizResult(userEmail, character, displayScores, finalAnalysis, 0); // tipos is not critical here
        }
    } catch (err) {
      let details = 'Sem detalhes.';
      if (err instanceof Error) {
          details = `Name: ${err.name}\nMessage: ${err.message}\n\nStack:\n${err.stack || 'N/A'}`;
      } else {
          try {
              details = JSON.stringify(err, null, 2);
          } catch {
              details = String(err);
          }
      }
      setError({ message: t('results_error_generating_analysis'), details });
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [character, displayScores, currentUserInfo, userEmail, t, i18n.language, currentLang]);

  useEffect(() => {
    if (isFullReportView && displayScores && !isPremiumBlocked) {
      loadPersonalizedData();
    }
  }, [isFullReportView, displayScores, isPremiumBlocked, loadPersonalizedData, currentLang]);


  const handlePaymentSuccess = async () => {
    if (!userEmail) return;
    try {
      await grantPremiumAccess(userEmail); // Grant access in DB
      const updatedUserInfo = await checkUserStatus(); // Fetch updated profile
      if (updatedUserInfo) {
          setCurrentUserInfo(updatedUserInfo);
      }
      onNavigate('welcome'); // Navigate AFTER DB work is done.
    } catch(error) {
        console.error("Critical Error: Payment was successful but failed to update user profile.", error);
        // This error will be propagated to the payment modal to show an error state.
        throw new Error("Seu pagamento foi confirmado, mas houve um erro ao liberar seu acesso. Por favor, contate o suporte.");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.origin;
    const shareTitle = t('share_title', { characterName: getTranslatedValue(character.name, i18n.language) });
    const shareText = t('share_text', { characterName: getTranslatedValue(character.name, i18n.language) });

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert(t('alert_copy_fallback'));
      }
    }
  };
  
  const [secondaryCharacter, tertiaryCharacter] = useMemo(() => {
    if (!displayScores || !characters || characters.length === 0) {
        return [null, null];
    }
    
    const sorted = (Object.entries(displayScores) as [EneagramaTrait, number][])
      .sort((a, b) => b[1] - a[1]);

    const findCharForTrait = (trait: EneagramaTrait) => {
        return characters.find(c => c.mainTrait === trait) || null;
    };

    const otherTraits = sorted.filter(([trait]) => trait !== character.mainTrait);

    const secondaryTrait = otherTraits.length > 0 ? otherTraits[0][0] : undefined;
    const tertiaryTrait = otherTraits.length > 1 ? otherTraits[1][0] : undefined;
    
    const secChar = secondaryTrait ? findCharForTrait(secondaryTrait) : null;
    const terChar = tertiaryTrait ? findCharForTrait(tertiaryTrait) : null;

    return [secChar, terChar];
  }, [character, characters, displayScores]);

  const showCta = !displayScores;
  const showActions = isFullReportView && !isPremiumBlocked;
  const tags = character.tags && Array.isArray(character.tags) ? (character.tags as Json[]) : [];
  
  const analysisText = personalizedAnalysis ? getTranslatedValue(personalizedAnalysis, i18n.language, { noFallback: true }) : '';
  const analysisIsExpected = isFullReportView && displayScores && !isPremiumBlocked;
  const needsTranslation = analysisIsExpected && personalizedAnalysis && !analysisText;

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-2xl font-normal text-stone-600">{displayScores ? t('results_you_are_like', { name: currentUserInfo?.nome || t('you') }) : t('results_profile_of')}</h2>
            <h1 className="text-[38px] md:text-6xl font-bold text-amber-700 mb-2">{getTranslatedValue(character.name, i18n.language)}!</h1>
            <h3 className="text-xl md:text-2xl font-display text-stone-600 italic mb-4">{getTranslatedValue(character.tagline, i18n.language)}</h3>
            
            <img
              src={character.imageUrl || ''}
              alt={t('results_char_illustration_alt', { characterName: getTranslatedValue(character.name, i18n.language) })}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full mx-auto my-4 border-8 border-amber-200 shadow-lg object-cover bg-stone-200"
            />

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {tags.map((tag, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {getTranslatedValue(tag, i18n.language)}
                </span>
              ))}
            </div>

            {character.audio && currentLang === 'pt' && (
              <div className="my-6 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-inner max-w-md mx-auto">
                <p className="text-center text-stone-600 font-semibold mb-3">
                  {t('results_audio_caption', { characterName: getTranslatedValue(character.name, i18n.language) })}
                </p>
                <audio controls src={character.audio} className="w-full">
                    Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          
          {isPremiumBlocked ? (
             <div className="text-center p-4 md:p-8 flex flex-col items-center mt-6 border-t-2 border-dashed border-amber-200">
                <div className="bg-amber-100 p-4 rounded-full my-4">
                  <DiamondGoldIcon className="w-12 h-12 text-amber-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">{t('premium_lock_title')}</h2>
                <p className="text-lg text-amber-700 font-semibold mb-4">{t('premium_lock_subtitle')}</p>
                <p className="text-stone-600 max-w-md mb-8">
                  {t('premium_lock_description')}
                </p>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg flex items-center justify-center"
                >
                  {t('premium_lock_button_unlock')}
                </button>
              </div>
          ) : (
            <>
              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-3">{t('results_who_was', { characterName: getTranslatedValue(character.name, i18n.language) })}</h3>
                  <p className="text-stone-700 leading-relaxed">{getTranslatedValue(character.description, i18n.language)}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-3">{t('results_personality_analysis')}</h3>
                  <p className="text-stone-700 leading-relaxed">{getTranslatedValue(character.analysis, i18n.language)}</p>
                </div>
                
                {displayScores && (
                  <>
                    <div>
                        <h3 className="text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-3">{t('results_compatibility_analysis')}</h3>
                        {(loading || needsTranslation) && <Loader text={t('loader_generating_analysis')} />}
                        {error && !loading && (
                            <div id="error-log-container" className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-red-700 font-semibold mb-2">{error.message}</p>
                              <details className="text-left text-xs text-red-600">
                                  <summary className="cursor-pointer font-medium">{t('results_error_log_title')}</summary>
                                  <pre className="mt-2 p-2 bg-red-100 rounded whitespace-pre-wrap break-all">{error.details}</pre>
                              </details>
                            </div>
                        )}
                        {!loading && !needsTranslation && personalizedAnalysis && <p className="text-stone-700 leading-relaxed">{getTranslatedValue(personalizedAnalysis, i18n.language)}</p>}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-3">{t('results_growth_journey')}</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-lg text-green-700">{t('results_strengths')}</h4>
                          <p className="text-stone-700 leading-relaxed">{getTranslatedValue(character.strengthsInFaith, i18n.language)}</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-red-700">{t('results_vigilance_areas')}</h4>
                          <p className="text-stone-700 leading-relaxed">{getTranslatedValue(character.areasForVigilance, i18n.language)}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <h3 className="text-xl font-bold text-stone-800 border-b-2 border-amber-300 pb-2 mb-3">{t('results_key_verses')}</h3>
                  <ul className="space-y-3">
                    {(character.keyVerses && Array.isArray(character.keyVerses) ? (character.keyVerses as unknown as KeyVerse[]) : []).map((verse, index) => (
                      <li key={index} className="p-3 bg-stone-100 rounded-lg">
                        <blockquote className="italic text-stone-600">"{getTranslatedValue(verse.texto, i18n.language)}"</blockquote>
                        <p className="text-right font-semibold text-amber-700 mt-1">{getTranslatedValue(verse.referencia, i18n.language)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {displayScores && (
                <>
                  <SecondaryTraits
                      scores={displayScores}
                      userInfo={currentUserInfo}
                      userEmail={userEmail}
                      mainCharacter={character}
                      secondaryCharacter={secondaryCharacter}
                      tertiaryCharacter={tertiaryCharacter}
                      preloadedSecondaryAnalysis={currentUserInfo?.secondary_analysis || null}
                      language={i18n.language}
                  />
                  <div className="mt-10 pt-6 border-t-4 border-double border-amber-300">
                      <h2 className="text-3xl font-bold text-stone-800 text-center mb-6 font-display">{t('results_deepen_journey')}</h2>
                      <DailyBread devotionals={character.dailyDevotionals && Array.isArray(character.dailyDevotionals) ? (character.dailyDevotionals as unknown as Devotional[]) : []} />
                      <AllianceConnections analyses={character.relationshipAnalyses && Array.isArray(character.relationshipAnalyses) ? (character.relationshipAnalyses as unknown as RelationshipAnalysis[]) : []} />
                      <StudyPlanSection plan={typeof character.studyPlan === 'object' && character.studyPlan !== null && !Array.isArray(character.studyPlan) ? (character.studyPlan as unknown as StudyPlan) : { readings: [], reflectionQuestions: [], prayer: '' }} />
                  </div>
                </>
              )}
            </>
          )}

          {showActions && (
            <div className="mt-10 pt-6 border-t-2 border-amber-200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onRetake}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-stone-200 text-stone-800 font-bold rounded-full hover:bg-stone-300 transition-all text-base"
              >
                <RetakeIcon className="w-5 h-5" />
                {t('button_retake_test')}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transition-all text-base"
              >
                <ShareIcon className="w-5 h-5" />
                {t('button_share')}
              </button>
              <button
                onClick={handleSendEmail}
                disabled={emailStatus === 'sending' || emailStatus === 'success'}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-sky-600 text-white font-bold rounded-full shadow-lg hover:bg-sky-700 transition-all text-base disabled:bg-stone-400"
              >
                <EmailIcon className="w-5 h-5" />
                {emailStatus === 'idle' && t('button_send_email')}
                {emailStatus === 'sending' && t('button_sending')}
                {emailStatus === 'success' && t('button_sent')}
                {emailStatus === 'error' && t('button_email_fail')}
              </button>
            </div>
          )}

          {showCta && (
            <div className="mt-8 text-center py-6 border-t border-dashed border-stone-300">
              <h3 className="text-xl font-bold text-stone-800 mb-2">{t('results_cta_title', { characterName: getTranslatedValue(character.name, i18n.language) })}</h3>
              <p className="text-stone-600 mb-6 max-w-lg mx-auto">{t('results_cta_subtitle')}</p>
              <button
                onClick={onStartTest}
                className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-lg"
              >
                {hasPreviousResult ? t('button_see_my_result') : t('button_do_test')}
              </button>
            </div>
          )}
      </div>
      
      {showCopied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-4 py-2 rounded-full shadow-lg animate-fade-in-up">
            {t('results_link_copied')}
        </div>
      )}

      <AbacatePayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userEmail={userEmail}
        onPaymentSuccess={handlePaymentSuccess}
        pixValue={pixValue}
      />
    </>
  );
};

export default ResultsScreen;