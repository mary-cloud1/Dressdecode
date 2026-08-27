import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuizResult, UserProgress } from '../types';
import { playSuccessSound, playEncouragingSound, playClickSound } from '../utils/audio';
import { Trophy, RefreshCw, ArrowLeft, CheckCircle2, XCircle, Award, Sparkles, Eye } from 'lucide-react';

interface QuizResultModalProps {
  result: QuizResult;
  userProgress: UserProgress;
  soundEnabled: boolean;
  onRetry: () => void;
  onReview: () => void;
  onBackToLevels: () => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  result,
  userProgress,
  soundEnabled,
  onRetry,
  onReview,
  onBackToLevels,
}) => {
  useEffect(() => {
    if (result.passed) {
      if (soundEnabled) playSuccessSound();
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7e22ce', '#9333ea', '#a855f7', '#c084fc', '#e9d5ff', '#f59e0b']
        });
      } catch (e) {
        // ignore if confetti fails
      }
    } else {
      if (soundEnabled) playEncouragingSound();
    }
  }, [result.passed, soundEnabled]);

  const levelTitles: Record<string, string> = {
    easy: 'Easy Level',
    medium: 'Medium Level',
    hard: 'Hard Level'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-purple-950 rounded-[40px] p-6 sm:p-10 border border-purple-100 dark:border-purple-800 shadow-2xl shadow-purple-950/20 space-y-6 my-8">
        
        {/* Pass / Fail Icon Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-purple-50 dark:bg-purple-900/40 border border-purple-100 dark:border-purple-800">
            {result.passed ? (
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950/50 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200 dark:shadow-purple-950/50">
                <Sparkles className="w-8 h-8 text-amber-300" />
              </div>
            )}
          </div>

          <span className="block text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {levelTitles[result.difficulty]} Completed
          </span>

          {/* Exact Required Prompt Messages */}
          {result.passed ? (
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-purple-100 leading-tight">
              🎉 Well done! You passed!
            </h2>
          ) : (
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-purple-100 leading-snug">
              💜 Keep going, you're doing great! Review the answers and try again.
            </h2>
          )}
        </div>

        {/* Score & Percentage Breakdown Card */}
        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-3xl p-5 border border-purple-100 dark:border-purple-800/60 grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="block text-xs font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
              Score
            </span>
            <span className="text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
              {result.score} / {result.total}
            </span>
          </div>

          <div className="border-x border-purple-100 dark:border-purple-800/60">
            <span className="block text-xs font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
              Accuracy
            </span>
            <span className={`text-2xl font-extrabold font-serif ${result.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-purple-200'}`}>
              {result.percentage}%
            </span>
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
              Status
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block mt-1 ${
              result.passed
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
            }`}>
              {result.passed ? 'PASSED' : 'RETRY'}
            </span>
          </div>
        </div>

        {/* Next Level Unlocked Banner if Passed */}
        {result.passed && result.difficulty !== 'hard' && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/50 border border-purple-100 dark:border-purple-700 flex items-center gap-3">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-300 shrink-0" />
            <p className="text-xs font-semibold text-slate-800 dark:text-purple-200">
              Congratulations! The {result.difficulty === 'easy' ? 'Medium' : 'Hard'} Level has been unlocked for you!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              if (soundEnabled) playClickSound();
              onReview();
            }}
            className="w-full py-4 px-4 rounded-2xl bg-white dark:bg-purple-900/50 hover:bg-purple-50 dark:hover:bg-purple-800/50 text-slate-800 dark:text-purple-100 font-bold text-xs uppercase tracking-wider border border-purple-200 dark:border-purple-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Review Answers & Explanations</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (soundEnabled) playClickSound();
                onRetry();
              }}
              className="py-4 px-4 rounded-2xl bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/60 text-purple-800 dark:text-purple-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) playClickSound();
                onBackToLevels();
              }}
              className="py-4 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-purple-100 dark:shadow-purple-950/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Levels</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
