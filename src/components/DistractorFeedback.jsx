import React, { useMemo } from 'react';

// 错误类型中文映射
const ERROR_TYPE_CN_MAP = {
  tense_confusion: '时态混淆',
  orthographic: '正字法变化遗漏',
  stem_change: '词干变音遗漏',
  person_confusion: '人称混用',
  accent_missing: '重音缺失',
  wrong_paradigm: '套用错误变位规则'
};

const DistractorFeedback = ({ question, userAnswer, onNext, onRetry }) => {
  if (!question) return null;

  // 根据用户实际输入动态匹配错误类型
  const errorInfo = useMemo(() => {
    const input = (userAnswer || '').trim().toLowerCase();
    const d1 = (question.distractor || '').toLowerCase();
    const d2 = (question.distractor_2 || '').toLowerCase();

    if (input === d1) {
      // 匹配第一干扰项
      return {
        typeCn: question.error_type_cn || ERROR_TYPE_CN_MAP[question.error_type] || '答案错误',
        explanation: question.distractor_error
      };
    } else if (d2 && input === d2) {
      // 匹配第二干扰项
      return {
        typeCn: ERROR_TYPE_CN_MAP[question.distractor_2_type] || '答案错误',
        explanation: question.distractor_2_error
      };
    } else {
      // 未匹配到已知干扰项，给出通用提示
      return {
        typeCn: null,
        explanation: null
      };
    }
  }, [userAnswer, question]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" onClick={onRetry} />

      {/* Card */}
      <div className="relative w-full max-w-md mx-auto bg-red-50/95 rounded-t-3xl shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.15)] animate-slide-up backdrop-blur-xl border-t border-white/50 flex flex-col" style={{ maxHeight: '70vh' }}>

        <div className="overflow-y-auto p-5 pb-3 flex-1">
          {/* 标题 */}
          <h3 className="text-xl font-bold text-red-700 mb-4">
            <button onClick={onRetry} className="hover:opacity-70 active:scale-90 transition-all cursor-pointer">✕</button>
            {' '}再想想
          </h3>

          {/* 时态提示 & 答案对比 */}
          <div className="bg-white/60 rounded-xl p-3 border border-white mb-4">
            <div className="mb-3">
              <span className="text-xs font-bold text-gray-500 bg-gray-100/80 px-2 py-1 rounded inline-block uppercase">
                时态: {question.blanks ? question.blanks.map(b => b.tense).join(' / ') : question.tense}
              </span>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-gray-500 block">你填的</span>
                <span className="text-lg font-bold text-red-500 line-through">{userAnswer}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">正确答案</span>
                <span className="text-lg font-bold text-green-700">{question.answer || (question.blanks && question.blanks.map(b => b.answer).join(' / '))}</span>
              </div>
            </div>
          </div>

          {/* 错误类型（动态匹配） */}
          {errorInfo.typeCn && (
            <div className="bg-white/70 rounded-xl p-3 border border-red-100 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">🔍</span>
                <span className="text-sm font-bold text-red-700">错误类型：{errorInfo.typeCn}</span>
              </div>
              {errorInfo.explanation && (
                <p className="text-sm text-gray-700 leading-relaxed">{errorInfo.explanation}</p>
              )}
            </div>
          )}

          {/* 同类动词 */}
          {question.similar_verbs && question.similar_verbs.length > 0 && (
            <div className="bg-white/70 rounded-xl p-3 border border-orange-100 mb-3">
              <p className="text-sm font-bold text-orange-700 mb-2">⚠ 同类动词，规律一样：</p>
              <div className="space-y-1">
                {question.similar_verbs.slice(0, 3).map((sv, i) => (
                  <p key={i} className="text-sm text-gray-700 font-mono">
                    {sv.verb} → <span className="font-bold">{sv.yo_form}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* 口诀 */}
          <div className="bg-white/70 rounded-xl p-3 border border-blue-100">
            <p className="text-sm text-blue-800">
              📌 <span className="font-semibold">口诀：</span>{question.rule}
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-5 pb-8 pt-3 shrink-0">
          <button
            onClick={onNext}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200 active:scale-[0.98] transition-all"
          >
            下一题 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistractorFeedback;
