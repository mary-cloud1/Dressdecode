import React, { useState } from 'react';
import { STYLE_DICTIONARY } from '../data/dictionary';
import { Search, Bookmark, Volume2, Sparkles, Tag, BookOpen } from 'lucide-react';
import { playClickSound, speakText, stopSpeech } from '../utils/audio';

interface StyleDictionaryViewProps {
  favoriteTermIds: string[];
  onToggleFavoriteTerm: (termId: string) => void;
  soundEnabled: boolean;
}

export const StyleDictionaryView: React.FC<StyleDictionaryViewProps> = ({
  favoriteTermIds,
  onToggleFavoriteTerm,
  soundEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [speakingTermId, setSpeakingTermId] = useState<string | null>(null);

  const categories = [
    'All',
    'Couture & Craftsmanship',
    'Styling & Essentials',
    'Fabrics & Textiles',
    'Garment Details',
    'Industry & Retail',
    'Color Theory'
  ];

  const filteredTerms = STYLE_DICTIONARY.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || term.category === selectedCategory;

    const matchesFavorite = !onlyFavorites || favoriteTermIds.includes(term.id);

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  const handleSpeakTerm = (term: typeof STYLE_DICTIONARY[0]) => {
    if (speakingTermId === term.id) {
      stopSpeech();
      setSpeakingTermId(null);
    } else {
      setSpeakingTermId(term.id);
      const speechContent = `${term.term}. ${term.phonetic ? 'Pronounced ' + term.phonetic + '.' : ''} Definition: ${term.definition}. Styling Example: ${term.example}`;
      speakText(speechContent, () => {
        setSpeakingTermId(null);
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-[40px] bg-white dark:bg-purple-950/70 p-6 sm:p-10 shadow-xl shadow-purple-100 dark:shadow-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Style Lexicon</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-serif">
            Fashion Style <span className="text-purple-600 dark:text-purple-400">Dictionary</span>
          </h2>
          <p className="text-slate-500 dark:text-purple-200 text-xs sm:text-sm leading-relaxed">
            Master essential fashion terminology, pronunciation guides, and high-fashion editorial styling rules.
          </p>
        </div>
      </div>

      {/* Controls: Search Bar & Category Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search styles, trends, or terms..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/60 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-purple-400 focus:outline-hidden text-slate-800 dark:text-purple-100"
            />
          </div>

          {/* Only Favorites Filter Button */}
          <button
            onClick={() => {
              if (soundEnabled) playClickSound();
              setOnlyFavorites(!onlyFavorites);
            }}
            className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border ${
              onlyFavorites
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-white dark:bg-purple-950/60 text-slate-700 dark:text-purple-300 border-purple-100 dark:border-purple-800 hover:bg-purple-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${onlyFavorites ? 'fill-amber-500' : ''}`} />
            <span>Saved ({favoriteTermIds.length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                if (soundEnabled) playClickSound();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-100 dark:shadow-purple-950/40'
                  : 'bg-white dark:bg-purple-950/40 text-slate-600 dark:text-purple-200 border border-purple-100 dark:border-purple-800/60 hover:bg-purple-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      {filteredTerms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((item) => {
            const isFav = favoriteTermIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-purple-950/60 rounded-[32px] p-6 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-purple-100">
                          {item.term}
                        </h3>
                        <button
                          onClick={() => handleSpeakTerm(item)}
                          className={`p-1.5 rounded-xl transition-colors ${
                            speakingTermId === item.id
                              ? 'bg-purple-600 text-white'
                              : 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                          }`}
                          title={speakingTermId === item.id ? 'Stop Voiceover' : 'Listen Pronunciation & Definition (Voiceover)'}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.phonetic && (
                        <span className="text-xs text-purple-500 dark:text-purple-400 font-mono italic">
                          /{item.phonetic}/
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (soundEnabled) playClickSound();
                        onToggleFavoriteTerm(item.id);
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

                  <span className="inline-block px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-3 border border-purple-100 dark:border-purple-800">
                    {item.category}
                  </span>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-100 leading-relaxed mb-3">
                    {item.definition}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-900/20 text-xs text-slate-700 dark:text-purple-300 italic">
                    <strong className="not-italic text-slate-900 dark:text-purple-200 font-bold">Example: </strong>
                    "{item.example}"
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-purple-50 dark:border-purple-900/40">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold text-slate-500 dark:text-purple-400 flex items-center gap-1 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-full"
                    >
                      <Tag className="w-2.5 h-2.5 text-purple-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-purple-950/40 rounded-3xl border border-purple-200 dark:border-purple-800 space-y-3">
          <BookOpen className="w-12 h-12 text-purple-300 mx-auto" />
          <h4 className="text-lg font-bold text-purple-950 dark:text-purple-100 font-serif">
            No terms found
          </h4>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Try adjusting your search query or clearing category filters.
          </p>
        </div>
      )}

    </div>
  );
};
