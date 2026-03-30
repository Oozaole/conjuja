import React, { useState, useRef, useEffect } from 'react';
import { conjugationTables } from '../data/conjugation_tables';
import SpecialKeyboard from './SpecialKeyboard';

const persons = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
const personLabels = {
  yo: 'yo',
  tu: 'tú',
  el: 'él/ella',
  nosotros: 'nosotros',
  vosotros: 'vosotros',
  ellos: 'ellos/ellas'
};

const ConjugationTable = ({ onBack }) => {
  // Get unique verbs and tenses
  const verbOptions = [...new Set(conjugationTables.map(t => t.verb))];
  const [selectedVerb, setSelectedVerb] = useState(verbOptions[0] || '');
  const [selectedTense, setSelectedTense] = useState('');
  const [phase, setPhase] = useState('select'); // select, fill, result
  const [inputs, setInputs] = useState({});
  const [results, setResults] = useState(null);
  const [focusedPerson, setFocusedPerson] = useState(null);
  const inputRefs = useRef({});

  // Available tenses for the selected verb
  const availableTenses = conjugationTables
    .filter(t => t.verb === selectedVerb)
    .map(t => ({ tense: t.tense, tense_cn: t.tense_cn }));

  useEffect(() => {
    if (availableTenses.length > 0 && !selectedTense) {
      setSelectedTense(availableTenses[0].tense);
    }
  }, [selectedVerb]);

  const currentTable = conjugationTables.find(
    t => t.verb === selectedVerb && t.tense === selectedTense
  );

  const handleStart = () => {
    setInputs({});
    setResults(null);
    setPhase('fill');
    setFocusedPerson('yo');
    setTimeout(() => inputRefs.current['yo']?.focus(), 100);
  };

  const handleInputChange = (person, value) => {
    setInputs(prev => ({ ...prev, [person]: value }));
  };

  const handleCharInsert = (char) => {
    if (!focusedPerson || !inputRefs.current[focusedPerson]) return;
    const input = inputRefs.current[focusedPerson];
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = inputs[focusedPerson] || '';
    const newText = text.substring(0, start) + char + text.substring(end);
    setInputs(prev => ({ ...prev, [focusedPerson]: newText }));
    setTimeout(() => {
      input.setSelectionRange(start + 1, start + 1);
      input.focus();
    }, 0);
  };

  const handleSubmit = () => {
    if (!currentTable) return;
    const res = {};
    let correctCount = 0;

    persons.forEach(p => {
      const userAns = (inputs[p] || '').trim().toLowerCase();
      const expected = currentTable.conjugation_table[p];
      if (!userAns) {
        res[p] = { status: 'error', userAnswer: '', correctAnswer: expected.answer };
      } else if (userAns === expected.answer.toLowerCase()) {
        res[p] = { status: 'correct', userAnswer: inputs[p]?.trim(), correctAnswer: expected.answer };
        correctCount++;
      } else if (userAns === expected.answer_no_accent.toLowerCase()) {
        res[p] = { status: 'warning', userAnswer: inputs[p]?.trim(), correctAnswer: expected.answer };
      } else {
        res[p] = { status: 'error', userAnswer: inputs[p]?.trim(), correctAnswer: expected.answer };
      }
    });
    setResults({ details: res, correctCount, total: 6 });
    setPhase('result');
  };

  const handleReset = () => {
    setInputs({});
    setResults(null);
    setPhase('fill');
    setFocusedPerson('yo');
    setTimeout(() => inputRefs.current['yo']?.focus(), 100);
  };

  const handleChangeVerb = () => {
    setInputs({});
    setResults(null);
    setPhase('select');
  };

  const handleKeyDown = (e, person) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const idx = persons.indexOf(person);
      const next = e.shiftKey
        ? persons[(idx - 1 + persons.length) % persons.length]
        : persons[(idx + 1) % persons.length];
      inputRefs.current[next]?.focus();
      setFocusedPerson(next);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = persons.indexOf(person);
      if (idx < persons.length - 1) {
        const next = persons[idx + 1];
        inputRefs.current[next]?.focus();
        setFocusedPerson(next);
      } else {
        handleSubmit();
      }
    }
  };

  const statusBg = {
    correct: 'bg-green-50 border-green-200',
    warning: 'bg-orange-50 border-orange-200',
    error: 'bg-red-50 border-red-200'
  };
  const statusIcon = {
    correct: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className="flex-1 flex flex-col h-[100dvh]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center border-b border-gray-100 shadow-sm z-10 shrink-0">
        <button onClick={onBack} className="text-gray-400 p-2 -ml-2 hover:bg-gray-50 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800">📋 完整变位表速填</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">

        {/* Phase: Select */}
        {phase === 'select' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">选择动词</label>
                {currentTable && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{currentTable.difficulty}</span>
                    {currentTable.is_irregular && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold">不规则</span>}
                  </div>
                )}
              </div>
              <div className="relative">
                <select
                  value={selectedVerb}
                  onChange={e => {
                    setSelectedVerb(e.target.value);
                    setSelectedTense('');
                  }}
                  className="w-full p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/30 text-xl font-bold text-indigo-900 appearance-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all cursor-pointer shadow-sm"
                >
                  {verbOptions.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">选择时态</label>
              <div className="space-y-2">
                {availableTenses.map(t => (
                  <label key={t.tense} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedTense === t.tense ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                    <input
                      type="radio"
                      name="tense"
                      value={t.tense}
                      checked={selectedTense === t.tense}
                      onChange={() => setSelectedTense(t.tense)}
                      className="accent-indigo-600"
                    />
                    <span className="font-medium text-gray-800">{t.tense_cn}</span>
                    <span className="text-xs text-gray-400">({t.tense})</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!currentTable}
              className="w-full py-4 rounded-xl font-bold text-lg text-white bg-indigo-600 shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              开始填表 →
            </button>
          </div>
        )}

        {/* Phase: Fill */}
        {phase === 'fill' && currentTable && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{currentTable.verb} · {currentTable.tense_cn}</h2>
            </div>

            <div className="space-y-3 mb-5">
              {persons.map(p => (
                <div key={p} className="flex items-center gap-3">
                  <span className="w-[90px] text-sm font-bold text-gray-600 text-right shrink-0">{personLabels[p]}</span>
                  <input
                    ref={el => inputRefs.current[p] = el}
                    type="text"
                    value={inputs[p] || ''}
                    onChange={e => handleInputChange(p, e.target.value)}
                    onFocus={() => setFocusedPerson(p)}
                    onKeyDown={e => handleKeyDown(e, p)}
                    className={`flex-1 bg-white border rounded-xl px-4 py-3 text-lg font-bold text-gray-900 outline-none transition-all ${focusedPerson === p ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-200'}`}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    autoComplete="off"
                    placeholder="..."
                  />
                </div>
              ))}
            </div>

            <SpecialKeyboard onInsert={handleCharInsert} />

            <button
              onClick={handleSubmit}
              className="w-full py-4 mt-5 rounded-xl font-bold text-lg text-white bg-indigo-600 shadow-md active:scale-95 transition-all"
            >
              全部提交 ✓
            </button>
          </div>
        )}

        {/* Phase: Result */}
        {phase === 'result' && results && currentTable && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{currentTable.verb} · {currentTable.tense_cn} <span className="text-base font-normal text-gray-500">结果</span></h2>
            </div>

            <div className="space-y-2 mb-5">
              {persons.map(p => {
                const r = results.details[p];
                return (
                  <div key={p} className={`flex items-center gap-3 p-3 rounded-xl border ${statusBg[r.status]}`}>
                    <span className="w-[90px] text-sm font-bold text-gray-600 text-right shrink-0">{personLabels[p]}</span>
                    <span className="flex-1 text-lg font-bold text-gray-900">
                      {r.userAnswer || <span className="text-gray-300">（空）</span>}
                    </span>
                    <span className="text-lg">{statusIcon[r.status]}</span>
                    {r.status !== 'correct' && (
                      <span className="text-sm text-gray-500">→ {r.correctAnswer}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
              <p className="text-base font-bold text-gray-800">
                本次得分：{results.correctCount}/{results.total}
                <span className="ml-2 text-gray-500">正确率 {Math.round(results.correctCount / results.total * 100)}%</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 active:scale-[0.98] transition-all"
              >
                重新填这张表
              </button>
              <button
                onClick={handleChangeVerb}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 shadow-md active:scale-[0.98] transition-all"
              >
                换一个动词
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConjugationTable;
