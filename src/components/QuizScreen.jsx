import React, { useState, useRef, useEffect } from 'react';
import { questionsBank, trainingPacks } from '../data/questions';
import SpecialKeyboard from './SpecialKeyboard';
import FeedbackCard from './FeedbackCard';
import DistractorFeedback from './DistractorFeedback';
import RuleCard from './RuleCard';
import { useRuleProgress } from '../hooks/useRuleProgress';

const themeStyles = {
  indigo: { bg: 'bg-indigo-500', bgDark: 'bg-indigo-600', bgLight: 'bg-indigo-100', text: 'text-indigo-600', caret: 'caret-indigo-500' },
  blue: { bg: 'bg-blue-500', bgDark: 'bg-blue-600', bgLight: 'bg-blue-100', text: 'text-blue-600', caret: 'caret-blue-500' },
  teal: { bg: 'bg-teal-500', bgDark: 'bg-teal-600', bgLight: 'bg-teal-100', text: 'text-teal-600', caret: 'caret-teal-500' }
};

const ROUND_SIZE = 15; // 每轮随机抽取题数

function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const QuizScreen = ({ packId, onBack }) => {
  const packInfo = trainingPacks.find(p => p.id === packId);
  const theme = packInfo ? packInfo.theme : 'indigo';
  const styles = themeStyles[theme] || themeStyles.indigo;
  const allQuestions = questionsBank[packId] || [];

  const [roundQuestions, setRoundQuestions] = useState(() => shuffleAndPick(allQuestions, ROUND_SIZE));
  const [roundNum, setRoundNum] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('typing');
  const [streak, setStreak] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctCount, setCorrectCount] = useState(0);

  // 多空题状态
  const [multiInputs, setMultiInputs] = useState([]);
  const [activeBlankIdx, setActiveBlankIdx] = useState(0);
  const multiRefs = useRef([]);

  const { onCorrect, onError, getRuleCard } = useRuleProgress();
  const [activeRuleTag, setActiveRuleTag] = useState(null);

  const inputRef = useRef(null);

  const isFinished = currentIndex >= roundQuestions.length;
  const currentQuestion = roundQuestions[currentIndex];
  const isMultiBlank = currentQuestion?.blanks && currentQuestion.blanks.length > 1;

  // 切题时初始化多空输入
  useEffect(() => {
    if (currentQuestion?.blanks) {
      setMultiInputs(currentQuestion.blanks.map(() => ''));
      setActiveBlankIdx(0);
    }
  }, [currentIndex, roundNum]);

  const startNewRound = () => {
    setRoundQuestions(shuffleAndPick(allQuestions, ROUND_SIZE));
    setRoundNum(r => r + 1);
    setCurrentIndex(0);
    setInputValue('');
    setUserAnswer('');
    setMultiInputs([]);
    setActiveBlankIdx(0);
    setStatus('typing');
    setStreak(0);
    setCorrectCount(0);
    setActiveRuleTag(null);
  };

  useEffect(() => {
    if (status === 'typing' && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [currentIndex, status]);

  const handleCharInsert = (char) => {
    if (status !== 'typing') return;
    if (isMultiBlank) {
      const ref = multiRefs.current[activeBlankIdx];
      if (ref) {
        const start = ref.selectionStart;
        const end = ref.selectionEnd;
        const text = multiInputs[activeBlankIdx] || '';
        const newText = text.substring(0, start) + char + text.substring(end);
        setMultiInputs(prev => prev.map((v, i) => i === activeBlankIdx ? newText : v));
        setTimeout(() => { ref.setSelectionRange(start + 1, start + 1); ref.focus(); }, 0);
      }
    } else if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const text = inputValue;
      const newText = text.substring(0, start) + char + text.substring(end);
      setInputValue(newText);
      setTimeout(() => { inputRef.current.setSelectionRange(start + 1, start + 1); inputRef.current.focus(); }, 0);
    } else {
      setInputValue(prev => prev + char);
    }
  };

  const checkAnswer = () => {
    if (isMultiBlank) {
      // 多空题判定
      if (multiInputs.some(v => !v.trim()) || status !== 'typing') return;
      const blanks = currentQuestion.blanks;
      const allExact = blanks.every((b, i) => multiInputs[i].trim().toLowerCase() === b.answer.toLowerCase());
      const allNoAccent = blanks.every((b, i) => multiInputs[i].trim().toLowerCase() === b.answer_no_accent.toLowerCase());
      setUserAnswer(multiInputs.join(' / '));

      if (allExact) {
        setStatus('correct');
        setStreak(s => s + 1);
        setCorrectCount(c => c + 1);
        const triggeredTag = onCorrect(currentQuestion);
        if (triggeredTag) setActiveRuleTag(triggeredTag);
      } else if (allNoAccent) {
        setStatus('warning');
      } else {
        setStatus('error');
        setStreak(0);
        onError(currentQuestion);
      }
    } else {
      // 单空题判定（原逻辑）
      if (!inputValue.trim() || status !== 'typing') return;
      const userAns = inputValue.trim().toLowerCase();
      const exactAns = currentQuestion.answer.toLowerCase();
      const noAccentAns = currentQuestion.answer_no_accent.toLowerCase();
      setUserAnswer(inputValue.trim());

      if (userAns === exactAns) {
        setStatus('correct');
        setStreak(s => s + 1);
        setCorrectCount(c => c + 1);
        const triggeredTag = onCorrect(currentQuestion);
        if (triggeredTag) setActiveRuleTag(triggeredTag);
      } else if (userAns === noAccentAns) {
        setStatus('warning');
      } else {
        setStatus('error');
        setStreak(0);
        onError(currentQuestion);
      }
    }
    if (inputRef.current) inputRef.current.blur();
    multiRefs.current.forEach(r => r && r.blur());
  };

  // 关闭错误反馈卡片，重新作答当前题目
  const handleRetry = () => {
    setInputValue('');
    setUserAnswer('');
    setMultiInputs(currentQuestion?.blanks ? currentQuestion.blanks.map(() => '') : []);
    setActiveBlankIdx(0);
    setStatus('typing');
  };

  const handleNext = () => {
    // If a rule card is pending, show it before advancing
    if (activeRuleTag && status !== 'rule_card') {
      // Show the rule card overlay
      setStatus('rule_card');
      return;
    }
    setInputValue('');
    setUserAnswer('');
    setStatus('typing');
    setActiveRuleTag(null);
    setCurrentIndex(i => i + 1);
  };

  const handleRuleCardDismiss = () => {
    setInputValue('');
    setUserAnswer('');
    setStatus('typing');
    setActiveRuleTag(null);
    setCurrentIndex(i => i + 1);
  };

  // Finished screen
  if (isFinished) {
    const accuracy = roundQuestions.length > 0 ? Math.round((correctCount / roundQuestions.length) * 100) : 0;
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white h-[100dvh]">
        <div className={`w-20 h-20 ${styles.bgLight} ${styles.text} rounded-full flex items-center justify-center mb-6`}>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">第 {roundNum} 轮完成！</h2>
        <div className="text-gray-500 mb-8 text-center space-y-3">
          <p className="text-sm text-gray-400">本轮从 {allQuestions.length} 题中随机抽取了 {roundQuestions.length} 题</p>
          <div className="flex gap-4 justify-center">
            <span className="bg-green-50 px-4 py-2 rounded-lg font-medium text-green-700">✅ 正确率 {accuracy}%</span>
            <span className="bg-gray-50 px-4 py-2 rounded-lg font-medium text-gray-700">🔥 最高连击 {streak}</span>
          </div>
        </div>
        <div className="w-full space-y-3">
          <button
            onClick={startNewRound}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white ${styles.bg} shadow-md active:scale-95 transition-all`}
          >
            🔄 开始新一轮（随机 {ROUND_SIZE} 题）
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-xl font-bold text-lg text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const sentenceParts = currentQuestion.sentence.split('_____');

  // 渲染句子（支持多空）
  const renderSentence = () => {
    return sentenceParts.map((part, i) => (
      <React.Fragment key={i}>
        {part}
        {i < sentenceParts.length - 1 && (
          <span className={`inline-block mx-1 min-w-[3rem] border-b-2 ${
            isMultiBlank && i === activeBlankIdx ? 'border-blue-400' : 'border-gray-300'
          }`}>
            {isMultiBlank && (
              <span className="text-xs text-gray-400 font-normal">#{i + 1}</span>
            )}
          </span>
        )}
      </React.Fragment>
    ));
  };

  // 渲染标签：单空显示 verb+person；多空显示每个 blank 的 verb(person)
  const renderTags = () => {
    if (isMultiBlank) {
      return currentQuestion.blanks.map((b, i) => (
        <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
          i === activeBlankIdx ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          #{i + 1} {b.verb}（{b.person}）
        </span>
      ));
    }
    return (
      <>
        <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
          变位词：{currentQuestion.verb}
        </span>
        <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
          人称：{currentQuestion.person}
        </span>
      </>
    );
  };

  const canSubmit = isMultiBlank
    ? multiInputs.every(v => v.trim()) && status === 'typing'
    : inputValue.trim() && status === 'typing';

  return (
    <div className="flex-1 flex flex-col h-[100dvh]">
      {/* Header & Progress */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm z-10 shrink-0">
        <button onClick={onBack} className="text-gray-400 p-2 -ml-2 hover:bg-gray-50 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 px-4">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${styles.bg} transition-all duration-300`}
              style={{ width: `${Math.min(((currentIndex) / roundQuestions.length) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="text-sm font-bold text-gray-400">
          连续🔥 <span className={styles.text}>{streak}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 relative overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 leading-snug mt-2 mb-4 break-words">
            {renderSentence()}
          </h2>
          <p className="text-gray-500 text-sm">{currentQuestion.translation}</p>
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {renderTags()}
          </div>
        </div>

        {/* Input area */}
        <form
          className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100"
          onSubmit={(e) => { e.preventDefault(); checkAnswer(); }}
        >
          {isMultiBlank ? (
            <div className="space-y-2 p-2">
              {currentQuestion.blanks.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === activeBlankIdx ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>#{i + 1}</span>
                  <input
                    ref={el => multiRefs.current[i] = el}
                    type="text"
                    className={`flex-1 bg-gray-50 px-4 py-3 rounded-xl text-lg font-bold text-gray-900 outline-none border-2 transition-all ${
                      i === activeBlankIdx ? 'border-blue-300 bg-blue-50/30' : 'border-transparent'
                    } ${styles.caret} placeholder-gray-300`}
                    placeholder={`${b.verb} (${b.person})...`}
                    value={multiInputs[i] || ''}
                    onChange={(e) => setMultiInputs(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                    onFocus={() => setActiveBlankIdx(i)}
                    disabled={status !== 'typing'}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    autoComplete="off"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full py-3 rounded-xl font-bold text-lg transition-all mt-2 ${
                  canSubmit ? `${styles.bgDark} text-white shadow-md active:scale-95` : 'bg-gray-100 text-gray-400'
                }`}
              >
                确认提交
              </button>
            </div>
          ) : (
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                className={`flex-1 bg-transparent px-4 py-3 text-xl font-bold text-gray-900 outline-none ${styles.caret} placeholder-gray-300`}
                placeholder="Escribe aquí..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={status !== 'typing'}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  canSubmit ? `${styles.bgDark} text-white shadow-md active:scale-95` : 'bg-gray-100 text-gray-400'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          )}
        </form>

        {status === 'typing' && (
          <SpecialKeyboard onInsert={handleCharInsert} />
        )}
      </div>

      {/* Feature 4: Error → DistractorFeedback; Correct/Warning → FeedbackCard */}
      {status === 'error' && (
        <DistractorFeedback
          question={currentQuestion}
          userAnswer={userAnswer}
          onNext={handleNext}
          onRetry={handleRetry}
        />
      )}

      {(status === 'correct' || status === 'warning') && (
        <FeedbackCard
          status={status}
          correctWord={isMultiBlank ? currentQuestion.blanks.map(b => b.answer).join(' / ') : currentQuestion.answer}
          rule={currentQuestion.rule}
          distractorError={currentQuestion.distractor_error}
          streak={streak}
          tense={isMultiBlank ? currentQuestion.blanks.map(b => b.tense).join(' / ') : currentQuestion.tense}
          onNext={handleNext}
        />
      )}

      {/* Feature 6: Rule Card overlay */}
      {status === 'rule_card' && activeRuleTag && (
        <RuleCard
          ruleData={getRuleCard(activeRuleTag)}
          onContinue={handleRuleCardDismiss}
        />
      )}
    </div>
  );
};

export default QuizScreen;
