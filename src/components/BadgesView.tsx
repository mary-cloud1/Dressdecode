import React from 'react';
import { INITIAL_BADGES } from '../data/badges';
import { UserProgress } from '../types';
import { Sparkles, Trophy, Crown, Award, CheckCircle2, Flame, Zap, BookOpen, TrendingUp, Target, Lock } from 'lucide-react';

interface BadgesViewProps {
  userProgress: UserProgress;
}

export const BadgesView: React.FC<BadgesViewProps> = ({ userProgress }) => {
  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    Crown,
    Award,
    CheckCircle2,
    Flame,
    Zap,
    BookOpen,
    TrendingUp,
    Target,
  };

  const unlockedSet = new Set(userProgress.unlockedBadgeIds);

  const getBadgeProgress = (badgeId: string): { current: number; max: number } => {
    switch (badgeId) {
      case 'badge_easy_passed':
        return { current: userProgress.completedLevels.easy ? 1 : 0, max: 1 };
      case 'badge_medium_passed':
        return { current: userProgress.completedLevels.medium ? 1 : 0, max: 1 };
      case 'badge_hard_passed':
        return { current: userProgress.completedLevels.hard ? 1 : 0, max: 1 };
      case 'badge_perfect_score':
        const maxScore = Math.max(
          userProgress.bestScores.easy,
          userProgress.bestScores.medium,
          userProgress.bestScores.hard
        );
        return { current: maxScore === 20 ? 1 : 0, max: 1 };
      case 'badge_streak_3':
        return { current: Math.min(userProgress.streak.count, 3), max: 3 };
      case 'badge_streak_7':
        return { current: Math.min(userProgress.streak.count, 7), max: 7 };
      case 'badge_dict_explorer':
        return { current: Math.min(userProgress.favorites.termIds.length, 3), max: 3 };
      case 'badge_trend_spotter':
        return { current: Math.min(userProgress.favorites.trendIds.length, 2), max: 2 };
      case 'badge_total_50':
        return { current: Math.min(userProgress.totalQuestionsAnswered, 50), max: 50 };
      default:
        return { current: 0, max: 1 };
    }
  };

  const totalUnlocked = INITIAL_BADGES.filter((b) => unlockedSet.has(b.id)).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner */}
      <div className="rounded-[40px] bg-white dark:bg-purple-950/70 p-6 sm:p-10 shadow-xl shadow-purple-100 dark:shadow-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Achievements Gallery</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            Fashion Badges & <span className="text-purple-600 dark:text-purple-400">Milestones</span>
          </h2>
          <p className="text-slate-500 dark:text-purple-200 text-xs sm:text-sm leading-relaxed">
            Unlock achievements by passing quiz levels, maintaining active streaks, scoring 100%, and building your style dictionary collection.
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/40 p-5 rounded-3xl border border-purple-100 dark:border-purple-800 text-center shrink-0 min-w-[140px]">
          <span className="block text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            Unlocked
          </span>
          <span className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            {totalUnlocked} / {INITIAL_BADGES.length}
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_BADGES.map((badge) => {
          const isUnlocked = unlockedSet.has(badge.id);
          const IconComponent = iconMap[badge.icon] || Award;
          const { current, max } = getBadgeProgress(badge.id);
          const progressPercent = Math.round((current / max) * 100);

          return (
            <div
              key={badge.id}
              className={`rounded-[32px] p-6 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'bg-white dark:bg-purple-950/60 border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30'
                  : 'bg-slate-50/50 dark:bg-purple-950/20 border-slate-200/60 dark:border-purple-900/30 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-100'
                      : 'bg-slate-200 dark:bg-purple-900/40 text-slate-400 dark:text-purple-600'
                  }`}>
                    {isUnlocked ? (
                      <IconComponent className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    isUnlocked
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-purple-900/30 text-slate-500 dark:text-purple-500'
                  }`}>
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-purple-100 mb-1">
                  {badge.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-purple-300 leading-relaxed mb-4">
                  {badge.description}
                </p>
              </div>

              {/* Progress Bar inside badge */}
              <div className="space-y-1.5 pt-2 border-t border-purple-50 dark:border-purple-900/40">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-purple-400">
                  <span>Progress</span>
                  <span>{current} / {max}</span>
                </div>

                <div className="w-full bg-purple-100 dark:bg-purple-900/40 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isUnlocked ? 'bg-purple-600' : 'bg-slate-300 dark:bg-purple-800'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
