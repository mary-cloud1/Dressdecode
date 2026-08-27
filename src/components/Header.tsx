import React from 'react';
import { Sparkles, Flame, Volume2, VolumeX, Moon, Sun, Award, ShieldCheck, Lock } from 'lucide-react';
import { UserProgress } from '../types';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  userProgress: UserProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProgress,
  activeTab,
  setActiveTab,
  toggleSound,
  toggleDarkMode,
}) => {
  const handleTabClick = (tab: string) => {
    if (userProgress.soundEnabled) playClickSound();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 dark:bg-purple-950/90 border-b border-purple-100/80 dark:border-purple-900/50 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleTabClick('quizzes')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-200 dark:shadow-purple-900/30 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-indigo-900 dark:from-purple-100 dark:to-indigo-200 font-serif">
                  Dress Decode
                </h1>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-700/50">
                  Fashion IQ
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-purple-400 font-medium hidden sm:block">
                Master Style, History & Wardrobe Secrets
              </p>
            </div>
          </div>

          {/* Level Progress Pills */}
          <div className="hidden md:flex items-center gap-2 bg-purple-50/80 dark:bg-purple-900/30 p-1.5 rounded-2xl border border-purple-100 dark:border-purple-800/40">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${userProgress.completedLevels.easy ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/40' : 'text-purple-700 dark:text-purple-300'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Easy</span>
              {userProgress.completedLevels.easy && <span className="text-[10px]">✓</span>}
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${userProgress.completedLevels.medium ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/40' : userProgress.completedLevels.easy ? 'text-purple-700 dark:text-purple-300' : 'text-purple-400 dark:text-purple-600'}`}>
              {!userProgress.completedLevels.easy ? <Lock className="w-3 h-3" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Medium</span>
              {userProgress.completedLevels.medium && <span className="text-[10px]">✓</span>}
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${userProgress.completedLevels.hard ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/40' : userProgress.completedLevels.medium ? 'text-purple-700 dark:text-purple-300' : 'text-purple-400 dark:text-purple-600'}`}>
              {!userProgress.completedLevels.medium ? <Lock className="w-3 h-3" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Hard</span>
              {userProgress.completedLevels.hard && <span className="text-[10px]">✓</span>}
            </div>
          </div>

          {/* Controls & Streak Badge */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 bg-orange-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-orange-100 dark:border-amber-800/50 shadow-xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="font-bold text-orange-700 dark:text-amber-400 text-xs sm:text-sm">
                {userProgress.streak.count} Day Streak
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-2xl text-slate-500 hover:bg-purple-50 dark:hover:bg-purple-900/60 hover:text-purple-700 dark:text-purple-300 transition-colors"
              title={userProgress.soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              aria-label="Toggle Sound"
            >
              {userProgress.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              ) : (
                <VolumeX className="w-5 h-5 text-purple-400 dark:text-purple-500" />
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-2xl text-slate-500 hover:bg-purple-50 dark:hover:bg-purple-900/60 hover:text-purple-700 dark:text-purple-300 transition-colors"
              title={userProgress.darkMode ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {userProgress.darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
