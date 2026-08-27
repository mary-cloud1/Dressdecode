import React, { useState } from 'react';
import { Lock, Sparkles, Trophy, CheckCircle, ShieldCheck, Play, Zap, HelpCircle } from 'lucide-react';
import { Difficulty, UserProgress, QuestionCategory } from '../types';
import { isLevelUnlocked } from '../utils/storage';
import { playClickSound } from '../utils/audio';

interface QuizLevelSelectorProps {
  userProgress: UserProgress;
  onSelectLevel: (level: Difficulty) => void;
  onStartPractice: (category?: QuestionCategory) => void;
}

export const QuizLevelSelector: React.FC<QuizLevelSelectorProps> = ({
  userProgress,
  onSelectLevel,
  onStartPractice,
}) => {
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<QuestionCategory | 'All'>('All');

  const categories: QuestionCategory[] = [
    'Fashion Styles',
    'Clothing & Silhouettes',
    'Accessories & Footwear',
    'Color Coordination',
    'Body Shapes & Fit',
    'Fabrics & Textiles',
    'Fashion History',
    'Wardrobe Essentials',
    'Seasonal Fashion',
    'Fashion Trends',
    'Styling Tips',
    'Fashion Terminology',
  ];

  const levels: {
    id: Difficulty;
    title: string;
    subtitle: string;
    questionsCount: number;
    description: string;
    badge: string;
    gradient: string;
  }[] = [
    {
      id: 'easy',
      title: 'Easy Level',
      subtitle: 'Style Foundations & Essentials',
      questionsCount: 20,
      description: 'Master basic silhouettes, fabric care, classic color combinations, and everyday styling rules.',
      badge: 'Level 1',
      gradient: 'from-purple-600 via-indigo-600 to-purple-700'
    },
    {
      id: 'medium',
      title: 'Medium Level',
      subtitle: 'Connoisseur & Industry Secrets',
      questionsCount: 20,
      description: 'Explore patternmaking terms, iconic designer history, body proportion rules, and textile weaves.',
      badge: 'Level 2',
      gradient: 'from-violet-700 via-purple-700 to-indigo-800'
    },
    {
      id: 'hard',
      title: 'Hard Level',
      subtitle: 'Haute Couture & Master Tailorship',
      questionsCount: 20,
      description: 'Challenge your expertise in rare garment construction, historic runway dates, and triadic color schemes.',
      badge: 'Level 3',
      gradient: 'from-purple-900 via-indigo-900 to-slate-900'
    }
  ];

  const handleLevelClick = (levelId: Difficulty) => {
    const unlocked = isLevelUnlocked(levelId, userProgress.completedLevels);
    if (!unlocked) return;
    if (userProgress.soundEnabled) playClickSound();
    onSelectLevel(levelId);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="bg-white dark:bg-purple-950/70 rounded-[40px] p-8 sm:p-10 shadow-xl shadow-purple-100 dark:shadow-purple-950/40 relative overflow-hidden border border-purple-100 dark:border-purple-900/40">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-4">
            Interactive Learning
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight font-serif">
            Fashion Essentials <span className="text-purple-600 dark:text-purple-400">Quiz</span>
          </h2>
          <p className="text-slate-500 dark:text-purple-200 text-sm sm:text-base leading-relaxed mb-8">
            Test your knowledge on the foundational items every wardrobe needs. Master the Easy level to unlock Medium challenges, then reach Hard level haute couture!
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/40 px-4 py-2 rounded-2xl text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Pass Score: 70% (14/20)</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/40 px-4 py-2 rounded-2xl text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Instant Pro Explanations</span>
            </div>
          </div>
        </div>

        {/* Decorative Ambient Blurs */}
        <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-60 blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-48 h-48 bg-indigo-50 dark:bg-indigo-950/30 rounded-full opacity-70 blur-2xl pointer-events-none" />
      </div>

      {/* Main 3 Level Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              Level Progression
            </h3>
            <p className="text-xs text-slate-500 dark:text-purple-300">
              Complete Easy to unlock Medium, and Medium to unlock Hard mode.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.id, userProgress.completedLevels);
            const passed = userProgress.completedLevels[lvl.id];
            const bestScore = userProgress.bestScores[lvl.id];

            return (
              <div
                key={lvl.id}
                onClick={() => handleLevelClick(lvl.id)}
                className={`relative group rounded-[32px] p-6 transition-all duration-300 flex flex-col justify-between ${
                  unlocked
                    ? 'cursor-pointer bg-white dark:bg-purple-950/60 border-2 border-purple-200 dark:border-purple-800/80 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl hover:shadow-purple-100/60 dark:hover:shadow-purple-900/20 hover:-translate-y-1'
                    : 'bg-slate-100/80 dark:bg-purple-950/20 border border-dashed border-slate-300 dark:border-purple-900/40 opacity-70'
                }`}
              >
                {/* Header Row inside card */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      unlocked ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {unlocked ? <Zap className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>

                    {passed ? (
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Passed ({bestScore}/20)</span>
                      </div>
                    ) : unlocked ? (
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        {bestScore > 0 ? `Best: ${bestScore}/20` : 'Unlocked'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-slate-900 dark:text-white text-lg">
                    {lvl.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-purple-400 mt-1 mb-3">
                    {lvl.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-purple-200 leading-relaxed mb-6">
                    {lvl.description}
                  </p>
                </div>

                {/* Footer Action Button inside card */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-purple-400 mb-4 font-medium">
                    <span>{lvl.questionsCount} Questions</span>
                    <span>Pass: 14+ correct</span>
                  </div>

                  {unlocked ? (
                    <button className="w-full py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-200 dark:shadow-purple-900/40 group-hover:scale-[1.02] transition-transform">
                      <Play className="w-4 h-4 fill-white" />
                      <span>{passed ? 'Retake Quiz' : 'Continue Quiz'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-3.5 px-4 rounded-2xl bg-slate-200/60 dark:bg-purple-900/20 text-slate-500 dark:text-purple-500 font-bold text-xs uppercase tracking-wider text-center border border-dashed border-slate-300 dark:border-purple-900/40">
                      {lvl.id === 'medium' ? 'Pass Easy Level First' : 'Pass Medium Level First'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline & Custom Practice Mode Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-950 text-white p-6 sm:p-8 rounded-[32px] shadow-lg shadow-indigo-100/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Custom Topic Practice</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold mb-2 leading-snug font-serif">
              Targeted Practice Session
            </h4>
            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed mb-5">
              Select any category to hone your styling knowledge without altering your level unlock score progression.
            </p>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedPracticeCategory('All')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedPracticeCategory === 'All'
                    ? 'bg-white text-purple-900 font-bold shadow-xs'
                    : 'bg-white/10 text-purple-100 hover:bg-white/20'
                }`}
              >
                All Topics
              </button>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedPracticeCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedPracticeCategory === cat
                      ? 'bg-white text-purple-900 font-bold shadow-xs'
                      : 'bg-white/10 text-purple-100 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                if (userProgress.soundEnabled) playClickSound();
                onStartPractice(selectedPracticeCategory === 'All' ? undefined : selectedPracticeCategory);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40 whitespace-nowrap transition-transform hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-purple-900" />
              <span>Start Practice Session</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
