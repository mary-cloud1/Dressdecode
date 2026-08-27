import React, { useState } from 'react';
import { TRENDS } from '../data/trends';
import { Sparkles, Bookmark, CheckCircle2, Flame, Search, Layers } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface TrendCornerViewProps {
  favoriteTrendIds: string[];
  onToggleFavoriteTrend: (trendId: string) => void;
  soundEnabled: boolean;
}

export const TrendCornerView: React.FC<TrendCornerViewProps> = ({
  favoriteTrendIds,
  onToggleFavoriteTrend,
  soundEnabled,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrends = TRENDS.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.howToStyle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner */}
      <div className="rounded-[40px] bg-white dark:bg-purple-950/70 p-6 sm:p-10 shadow-xl shadow-purple-100 dark:shadow-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Style Forecasting</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            The Trend <span className="text-purple-600 dark:text-purple-400">Corner</span>
          </h2>
          <p className="text-slate-500 dark:text-purple-200 text-xs sm:text-sm leading-relaxed">
            Discover timeless style movements, retro icons, and contemporary fashion trends with actionable styling formulas.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trends (e.g., Quiet Luxury, Y2K, Power Suit)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/60 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-purple-400 focus:outline-hidden text-slate-800 dark:text-purple-100"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-white dark:bg-purple-950/60 p-1.5 rounded-2xl border border-purple-100 dark:border-purple-800/60 shadow-sm">
          {[
            { id: 'all', label: 'All Trends' },
            { id: 'current', label: 'Current' },
            { id: 'timeless', label: 'Timeless' },
            { id: 'retro', label: 'Retro' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (soundEnabled) playClickSound();
                setFilterType(tab.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrends.map((trend) => {
          const isFav = favoriteTrendIds.includes(trend.id);

          return (
            <div
              key={trend.id}
              className="bg-white dark:bg-purple-950/60 rounded-[32px] p-6 sm:p-7 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        trend.type === 'current'
                          ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                          : trend.type === 'timeless'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      }`}>
                        {trend.type}
                      </span>
                      <span className="text-xs font-medium text-slate-400 dark:text-purple-400">
                        {trend.period}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-purple-100">
                      {trend.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      if (soundEnabled) playClickSound();
                      onToggleFavoriteTrend(trend.id);
                    }}
                    className={`p-2 rounded-xl transition-colors ${
                      isFav
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-purple-50 dark:bg-purple-900/30 text-purple-400 hover:text-purple-700 dark:hover:text-purple-200'
                    }`}
                    title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                <p className="text-xs font-semibold text-purple-600 dark:text-purple-300 italic">
                  "{trend.tagline}"
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-100 leading-relaxed">
                  {trend.description}
                </p>

                {/* Key Elements Checklist */}
                <div className="space-y-2 pt-2">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Key Wardrobe Building Blocks
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {trend.keyElements.map((elem, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-purple-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span>{elem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* How to Style Formula */}
              <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/40">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                  How to Style It
                </span>
                <p className="text-xs text-slate-700 dark:text-purple-100 leading-relaxed font-medium">
                  {trend.howToStyle}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
