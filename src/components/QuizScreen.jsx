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

const QuizScreen = ({ packId, onBack }) => {
  const packInfo = trainingPacks.find(p => p.id === packId);
  const theme = packInfo ? packInfo.theme : 'indigo';
  const styles = themeStyles[theme] || themeStyles.indigo;
  const questions = questionsBank[packId] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('typing'); // typing, correct, warning, error
  const [streak, setStreak] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');

  // Feature 6: Rule progress
  const { onCorrect, onError, getRuleCard } = useRuleProgress();
  const [activeRuleTag, setActiveRuleTag] = useState(null);

  const inputRef = useRef(null);

  const isFinished = currentIndex >= questions.length;
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (status === 'typing' && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [currentIndex, status]);

  const handleCharInsert = (char) => {
    if (status !== 'typing') return;
    if (inputRef.current) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const text = inputValue;
      const newText = text.substring(0, start) + char + text.substring(end);
      setInputValue(newText);
      setTimeout(() => {
        inputRef.current.setSelectionRange(start + 1, start + 1);
        inputRef.current.focus();
      }, 0);
    } else {
      setInputValue(prev => prev + char);
    }
  };

  const checkAnswer = () => {
    if (!inputValue.trim() || status !== 'typing') return;

    const userAns = inputValue.trim().toLowerCase();
    const exactAns = currentQuestion.answer.toLowerCase();
    const noAccentAns = currentQuestion.answer_no_accent.toLowerCase();

    setUserAnswer(inputValue.trim());

    if (userAns === exactAns) {
      setStatus('correct');
      setStreak(s => s + 1);
      // Feature 6: Track rule progress on correct
      const triggeredTag = onCorrect(currentQuestion);
      if (triggeredTag) {
        // Delay showing rule card until after feedback is dismissed
        setActiveRuleTag(triggeredTag);
      }
    } else if (userAns === noAccentAns) {
      setStatus('warning');
    } else {
      setStatus('error');
      setStreak(0);
      // Feature 6: Reset rule progress on error
      onError(currentQuestion);
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // 关闭错误反馈卡片，重新作答当前题目
  const handleRetry = () => {
    setInputValue('');
    setUserAnswer('');
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white h-[100dvh]">
        <div className={`w-20 h-20 ${styles.bgLight} ${styles.text} rounded-full flex items-center justify-center mb-6`}>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">训练完成！</h2>
        <p className="text-gray-500 mb-10 text-center">
          你已经刷完了这个训练包里的所有题目。<br/><br/>
          <span className="bg-gray-50 px-4 py-2 rounded-lg font-medium text-gray-700">最终连击：🔥 {streak} 题</span>
        </p>
        <button
          onClick={onBack}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white ${styles.bgDark} shadow-md active:scale-95 transition-all`}
        >
          返回首页选择其他题库
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const sentenceParts = currentQuestion.sentence.split('_____');

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
              style={{ width: `${Math.min(((currentIndex) / questions.length) * 100, 100)}%` }}
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
          <div className={`absolute top-0 right-0 py-1 px-3 text-xs font-bold text-white ${styles.bg} rounded-bl-xl shadow-sm z-10`}>
            {currentQuestion.tense.toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-gray-800 leading-snug mt-2 mb-4 break-words">
            {sentenceParts[0]}
            <span className="inline-block mx-1 min-w-[3rem] border-b-2 border-gray-300"></span>
            {sentenceParts[1]}
          </h2>
          <p className="text-gray-500 text-sm">{currentQuestion.translation}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
              变位词：{currentQuestion.verb}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium">
              人称：{currentQuestion.person}
            </span>
          </div>
        </div>

        {/* Input */}
        <form
          className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex"
          onSubmit={(e) => { e.preventDefault(); checkAnswer(); }}
        >
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
            disabled={!inputValue.trim() || status !== 'typing'}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
              inputValue.trim() && status === 'typing'
                ? `${styles.bgDark} text-white shadow-md active:scale-95`
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </button>
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
          correctWord={currentQuestion.answer}
          rule={currentQuestion.rule}
          distractorError={currentQuestion.distractor_error}
          streak={streak}
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
