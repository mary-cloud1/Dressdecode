import React from 'react';
import { Target, BookOpen, Sparkles, Lightbulb, Trophy, User } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
}) => {
  const tabs = [
    { id: 'quizzes', label: 'Quiz Levels', icon: Target },
    { id: 'dictionary', label: 'Style Dictionary', icon: BookOpen },
    { id: 'trends', label: 'Trend Corner', icon: Sparkles },
    { id: 'tip', label: 'Daily Tip', icon: Lightbulb },
    { id: 'badges', label: 'Badges', icon: Trophy },
    { id: 'profile', label: 'Profile & Progress', icon: User },
  ];

  const handleTabClick = (id: string) => {
    if (soundEnabled) playClickSound();
    setActiveTab(id);
  };

  return (
    <nav className="bg-white/70 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 sticky top-16 sm:top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-3 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-100 dark:shadow-purple-900/40 translate-y-[-1px]'
                    : 'text-slate-500 dark:text-purple-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/50 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-purple-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
