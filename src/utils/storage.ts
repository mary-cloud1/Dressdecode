import { UserProgress, QuizResult, Difficulty } from '../types';
import { INITIAL_BADGES } from '../data/badges';

const STORAGE_KEY = 'dress_decode_user_progress_v1';

export function getDefaultUserProgress(): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  return {
    completedLevels: {
      easy: false,
      medium: false,
      hard: false
    },
    bestScores: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    totalQuizzesTaken: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    streak: {
      count: 1,
      lastActiveDate: today
    },
    unlockedBadgeIds: [],
    favorites: {
      termIds: [],
      trendIds: [],
      questionIds: [],
      tipIds: []
    },
    soundEnabled: true,
    darkMode: false,
    history: []
  };
}

export function loadUserProgress(): UserProgress {
  if (typeof window === 'undefined') return getDefaultUserProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultUserProgress();
      saveUserProgress(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as UserProgress;
    
    // Check and update streak on load
    const updated = checkAndUpdateStreak(parsed);
    if (updated !== parsed) {
      saveUserProgress(updated);
    }
    return updated;
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return getDefaultUserProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    // Audit badges
    const audited = checkBadges(progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audited));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

export function recordQuizResult(result: QuizResult, currentProgress: UserProgress): { updatedProgress: UserProgress; newBadges: string[] } {
  const prevBadgeIds = new Set(currentProgress.unlockedBadgeIds);
  const newCompletedLevels = { ...currentProgress.completedLevels };
  const newBestScores = { ...currentProgress.bestScores };

  if (result.passed) {
    newCompletedLevels[result.difficulty] = true;
  }
  if (result.score > newBestScores[result.difficulty]) {
    newBestScores[result.difficulty] = result.score;
  }

  const updatedProgress: UserProgress = {
    ...currentProgress,
    completedLevels: newCompletedLevels,
    bestScores: newBestScores,
    totalQuizzesTaken: currentProgress.totalQuizzesTaken + 1,
    totalQuestionsAnswered: currentProgress.totalQuestionsAnswered + result.total,
    totalCorrectAnswers: currentProgress.totalCorrectAnswers + result.score,
    history: [result, ...currentProgress.history.slice(0, 19)]
  };

  const finalProgress = checkBadges(updatedProgress);
  saveUserProgress(finalProgress);

  const newBadgeIds = finalProgress.unlockedBadgeIds.filter(id => !prevBadgeIds.has(id));

  return { updatedProgress: finalProgress, newBadges: newBadgeIds };
}

function checkAndUpdateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const lastDateStr = progress.streak.lastActiveDate;

  if (lastDateStr === today) {
    return progress;
  }

  const lastDate = new Date(lastDateStr);
  const currentDate = new Date(today);
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let newCount = progress.streak.count;
  if (diffDays === 1) {
    newCount += 1;
  } else if (diffDays > 1) {
    newCount = 1;
  }

  return {
    ...progress,
    streak: {
      count: newCount,
      lastActiveDate: today
    }
  };
}

export function checkBadges(progress: UserProgress): UserProgress {
  const unlocked = new Set(progress.unlockedBadgeIds);

  if (progress.completedLevels.easy) unlocked.add('badge_easy_passed');
  if (progress.completedLevels.medium) unlocked.add('badge_medium_passed');
  if (progress.completedLevels.hard) unlocked.add('badge_hard_passed');

  if (
    progress.bestScores.easy === 20 ||
    progress.bestScores.medium === 20 ||
    progress.bestScores.hard === 20
  ) {
    unlocked.add('badge_perfect_score');
  }

  if (progress.streak.count >= 3) unlocked.add('badge_streak_3');
  if (progress.streak.count >= 7) unlocked.add('badge_streak_7');

  if (progress.favorites.termIds.length >= 3) unlocked.add('badge_dict_explorer');
  if (progress.favorites.trendIds.length >= 2) unlocked.add('badge_trend_spotter');

  if (progress.totalQuestionsAnswered >= 50) unlocked.add('badge_total_50');

  return {
    ...progress,
    unlockedBadgeIds: Array.from(unlocked)
  };
}

export function isLevelUnlocked(level: Difficulty, completedLevels: UserProgress['completedLevels']): boolean {
  if (level === 'easy') return true;
  if (level === 'medium') return completedLevels.easy;
  if (level === 'hard') return completedLevels.medium;
  return false;
}
