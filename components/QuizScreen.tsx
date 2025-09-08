import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TEST_QUESTIONS } from '../constants';
import { Scores, Question, Answer, EneagramaTrait, UserInfo } from '../types';

interface QuizScreenProps {
  userInfo: UserInfo | null;
  onComplete: (scores: Scores) => void;
}

const initialScores: Scores = {
  [EneagramaTrait.INTEGRO]: 0,
  [EneagramaTrait.SERVO]: 0,
  [EneagramaTrait.MORDOMO]: 0,
  [EneagramaTrait.ADORADOR]: 0,
  [EneagramaTrait.SABIO]: 0,
  [EneagramaTrait.FIEL]: 0,
  [EneagramaTrait.CELEBRANTE]: 0,
  [EneagramaTrait.PROTETOR]: 0,
  [EneagramaTrait.PACIFICADOR]: 0,
};

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


const QuizScreen: React.FC<QuizScreenProps> = ({ userInfo, onComplete }) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Scores>(initialScores);

  // Shuffle questions once when the component mounts
  const questions = useMemo(() => shuffleArray(TEST_QUESTIONS), []);

  const handleAnswerClick = (answer: Answer) => {
    const newScores = { ...scores, [answer.trait]: scores[answer.trait] + 1 };
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete(newScores);
    }
  };

  const currentQuestion: Question = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      {userInfo?.nome && (
          <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-stone-800">{t('quiz_greeting', { name: userInfo.nome })}</h1>
              <p className="text-stone-600 text-lg">{t('quiz_subtitle')}</p>
          </div>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-amber-700">{t('quiz_progress', { current: currentQuestionIndex + 1, total: questions.length })}</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5">
          <div
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800">{t(currentQuestion.textKey)}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            className="p-4 bg-stone-100 border-2 border-transparent text-stone-700 rounded-lg hover:bg-amber-100 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 text-left"
          >
            {t(answer.textKey)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;