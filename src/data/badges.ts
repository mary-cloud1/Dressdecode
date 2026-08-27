import { Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_easy_passed',
    title: 'Style Apprentice',
    description: 'Complete and pass the Easy Level Quiz with 70% or higher.',
    icon: 'Sparkles',
    category: 'quiz',
    unlocked: false,
    progressMax: 1
  },
  {
    id: 'badge_medium_passed',
    title: 'Fashion Connoisseur',
    description: 'Unlock and pass the Medium Level Quiz.',
    icon: 'Crown',
    category: 'quiz',
    unlocked: false,
    progressMax: 1
  },
  {
    id: 'badge_hard_passed',
    title: 'Haute Couture Master',
    description: 'Conquer the Hard Level Quiz and decode ultimate fashion history!',
    icon: 'Award',
    category: 'quiz',
    unlocked: false,
    progressMax: 1
  },
  {
    id: 'badge_perfect_score',
    title: 'Flawless Stylist',
    description: 'Score 100% on any quiz level (20 out of 20 correct).',
    icon: 'CheckCircle2',
    category: 'quiz',
    unlocked: false,
    progressMax: 1
  },
  {
    id: 'badge_streak_3',
    title: 'Fashion Streak: 3 Days',
    description: 'Maintain a 3-day active daily streak.',
    icon: 'Flame',
    category: 'streak',
    unlocked: false,
    progressMax: 3
  },
  {
    id: 'badge_streak_7',
    title: 'Style Dedicated: 7 Days',
    description: 'Maintain a 7-day active daily streak.',
    icon: 'Zap',
    category: 'streak',
    unlocked: false,
    progressMax: 7
  },
  {
    id: 'badge_dict_explorer',
    title: 'Lexicon Scholar',
    description: 'Bookmark at least 3 terms in the Style Dictionary.',
    icon: 'BookOpen',
    category: 'learning',
    unlocked: false,
    progressMax: 3
  },
  {
    id: 'badge_trend_spotter',
    title: 'Trend Trendsetter',
    description: 'Explore and bookmark 2 modern or timeless fashion trends.',
    icon: 'TrendingUp',
    category: 'learning',
    unlocked: false,
    progressMax: 2
  },
  {
    id: 'badge_total_50',
    title: 'Century of Style',
    description: 'Answer 50 total questions across all quiz attempts.',
    icon: 'Target',
    category: 'mastery',
    unlocked: false,
    progressMax: 50
  }
];
