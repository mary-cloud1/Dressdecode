export type Difficulty = 'easy' | 'medium' | 'hard';

export type QuestionCategory =
  | 'Fashion Styles'
  | 'Clothing & Silhouettes'
  | 'Accessories & Footwear'
  | 'Color Coordination'
  | 'Body Shapes & Fit'
  | 'Fabrics & Textiles'
  | 'Fashion History'
  | 'Wardrobe Essentials'
  | 'Seasonal Fashion'
  | 'Fashion Trends'
  | 'Styling Tips'
  | 'Fashion Terminology';

export interface Question {
  id: string;
  difficulty: Difficulty;
  category: QuestionCategory;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
  proTip?: string;
}

export interface QuizResult {
  id: string;
  difficulty: Difficulty;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  timestamp: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
}

export interface StyleTerm {
  id: string;
  term: string;
  phonetic?: string;
  category: string;
  definition: string;
  example: string;
  tags: string[];
}

export interface Trend {
  id: string;
  title: string;
  period: string;
  type: 'timeless' | 'current' | 'retro';
  tagline: string;
  description: string;
  keyElements: string[];
  howToStyle: string;
  imageUrl?: string;
}

export interface DailyTip {
  id: string;
  title: string;
  category: QuestionCategory;
  summary: string;
  detailedAdvice: string;
  ruleOfThumb: string;
  season?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quiz' | 'streak' | 'learning' | 'mastery';
  unlocked: boolean;
  unlockedAt?: number;
  progressMax: number;
}

export interface UserProgress {
  completedLevels: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  bestScores: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  streak: {
    count: number;
    lastActiveDate: string; // YYYY-MM-DD
  };
  unlockedBadgeIds: string[];
  favorites: {
    termIds: string[];
    trendIds: string[];
    questionIds: string[];
    tipIds: string[];
  };
  soundEnabled: boolean;
  darkMode: boolean;
  history: QuizResult[];
}
