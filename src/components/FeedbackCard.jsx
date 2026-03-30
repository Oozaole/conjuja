import React from 'react';

const FeedbackCard = ({ status, correctWord, rule, distractorError, tense, onNext }) => {
  if (status === 'idle' || status === 'typing') return null;

  const isCorrect = status === 'correct';
  const isWarning = status === 'warning';
  const isError = status === 'error';

  let bgColor = 'bg-white';
  let icon = null;
  let titleColor = '';
  let titleText = '';

  if (isCorrect) {
    bgColor = 'bg-green-50/95';
    titleColor = 'text-green-700';
    titleText = '¡Perfecto! 完全正确';
  } else if (isWarning) {
    bgColor = 'bg-yellow-50/95';
    titleColor = 'text-yellow-700';
    titleText = '¡Cuidado! 注意重音符号';
  } else if (isError) {
    bgColor = 'bg-red-50/95';
    titleColor = 'text-red-700';
    titleText = '¡Uf! 答错了';
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end">
      {/* Backdrop for mobile */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] opacity-100 transition-opacity pointer-events-auto" onClick={onNext} />
      
      <div className={`relative pointer-events-auto w-full max-w-md mx-auto ${bgColor} rounded-t-3xl shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.15)] p-5 pb-8 animate-slide-up backdrop-blur-xl border-t border-white/50`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xl font-bold ${titleColor} flex items-center gap-2`}>
            {titleText}
          </h3>
          {tense && (
            <span className={`text-xs font-bold ${titleColor} uppercase bg-white/50 shadow-sm px-2 py-1 rounded-md text-right max-w-[50%] leading-tight`}>
              {tense}
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {(isWarning || isError) && (
            <div className="bg-white/60 rounded-xl p-3 border border-white">
              <span className="text-sm text-gray-500 block mb-1">正确答案：</span>
              <span className="text-xl font-bold text-gray-900">{correctWord}</span>
            </div>
          )}

          <div className="text-gray-700 text-sm leading-relaxed p-1">
            <span className="font-semibold block mb-1">【规律口诀】</span>
            <span className="block">{rule}</span>
            
            {isError && distractorError && (
              <span className="block mt-2 text-red-600/90 text-xs bg-red-100/50 p-2 rounded-lg">
                解析：{distractorError}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onNext}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-sm active:scale-[0.98] transition-all
            ${isCorrect ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : ''}
            ${isWarning ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200' : ''}
            ${isError ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : ''}
          `}
        >
          继续 {'>'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackCard;
