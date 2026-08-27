import React from 'react';
import { QuizResult, Question } from '../types';
import { X, CheckCircle2, XCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ReviewModalProps {
  result: QuizResult;
  questions: Question[];
  soundEnabled: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  result,
  questions,
  soundEnabled,
  onClose,
}) => {
  const getQuestionById = (id: string) => questions.find((q) => q.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-purple-950 rounded-[40px] p-6 sm:p-8 border border-purple-100 dark:border-purple-800 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-purple-800/60 shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              {result.difficulty.toUpperCase()} LEVEL REVIEW
            </span>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-purple-100">
              Quiz Answers Breakdown ({result.score}/{result.total})
            </h3>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) playClickSound();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Questions List */}
        <div className="overflow-y-auto space-y-6 py-6 pr-1 custom-scrollbar shrink">
          {result.answers.map((answer, index) => {
            const question = getQuestionById(answer.questionId);
            if (!question) return null;

            return (
              <div
                key={answer.questionId}
                className={`p-6 rounded-[28px] border ${
                  answer.isCorrect
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-100 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {question.category}
                    </span>
                  </div>

                  {answer.isCorrect ? (
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Correct</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-xs font-bold bg-rose-100 dark:bg-rose-900/40 px-3 py-1 rounded-full">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Incorrect</span>
                    </div>
                  )}
                </div>

                <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-purple-100 mb-4">
                  {question.question}
                </p>

                {/* Options List */}
                <div className="space-y-2 mb-4">
                  {question.options.map((opt, optIdx) => {
                    const isUserChoice = answer.selectedIndex === optIdx;
                    const isCorrectChoice = optIdx === question.correctIndex;

                    let optBg = 'bg-white/80 dark:bg-purple-900/30 text-slate-700 dark:text-purple-200 border-purple-100 dark:border-purple-800/40';

                    if (isCorrectChoice) {
                      optBg = 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border-emerald-400 dark:border-emerald-600 font-semibold';
                    } else if (isUserChoice && !isCorrectChoice) {
                      optBg = 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-600 font-semibold';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm border flex items-center justify-between ${optBg}`}
                      >
                        <span>{opt}</span>
                        {isCorrectChoice && <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">✓ Correct Answer</span>}
                        {isUserChoice && !isCorrectChoice && <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Your Selection</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-xs text-slate-700 dark:text-purple-200 leading-relaxed font-medium">
                  <strong className="text-slate-900 dark:text-purple-100">Explanation: </strong>
                  {question.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-purple-100 dark:border-purple-800/60 flex justify-end shrink-0">
          <button
            onClick={() => {
              if (soundEnabled) playClickSound();
              onClose();
            }}
            className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Review</span>
          </button>
        </div>

      </div>
    </div>
  );
};
