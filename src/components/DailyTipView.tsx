import React, { useState, useEffect } from 'react';
import { DAILY_TIPS } from '../data/dailyTips';
import { Lightbulb, Bookmark, Sparkles, Shuffle, Volume2, VolumeX } from 'lucide-react';
import { playClickSound, speakText, stopSpeech } from '../utils/audio';

interface DailyTipViewProps {
  favoriteTipIds: string[];
  onToggleFavoriteTip: (tipId: string) => void;
  soundEnabled: boolean;
}

export const DailyTipView: React.FC<DailyTipViewProps> = ({
  favoriteTipIds,
  onToggleFavoriteTip,
  soundEnabled,
}) => {
  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);

  const currentTip = DAILY_TIPS[activeTipIndex];
  const isFav = favoriteTipIds.includes(currentTip.id);

  useEffect(() => {
    stopSpeech();
    setIsPlayingSpeech(false);
  }, [activeTipIndex]);

  const handleSpeakTip = () => {
    if (isPlayingSpeech) {
      stopSpeech();
      setIsPlayingSpeech(false);
    } else {
      setIsPlayingSpeech(true);
      const textToSpeak = `Daily Fashion Tip: ${currentTip.title}. ${currentTip.summary}. ${currentTip.detailedAdvice}. Golden Rule: ${currentTip.ruleOfThumb}`;
      speakText(textToSpeak, () => {
        setIsPlayingSpeech(false);
      });
    }
  };

  const handleNextTip = () => {
    stopSpeech();
    setIsPlayingSpeech(false);
    if (soundEnabled) playClickSound();
    setActiveTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      
      {/* Featured Header Card */}
      <div className="rounded-[40px] bg-white dark:bg-purple-950/70 p-6 sm:p-8 text-slate-800 dark:text-purple-100 shadow-xl shadow-purple-100 dark:shadow-purple-950/40 border border-purple-100 dark:border-purple-900/40 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Daily Style Advice</span>
          </span>

          <span className="text-xs font-semibold text-slate-400 dark:text-purple-400">
            Tip {activeTipIndex + 1} of {DAILY_TIPS.length}
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Daily Fashion Tip & Formula
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-200 leading-relaxed mt-1">
            Practical styling guidance updated daily to elevate your wardrobe proportions, color harmony, and textile care.
          </p>
        </div>
      </div>

      {/* Main Tip Card */}
      <div className="bg-white dark:bg-purple-950/60 rounded-[32px] p-6 sm:p-8 border border-purple-100 dark:border-purple-800/60 shadow-sm shadow-purple-100 dark:shadow-purple-950/30 space-y-6">
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {currentTip.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-purple-100">
              {currentTip.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakTip}
              className={`p-2.5 rounded-2xl transition-colors ${
                isPlayingSpeech
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100'
              }`}
              title={isPlayingSpeech ? 'Stop Voiceover' : 'Listen to Voiceover'}
            >
              {isPlayingSpeech ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                if (soundEnabled) playClickSound();
                onToggleFavoriteTip(currentTip.id);
              }}
              className={`p-2.5 rounded-2xl transition-colors ${
                isFav
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : 'bg-purple-50 dark:bg-purple-900/30 text-purple-400 hover:text-purple-700 dark:hover:text-purple-200'
              }`}
              title={isFav ? 'Remove from Saved' : 'Save Tip'}
            >
              <Bookmark className={`w-5 h-5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Summary Pill */}
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-slate-700 dark:text-purple-200 text-xs sm:text-sm font-semibold leading-relaxed border border-purple-100 dark:border-purple-800/50">
          "{currentTip.summary}"
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Why It Works & How To Apply
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-100 leading-relaxed font-medium">
            {currentTip.detailedAdvice}
          </p>
        </div>

        {/* Golden Rule of Thumb Box */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-0.5">
              Golden Rule of Thumb
            </span>
            <p className="text-xs sm:text-sm text-slate-900 dark:text-amber-100 font-semibold">
              {currentTip.ruleOfThumb}
            </p>
          </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-500 dark:text-purple-400 font-medium">
          Saved Tips: {favoriteTipIds.length}
        </div>

        <button
          onClick={handleNextTip}
          className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-purple-100 dark:shadow-purple-950/50 transition-all"
        >
          <Shuffle className="w-4 h-4" />
          <span>Next Styling Tip</span>
        </button>
      </div>

    </div>
  );
};
