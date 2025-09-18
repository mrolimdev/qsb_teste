import React, { useState, useCallback, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import CharacterGallery from './components/CharacterGallery';
import Header from './components/Header';
import EmailScreen from './components/EmailScreen';
import VerifyScreen from './components/VerifyScreen';
import AskNameScreen from './components/AskNameScreen';
import AboutScreen from './components/AboutScreen';
import AdminScreen from './components/AdminScreen';
import CharacterForm from './components/CharacterForm';
import Loader from './components/Loader';
import { Character, EneagramaTrait, Scores, Screen, UserInfo, UserProfile } from './types';
import { generateCharacterProfile } from './services/geminiService';
import { getUserProfile, updateUserName, saveQuizResult, upsertUserProfile, getCharacters, getPixValue } from './services/databaseService';
import { SEND_CODE_WEBHOOK_URL, ADMIN_EMAIL } from './config';
import AICharacterModal from './components/AICharacterModal';
import { useTranslation } from 'react-i18next';
import { getTranslatedValue } from './utils/translation';
import { Json } from './services/database.types';
import { getScoresFromUserInfo } from './utils/scoreUtils';
import Footer from './components/Footer';

const getGenderFromName = (name: string): 'male' | 'female' | 'unknown' => {
    const nameParts = name.trim().toLowerCase().split(' ');
    let lowerCaseName = nameParts[0];

    if (lowerCaseName === 'apóstolo' && nameParts.length > 1) {
        lowerCaseName = nameParts[1];
    }
    if (['jonas', 'isaías', 'isaias', 'josué', 'josue', 'noé', 'noe', 'calebe', 'gideão', 'gideao', 'filipe', 'josé', 'tomé', 'andré'].includes(lowerCaseName)) {
        return 'male';
    }
    if (['jael', 'abigail', 'ester', 'raquel'].includes(lowerCaseName)) {
        return 'female';
    }
    if (lowerCaseName.endsWith('a') || lowerCaseName.endsWith('e') || lowerCaseName.endsWith('ã')) {
        return 'female';
    }
    if (lowerCaseName.endsWith('o') || lowerCaseName.endsWith('ão') || lowerCaseName.endsWith('r') || lowerCaseName.endsWith('s') || lowerCaseName.endsWith('l') || lowerCaseName.endsWith('i') || lowerCaseName.endsWith('u') || lowerCaseName.endsWith('é')) {
        return 'male';
    }
    return 'unknown';
};

const getEneagramaNumber = (trait: EneagramaTrait): number => {
  switch (trait) {
    case EneagramaTrait.INTEGRO: return 1;
    case EneagramaTrait.SERVO: return 2;
    case EneagramaTrait.MORDOMO: return 3;
    case EneagramaTrait.ADORADOR: return 4;
    case EneagramaTrait.SABIO: return 5;
    case EneagramaTrait.FIEL: return 6;
    case EneagramaTrait.CELEBRANTE: return 7;
    case EneagramaTrait.PROTETOR: return 8;
    case EneagramaTrait.PACIFICADOR: return 9;
    default: return 0;
  }
};


const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [finalCharacter, setFinalCharacter] = useState<Character | null>(null);
  const [userScores, setUserScores] = useState<Scores | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [tempEmail, setTempEmail] = useState<string | null>(null);
  const [sentVerificationCode, setSentVerificationCode] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [preloadedAnalysis, setPreloadedAnalysis] = useState<Json | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
  const [hasPreviousResult, setHasPreviousResult] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [resultsViewMode, setResultsViewMode] = useState<'result' | 'profile'>('result');
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [pixValue, setPixValue] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.title = t('app_title');
  }, [i18n.language, t]);

  const loadUserProfile = useCallback(async (email: string): Promise<UserInfo | null> => {
    if (!email) {
      setUserInfo(null);
      return null;
    }
    try {
      const profile = await getUserProfile(email);
      setUserInfo(profile);
      return profile;
    } catch (error) {
      console.error("Failed to load user profile:", error);
      setUserInfo(null);
      return null;
    }
  }, []);

  const initializeApp = useCallback(async () => {
    setIsLoadingApp(true);
    try {
      // User request: log out on every page load/reload
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail) {
        localStorage.removeItem('userEmail');
        setUserEmail(null);
        setUserInfo(null);
        setHasPreviousResult(false);
        setIsAdmin(false);
      }
      
      const [fetchedCharacters, fetchedPixValue] = await Promise.all([
        getCharacters(),
        getPixValue()
      ]);
      setCharacters(fetchedCharacters);
      
      if (fetchedPixValue) {
        setPixValue(fetchedPixValue);
      } else {
        console.warn('PIX value not found in database, using fallback value "49,90".');
        setPixValue('49,90'); // Fallback if DB value is null/not found
      }

    } catch (error) {
      console.error("Failed to initialize app. This might be a database connection or RLS policy issue. Using fallback PIX value.", error);
      setPixValue('49,90'); // Fallback value on any initialization error
    } finally {
      setIsLoadingApp(false);
    }
  }, []);
  
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const refreshCharacters = useCallback(async () => {
    setIsLoadingCharacters(true);
    try {
      const fetchedCharacters = await getCharacters();
      setCharacters(fetchedCharacters);
    } catch (error) {
      console.error("Failed to refresh characters:", error);
    } finally {
      setIsLoadingCharacters(false);
    }
  }, []);
  
  const determineFinalCharacter = useCallback((scores: Scores, currentUserInfo: UserInfo | null, allCharacters: Character[]): Character => {
    let highestTrait: EneagramaTrait | null = null;
    let maxScore = -1;
    for (const trait in scores) {
      if (scores[trait as EneagramaTrait] > maxScore) {
        maxScore = scores[trait as EneagramaTrait];
        highestTrait = trait as EneagramaTrait;
      }
    }
    let potentialCharacters = allCharacters.filter(c => c.mainTrait === highestTrait);
    if (currentUserInfo?.nome) {
        const userGender = getGenderFromName(currentUserInfo.nome);
        if (userGender !== 'unknown') {
            const genderFilteredCharacters = potentialCharacters.filter(c => c.gender === userGender);
            if (genderFilteredCharacters.length > 0) {
                potentialCharacters = genderFilteredCharacters;
            }
        }
    }
    if (potentialCharacters.length > 0) {
      return potentialCharacters[Math.floor(Math.random() * potentialCharacters.length)];
    }
    return allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }, []);

  const handleTestComplete = useCallback(async (scores: Scores) => {
    const character = determineFinalCharacter(scores, userInfo, characters);
    
    if (userEmail) {
        try {
            const tipos = getEneagramaNumber(character.mainTrait);
            // Save the result immediately with scores, but no analysis yet.
            await saveQuizResult(userEmail, character, scores, null, tipos);
            
            // Refresh user info to include the new character and scores
            const updatedProfile = await getUserProfile(userEmail);
            if (updatedProfile) {
              setUserInfo(updatedProfile);
            }
        } catch (error) {
            console.error("Error saving initial quiz result:", error);
        }
    }

    setFinalCharacter(character);
    setUserScores(scores);
    setPreloadedAnalysis(null);
    setHasPreviousResult(true);
    setResultsViewMode('result');
    setCurrentScreen('results');
  }, [determineFinalCharacter, userInfo, characters, userEmail]);

  const handleRetakeTest = () => {
    setFinalCharacter(null);
    setUserScores(null);
    setPreloadedAnalysis(null);
    setCurrentScreen('teste');
  };

  const loadResultAndNavigate = (profile: UserInfo, allCharacters: Character[]) => {
    // Priority 1: Use the saved character name if it exists.
    if (profile.personagem) {
      const savedCharacter = allCharacters.find(c => getTranslatedValue(c.name, 'pt').toLowerCase() === profile.personagem!.toLowerCase());
      if (savedCharacter) {
        const scores = getScoresFromUserInfo(profile);
        setFinalCharacter(savedCharacter);
        setUserScores(scores);
        setPreloadedAnalysis(profile.relatorio || null);
        setHasPreviousResult(true);
        setResultsViewMode('result');
        setCurrentScreen('results');
        return true; // Navigation handled
      }
    }
  
    // Priority 2 (Fallback): If no character name, but scores exist, determine character.
    const previousScores = getScoresFromUserInfo(profile);
    if (previousScores) {
      const character = determineFinalCharacter(previousScores, profile, allCharacters);
      setFinalCharacter(character);
      setUserScores(previousScores);
      setPreloadedAnalysis(profile.relatorio || null);
      setHasPreviousResult(true);
      setResultsViewMode('result');
      setCurrentScreen('results');
      return true; // Navigation handled
    }
  
    return false; // No previous result found, navigation not handled.
  };

  const handleStartTest = async () => {
    if (!userEmail) {
      setCurrentScreen('email');
      return;
    }
  
    setIsLoadingApp(true);
    const profile = await loadUserProfile(userEmail);
    setIsLoadingApp(false);
  
    if (!profile) {
      setCurrentScreen('askName'); // Should not happen for a logged in user, but for safety
      return;
    }

    const navigated = loadResultAndNavigate(profile, characters);
    if (navigated) return;
  
    // If no result, continue to test
    if (profile.nome) {
      setCurrentScreen('teste');
    } else {
      setCurrentScreen('askName');
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setTempEmail(email);
    setVerificationError(null);

    const verificationCode = Math.floor(100000 + Math.random() * 90000).toString();
    setSentVerificationCode(verificationCode);

    const params = new URLSearchParams();
    params.append('email', email);
    params.append('codigo', verificationCode);

    try {
      const response = await fetch(SEND_CODE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (!response.ok) {
        throw new Error('Webhook failed to send code');
      }
      setCurrentScreen('verify');
    } catch (error) {
      console.error("Webhook 'send_code' error:", error);
      throw error;
    }
  };

  const handleCodeVerify = async (code: string): Promise<boolean> => {
    if (code !== sentVerificationCode) {
      setVerificationError('verify_error_invalid_code');
      return false;
    }

    if (!tempEmail) {
        setVerificationError('verify_error_profile');
        return false;
    }
    
    setVerificationError(null);
    setIsLoadingApp(true);
    
    try {
        const profile = await upsertUserProfile(tempEmail);
        setIsLoadingApp(false);

        if (!profile) {
            throw new Error("Profile creation/retrieval failed");
        }
        
        setUserEmail(tempEmail);
        setUserInfo(profile);
        localStorage.setItem('userEmail', tempEmail);

        if(tempEmail === ADMIN_EMAIL) {
            setIsAdmin(true);
        }

        const navigated = loadResultAndNavigate(profile, characters);
        if (navigated) return true;

        if (profile.nome) {
            setCurrentScreen('teste');
        } else {
            setCurrentScreen('askName');
        }

        return true;

    } catch (error) {
        console.error('Error during profile access:', error);
        setVerificationError('verify_error_profile');
        setIsLoadingApp(false);
        return false;
    }
  };

  const handleResendCode = async () => {
      if (tempEmail) {
          await handleEmailSubmit(tempEmail);
      }
  };

  const handleNameSubmit = async (name: string) => {
    if (userEmail) {
      await updateUserName(userEmail, name);
      const updatedProfile = { ...userInfo, nome: name } as UserInfo;
      setUserInfo(updatedProfile);
      setCurrentScreen('teste');
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    setUserInfo(null);
    setFinalCharacter(null);
    setUserScores(null);
    setPreloadedAnalysis(null);
    setHasPreviousResult(false);
    setIsAdmin(false);
    localStorage.removeItem('userEmail');
    setCurrentScreen('welcome');
  };

  const handleNavigate = (screen: Screen) => {
    if (screen === 'admin' && !isAdmin) {
        setCurrentScreen('welcome');
        return;
    }
    setViewingUser(null);
    setResultsViewMode('result');
    setCurrentScreen(screen);
  };
  
  const handleSelectCharacterInGallery = (character: Character) => {
    setFinalCharacter(character);
    setUserScores(null);
    setPreloadedAnalysis(null);
    setResultsViewMode('profile');
    setCurrentScreen('results');
  };
  
  const handleEditCharacter = (character: Character) => {
      setEditingCharacter(character);
      setCurrentScreen('characterForm');
  };

  const handleCreateWithAI = async (characterName: string) => {
      setIsGeneratingCharacter(true);
      try {
          const profile = await generateCharacterProfile(characterName, i18n.language);
          const newCharacter = {
              ...profile,
              id: characterName.toLowerCase().replace(/\s+/g, '_'),
              imageUrl: '', // Will be set in the form
              imagePromptDescription: '', // Will be set in the form
          } as Character;
          handleEditCharacter(newCharacter);
      } catch (error) {
          alert(t('alert_ai_char_fail', { error: error instanceof Error ? error.message : String(error) }));
      } finally {
          setIsGeneratingCharacter(false);
      }
  };

  const handleCharacterFormSubmit = () => {
      setEditingCharacter(null);
      refreshCharacters();
      setCurrentScreen('admin');
  };
  
  const handleViewUserReport = (user: UserProfile) => {
    const profile = user as UserInfo;
    const scores = getScoresFromUserInfo(profile);
    if (profile.personagem && scores) {
        const character = characters.find(c => getTranslatedValue(c.name, 'pt').toLowerCase() === profile.personagem!.toLowerCase());
        if (character) {
            setViewingUser(user);
            setFinalCharacter(character);
            setUserScores(scores);
            setPreloadedAnalysis(profile.relatorio || null);
            setResultsViewMode('result');
            setCurrentScreen('results');
        }
    } else {
        alert(t('admin_users_view_report_unavailable'));
    }
  };
  
  const renderScreen = () => {
    if (isLoadingApp || !pixValue) return <div className="flex-grow flex items-center justify-center"><Loader text={t('loader_journey')} /></div>;

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartTest} hasPreviousResult={hasPreviousResult} />;
      case 'email':
        return <EmailScreen onEmailSubmit={handleEmailSubmit} />;
      case 'verify':
        return <VerifyScreen 
                  userEmail={tempEmail!} 
                  errorKey={verificationError} 
                  onVerify={handleCodeVerify}
                  onResend={handleResendCode}
                  onBack={() => setCurrentScreen('email')}
                />;
      case 'askName':
        return <AskNameScreen onNameSubmit={handleNameSubmit} />;
      case 'teste':
        return <QuizScreen userInfo={userInfo} onComplete={handleTestComplete} />;
      case 'results':
        if (finalCharacter) {
          return <ResultsScreen
                    character={finalCharacter}
                    scores={userScores}
                    userInfo={viewingUser || userInfo}
                    userEmail={viewingUser ? viewingUser.email : userEmail}
                    onRetake={handleRetakeTest}
                    preloadedAnalysis={preloadedAnalysis}
                    onNavigate={handleNavigate}
                    checkUserStatus={() => loadUserProfile(userEmail!)}
                    onStartTest={handleStartTest}
                    hasPreviousResult={hasPreviousResult}
                    characters={characters}
                    viewMode={resultsViewMode}
                    pixValue={pixValue}
                    isAdmin={isAdmin}
                  />;
        }
        return <WelcomeScreen onStart={handleStartTest} hasPreviousResult={hasPreviousResult} />;
      case 'gallery':
        return <CharacterGallery 
                  characters={characters} 
                  isLoading={isLoadingCharacters} 
                  onRefresh={refreshCharacters}
                  onSelectCharacter={handleSelectCharacterInGallery}
                  onStartTest={handleStartTest}
                  hasPreviousResult={hasPreviousResult}
                />;
      case 'about':
        return <AboutScreen onStart={handleStartTest} hasPreviousResult={hasPreviousResult} />;
      case 'admin':
        if (isAdmin) {
          return <AdminScreen 
            characters={characters} 
            onEditCharacter={handleEditCharacter}
            onCreateWithAI={handleCreateWithAI}
            onRefreshCharacters={refreshCharacters}
            isGeneratingCharacter={isGeneratingCharacter}
            onViewUserReport={handleViewUserReport}
          />;
        }
        return <WelcomeScreen onStart={handleStartTest} />;
      case 'characterForm':
        if (isAdmin) {
            return <CharacterForm 
                        characterToEdit={editingCharacter} 
                        onFormSubmit={handleCharacterFormSubmit} 
                        onCancel={() => { setEditingCharacter(null); setCurrentScreen('admin'); }} 
                    />;
        }
        return <WelcomeScreen onStart={handleStartTest} />;
      default:
        return <WelcomeScreen onStart={handleStartTest} hasPreviousResult={hasPreviousResult} />;
    }
  };
  
  const mainContentClass = `flex flex-col items-center flex-grow w-full p-4 sm:p-6 lg:p-8`;
  const welcomeScreenClass = `flex flex-col items-center justify-center flex-grow p-4 sm:p-6 lg:p-8`;
  const screensToCenterVertically: Screen[] = ['email', 'verify', 'askName'];
  
  return (
    <div className="bg-stone-100 min-h-screen flex flex-col">
      <Header 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        userInfo={viewingUser || userInfo}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        isViewingAsAdmin={!!viewingUser}
      />
      <main className={
        currentScreen === 'welcome' 
          ? welcomeScreenClass 
          : `${mainContentClass} ${screensToCenterVertically.includes(currentScreen) ? 'justify-center' : ''}`
      }>
        {renderScreen()}
      </main>
      <Footer />
    </div>
  );
};

export default App;