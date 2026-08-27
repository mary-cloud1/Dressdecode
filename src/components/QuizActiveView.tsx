import React, { useState, useEffect } from 'react';
import { Question, QuizResult, Difficulty } from '../types';
import { ArrowRight, CheckCircle2, XCircle, Bookmark, Sparkles, X, Volume2, VolumeX } from 'lucide-react';
import { playCorrectAnswerSound, playWrongAnswerSound, playClickSound, speakText, stopSpeech, isSpeaking } from '../utils/audio';

interface QuizActiveViewProps {
  difficulty: Difficulty;
  questions: Question[];
  soundEnabled: boolean;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
  onToggleFavoriteQuestion: (questionId: string) => void;
  isFavorited: (questionId: string) => boolean;
}

export const QuizActiveView: React.FC<QuizActiveViewProps> = ({
  difficulty,
  questions,
  soundEnabled,
  onComplete,
  onExit,
  onToggleFavoriteQuestion,
  isFavorited,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[]>([]);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Stop speech when changing question or leaving
  useEffect(() => {
    stopSpeech();
    setIsPlayingSpeech(false);
  }, [currentIndex]);

  const handleSpeakQuestion = () => {
    if (isPlayingSpeech) {
      stopSpeech();
      setIsPlayingSpeech(false);
    } else {
      setIsPlayingSpeech(true);
      const optionsText = currentQuestion.options
        .map((opt, i) => `Option ${['A', 'B', 'C', 'D'][i]}: ${opt}`)
        .join('. ');
      const speechString = `Question ${currentIndex + 1}: ${currentQuestion.question}. ${optionsText}`;
      
      speakText(speechString, () => {
        setIsPlayingSpeech(false);
      });
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;

    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    
    if (soundEnabled) {
      if (isCorrect) playCorrectAnswerSound();
      else playWrongAnswerSound();
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedIndex: index,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    stopSpeech();
    setIsPlayingSpeech(false);
    if (soundEnabled) playClickSound();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      // Finished quiz!
      const correctCount = userAnswers.filter((a) => a.isCorrect).length;
      const percentage = Math.round((correctCount / questions.length) * 100);
      const passed = percentage >= 70; // 14 out of 20 = 70%

      const result: QuizResult = {
        id: `result_${Date.now()}`,
        difficulty,
        score: correctCount,
        total: questions.length,
        percentage,
        passed,
        timestamp: Date.now(),
        answers: userAnswers,
      };

      onComplete(result);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Header Controls & Progress */}
      <div className="bg-white dark:bg-purple-950/60 rounded-3xl p-5 border border-purple-100 dark:border-purple-800/60 shadow-md shadow-purple-100/50 dark:shadow-purple-950/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/50">
              {difficulty.toUpperCase()} LEVEL
            </span>
            <span className="text-xs text-slate-500 dark:text-purple-400 font-semibold">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Voiceover Button */}
            <button
              onClick={handleSpeakQuestion}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isPlayingSpeech
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                  : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/50'
              }`}
              title={isPlayingSpeech ? 'Stop Voiceover' : 'Read Question Aloud (Voiceover)'}
            >
              {isPlayingSpeech ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingSpeech ? 'Stop Voice' : 'Voiceover'}</span>
            </button>

            <button
              onClick={() => onToggleFavoriteQuestion(currentQuestion.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFavorited(currentQuestion.id)
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                  : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800/50'
              }`}
              title="Save to Favorites"
            >
              <Bookmark className={`w-4 h-4 ${isFavorited(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Favorite</span>
            </button>

            <button
              onClick={() => {
                stopSpeech();
                if (soundEnabled) playClickSound();
                onExit();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors"
              title="Exit Quiz"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-purple-100 dark:bg-purple-900/40 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-6 sm:p-8 border border-purple-100 dark:border-purple-800/60 shadow-xl shadow-purple-100/70 dark:shadow-purple-950/30 space-y-6">
        
        {/* Category Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-100 dark:border-purple-800/50">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>{currentQuestion.category}</span>
        </div>

        {/* Question Text */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-purple-100 leading-snug">
          {currentQuestion.question}
        </h3>

        {/* 4 Answer Options */}
        <div className="grid grid-cols-1 gap-3.5 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedIndex === idx;
            const isCorrectOption = idx === currentQuestion.correctIndex;

            let optionStyle = 'bg-white dark:bg-purple-900/20 text-slate-800 dark:text-purple-100 border-slate-200 dark:border-purple-800/50 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50/50 dark:hover:bg-purple-900/40';

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-400/30';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-500 ring-2 ring-rose-400/30';
              } else {
                optionStyle = 'bg-slate-50 dark:bg-purple-950/20 text-slate-400 dark:text-purple-600 border-slate-100 dark:border-purple-900/20 opacity-60';
              }
            }

            const optionLabels = ['A', 'B', 'C', 'D'];

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-between gap-3 ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center shrink-0 ${
                    isAnswered && isCorrectOption
                      ? 'bg-emerald-500 text-white'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-800/60 dark:text-purple-200'
                  }`}>
                    {optionLabels[idx]}
                  </span>
                  <span>{option}</span>
                </div>

                {/* Instant Feedback Icons */}
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Pro Tip Card */}
        {isAnswered && (
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/60 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Style Decoding & Explanation</span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-800 dark:text-purple-100 leading-relaxed font-medium">
              {currentQuestion.explanation}
            </p>

            {currentQuestion.proTip && (
              <div className="pt-3 border-t border-purple-200/60 dark:border-purple-800/40 flex items-start gap-2.5 text-xs text-purple-800 dark:text-purple-300 font-medium">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold shrink-0">
                  Pro Tip
                </span>
                <span>{currentQuestion.proTip}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      {isAnswered && (
        <div className="flex justify-end animate-fade-in">
          <button
            onClick={handleNext}
            className="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-950/50 hover:scale-[1.02] transition-all"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
