import React from 'react';

const RuleCard = ({ ruleData, onContinue }) => {
  if (!ruleData) return null;

  const handleCopyRule = async () => {
    const text = `【${ruleData.title}】\n${ruleData.explanation}\n规律：${ruleData.pattern}\n示例：${ruleData.examples.map(e => `${e.verb} → ${e.yo_form}`).join('、')}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('规律已复制到剪贴板！');
    } catch {
      // Fallback: do nothing on clipboard failure
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onContinue}
      />

      {/* Card */}
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-6 pb-8 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🧠</div>
          <h2 className="text-2xl font-extrabold text-gray-900">规律解锁！</h2>
          <p className="text-sm text-gray-500 mt-1">你已连续答对 5 题，掌握了这条规律</p>
        </div>

        {/* Rule Content */}
        <div className="bg-indigo-50 rounded-2xl p-4 mb-4 border border-indigo-100">
          <h3 className="text-base font-bold text-indigo-800 mb-2">{ruleData.title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{ruleData.explanation}</p>

          <div className="bg-white rounded-xl p-3 border border-indigo-50">
            <p className="text-sm font-mono font-bold text-indigo-700 mb-2">{ruleData.pattern}</p>
            <div className="space-y-1">
              {ruleData.examples.map((ex, i) => (
                <p key={i} className="text-sm text-gray-700">
                  {ex.verb} → <span className="font-bold text-indigo-600">{ex.yo_form}</span>
                  {ex.meaning && <span className="text-gray-400 ml-2">({ex.meaning})</span>}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Extended verbs */}
        {ruleData.extended_verbs && ruleData.extended_verbs.length > 0 && (
          <div className="mb-5">
            <p className="text-sm text-gray-600 mb-1">
              ✅ 学会这条规律，以下动词你也会了：
            </p>
            <p className="text-sm font-medium text-gray-800">
              {ruleData.extended_verbs.join(' / ')}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyRule}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 active:scale-[0.98] transition-all"
          >
            保存规律
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 shadow-md active:scale-[0.98] transition-all"
          >
            继续练习 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RuleCard;
