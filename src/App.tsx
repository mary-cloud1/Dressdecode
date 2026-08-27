import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { QuizLevelSelector } from './components/QuizLevelSelector';
import { QuizActiveView } from './components/QuizActiveView';
import { QuizResultModal } from './components/QuizResultModal';
import { ReviewModal } from './components/ReviewModal';
import { StyleDictionaryView } from './components/StyleDictionaryView';
import { TrendCornerView } from './components/TrendCornerView';
import { DailyTipView } from './components/DailyTipView';
import { BadgesView } from './components/BadgesView';
import { ProfileView } from './components/ProfileView';

import { loadUserProgress, saveUserProgress, recordQuizResult, getDefaultUserProgress } from './utils/storage';
import { QUESTIONS } from './data/questions';
import { Difficulty, QuizResult, Question, QuestionCategory } from './types';

export default function App() {
  const [userProgress, setUserProgress] = useState(loadUserProgress);
  const [activeTab, setActiveTab] = useState('quizzes');
  
  // Quiz Running state
  const [activeQuizLevel, setActiveQuizLevel] = useState<Difficulty | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[] | null>(null);
  
  // Result modals state
  const [quizResultModalData, setQuizResultModalData] = useState<QuizResult | null>(null);
  const [reviewResultModalData, setReviewResultModalData] = useState<QuizResult | null>(null);

  // Sync Dark Mode class with DOM
  useEffect(() => {
    if (userProgress.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userProgress.darkMode]);

  // Handler: Start Level Quiz
  const handleSelectLevel = (level: Difficulty) => {
    const levelQuestions = QUESTIONS.filter((q) => q.difficulty === level);
    setActiveQuizLevel(level);
    setActiveQuestions(levelQuestions);
    setQuizResultModalData(null);
  };

  // Handler: Start Practice Mode Quiz
  const handleStartPractice = (category?: QuestionCategory) => {
    let practiceQuestions = [...QUESTIONS];
    if (category) {
      practiceQuestions = practiceQuestions.filter((q) => q.category === category);
    }
    // Shuffle and pick 10
    const shuffled = practiceQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    setActiveQuizLevel('easy'); // practice defaults to easy styling
    setActiveQuestions(shuffled.length > 0 ? shuffled : QUESTIONS.slice(0, 10));
    setQuizResultModalData(null);
  };

  // Handler: Complete Quiz
  const handleQuizComplete = (result: QuizResult) => {
    const { updatedProgress } = recordQuizResult(result, userProgress);
    setUserProgress(updatedProgress);
    setQuizResultModalData(result);
    setActiveQuestions(null);
  };

  // Handler: Exit Quiz
  const handleExitQuiz = () => {
    setActiveQuestions(null);
    setActiveQuizLevel(null);
  };

  // Toggles
  const toggleSound = () => {
    const updated = { ...userProgress, soundEnabled: !userProgress.soundEnabled };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const toggleDarkMode = () => {
    const updated = { ...userProgress, darkMode: !userProgress.darkMode };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  // Bookmark / Favorite Toggles
  const toggleFavoriteTerm = (termId: string) => {
    const favs = userProgress.favorites.termIds;
    const exists = favs.includes(termId);
    const updatedFavs = exists
      ? favs.filter((id) => id !== termId)
      : [...favs, termId];

    const updated = {
      ...userProgress,
      favorites: { ...userProgress.favorites, termIds: updatedFavs }
    };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const toggleFavoriteTrend = (trendId: string) => {
    const favs = userProgress.favorites.trendIds;
    const exists = favs.includes(trendId);
    const updatedFavs = exists
      ? favs.filter((id) => id !== trendId)
      : [...favs, trendId];

    const updated = {
      ...userProgress,
      favorites: { ...userProgress.favorites, trendIds: updatedFavs }
    };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const toggleFavoriteTip = (tipId: string) => {
    const favs = userProgress.favorites.tipIds;
    const exists = favs.includes(tipId);
    const updatedFavs = exists
      ? favs.filter((id) => id !== tipId)
      : [...favs, tipId];

    const updated = {
      ...userProgress,
      favorites: { ...userProgress.favorites, tipIds: updatedFavs }
    };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const toggleFavoriteQuestion = (questionId: string) => {
    const favs = userProgress.favorites.questionIds;
    const exists = favs.includes(questionId);
    const updatedFavs = exists
      ? favs.filter((id) => id !== questionId)
      : [...favs, questionId];

    const updated = {
      ...userProgress,
      favorites: { ...userProgress.favorites, questionIds: updatedFavs }
    };
    setUserProgress(updated);
    saveUserProgress(updated);
  };

  const handleResetProgress = () => {
    const resetState = getDefaultUserProgress();
    setUserProgress(resetState);
    saveUserProgress(resetState);
    setActiveQuestions(null);
    setQuizResultModalData(null);
    setReviewResultModalData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/70 via-white to-purple-50/50 dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-950 text-purple-950 dark:text-purple-100 font-sans transition-colors duration-200">
      
      {/* Top Header */}
      <Header
        userProgress={userProgress}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (activeQuestions) handleExitQuiz();
        }}
        toggleSound={toggleSound}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (activeQuestions) handleExitQuiz();
        }}
        soundEnabled={userProgress.soundEnabled}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Active Quiz View overrides standard tab views when taking a quiz */}
        {activeQuestions && activeQuizLevel ? (
          <QuizActiveView
            difficulty={activeQuizLevel}
            questions={activeQuestions}
            soundEnabled={userProgress.soundEnabled}
            onComplete={handleQuizComplete}
            onExit={handleExitQuiz}
            onToggleFavoriteQuestion={toggleFavoriteQuestion}
            isFavorited={(id) => userProgress.favorites.questionIds.includes(id)}
          />
        ) : (
          <>
            {activeTab === 'quizzes' && (
              <QuizLevelSelector
                userProgress={userProgress}
                onSelectLevel={handleSelectLevel}
                onStartPractice={handleStartPractice}
              />
            )}

            {activeTab === 'dictionary' && (
              <StyleDictionaryView
                favoriteTermIds={userProgress.favorites.termIds}
                onToggleFavoriteTerm={toggleFavoriteTerm}
                soundEnabled={userProgress.soundEnabled}
              />
            )}

            {activeTab === 'trends' && (
              <TrendCornerView
                favoriteTrendIds={userProgress.favorites.trendIds}
                onToggleFavoriteTrend={toggleFavoriteTrend}
                soundEnabled={userProgress.soundEnabled}
              />
            )}

            {activeTab === 'tip' && (
              <DailyTipView
                favoriteTipIds={userProgress.favorites.tipIds}
                onToggleFavoriteTip={toggleFavoriteTip}
                soundEnabled={userProgress.soundEnabled}
              />
            )}

            {activeTab === 'badges' && (
              <BadgesView userProgress={userProgress} />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                userProgress={userProgress}
                onResetProgress={handleResetProgress}
                soundEnabled={userProgress.soundEnabled}
              />
            )}
          </>
        )}

      </main>

      {/* Celebratory / Result Modal */}
      {quizResultModalData && (
        <QuizResultModal
          result={quizResultModalData}
          userProgress={userProgress}
          soundEnabled={userProgress.soundEnabled}
          onRetry={() => {
            handleSelectLevel(quizResultModalData.difficulty);
          }}
          onReview={() => {
            setReviewResultModalData(quizResultModalData);
            setQuizResultModalData(null);
          }}
          onBackToLevels={() => {
            setQuizResultModalData(null);
            setActiveQuizLevel(null);
            setActiveTab('quizzes');
          }}
        />
      )}

      {/* Answer Review Modal */}
      {reviewResultModalData && (
        <ReviewModal
          result={reviewResultModalData}
          questions={QUESTIONS}
          soundEnabled={userProgress.soundEnabled}
          onClose={() => setReviewResultModalData(null)}
        />
      )}

    </div>
  );
}
