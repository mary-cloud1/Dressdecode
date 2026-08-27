import React, { useState } from 'react';
import { UserProgress } from '../types';
import { User, ShieldCheck, Flame, Trophy, Target, BookOpen, RefreshCw, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ProfileViewProps {
  userProgress: UserProgress;
  onResetProgress: () => void;
  soundEnabled: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProgress,
  onResetProgress,
  soundEnabled,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const accuracyRate = userProgress.totalQuestionsAnswered > 0
    ? Math.round((userProgress.totalCorrectAnswers / userProgress.totalQuestionsAnswered) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="rounded-[40px] bg-white dark:bg-purple-950/70 p-6 sm:p-10 shadow-xl shadow-purple-100 dark:shadow-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-600 flex items-center justify-center text-white text-3xl font-serif font-bold shadow-md shadow-purple-100 shrink-0">
          DD
        </div>

        <div className="text-center sm:text-left space-y-2">
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fashion Enthusiast</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            Style Profile & <span className="text-purple-600 dark:text-purple-400">Mastery</span>
          </h2>
          <p className="text-slate-500 dark:text-purple-200 text-xs sm:text-sm leading-relaxed">
            Track your quiz history, level accuracy, bookmarked learning terms, and streak stats.
          </p>
        </div>
      </div>

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-5 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-1 text-center">
          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto" />
          <span className="block text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
            {accuracyRate}%
          </span>
          <span className="text-[11px] font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
            Overall Accuracy
          </span>
        </div>

        <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-5 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-1 text-center">
          <Flame className="w-5 h-5 text-amber-500 mx-auto" />
          <span className="block text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
            {userProgress.streak.count} Days
          </span>
          <span className="text-[11px] font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
            Active Streak
          </span>
        </div>

        <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-5 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-1 text-center">
          <Trophy className="w-5 h-5 text-amber-500 mx-auto" />
          <span className="block text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
            {userProgress.unlockedBadgeIds.length}
          </span>
          <span className="text-[11px] font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
            Badges Earned
          </span>
        </div>

        <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-5 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-1 text-center">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto" />
          <span className="block text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
            {userProgress.favorites.termIds.length + userProgress.favorites.trendIds.length + userProgress.favorites.tipIds.length}
          </span>
          <span className="text-[11px] font-bold text-slate-400 dark:text-purple-400 uppercase tracking-wider">
            Saved Favorites
          </span>
        </div>

      </div>

      {/* Completed Levels Overview */}
      <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-6 sm:p-8 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-4">
        <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-purple-100">
          Level Progression Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-purple-200 uppercase tracking-wider">Easy Level</span>
              {userProgress.completedLevels.easy && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <div className="text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
              Best: {userProgress.bestScores.easy} / 20
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              {userProgress.completedLevels.easy ? '✓ Passed (Unlocked Medium)' : 'In Progress'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-purple-200 uppercase tracking-wider">Medium Level</span>
              {userProgress.completedLevels.medium && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <div className="text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
              Best: {userProgress.bestScores.medium} / 20
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              {userProgress.completedLevels.medium ? '✓ Passed (Unlocked Hard)' : userProgress.completedLevels.easy ? 'Unlocked' : 'Locked'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-purple-200 uppercase tracking-wider">Hard Level</span>
              {userProgress.completedLevels.hard && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>
            <div className="text-2xl font-extrabold font-serif text-slate-900 dark:text-purple-100">
              Best: {userProgress.bestScores.hard} / 20
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              {userProgress.completedLevels.hard ? '✓ Passed (Mastered!)' : userProgress.completedLevels.medium ? 'Unlocked' : 'Locked'}
            </span>
          </div>

        </div>
      </div>

      {/* Quiz History log */}
      <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-6 sm:p-8 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-4">
        <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-purple-100">
          Recent Quiz Attempts History
        </h3>

        {userProgress.history.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {userProgress.history.map((hist) => (
              <div
                key={hist.id}
                className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-800 dark:text-purple-100 block">
                    {hist.difficulty} Level
                  </span>
                  <span className="text-slate-400 dark:text-purple-400 font-medium">
                    {new Date(hist.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold font-serif text-sm text-slate-900 dark:text-purple-100">
                    {hist.score} / {hist.total} ({hist.percentage}%)
                  </span>

                  <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                    hist.passed
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                  }`}>
                    {hist.passed ? 'Passed' : 'Not Passed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-purple-400 py-4 italic text-center">
            No quiz attempts recorded yet. Take your first quiz!
          </p>
        )}
      </div>

      {/* Data Management & Reset */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-[32px] p-6 sm:p-8 border border-rose-200/80 dark:border-rose-900/40 space-y-4">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset Learning Progress</span>
        </div>

        <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed">
          Resetting will clear all level unlocks, high scores, active daily streaks, and unlocked badges. This action cannot be undone.
        </p>

        {!showConfirmReset ? (
          <button
            onClick={() => {
              if (soundEnabled) playClickSound();
              setShowConfirmReset(true);
            }}
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Progress</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (soundEnabled) playClickSound();
                onResetProgress();
                setShowConfirmReset(false);
              }}
              className="px-6 py-3 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => {
                if (soundEnabled) playClickSound();
                setShowConfirmReset(false);
              }}
              className="px-6 py-3 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 font-bold text-xs uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
