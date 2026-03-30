import React from 'react';
import { trainingPacks } from '../data/questions';

const themeStyles = {
  blue: { title: 'text-blue-600', bg: 'bg-white', border: 'border-blue-100', leftBar: 'border-l-blue-500' },
  teal: { title: 'text-teal-600', bg: 'bg-white', border: 'border-teal-100', leftBar: 'border-l-teal-500' },
  indigo: { title: 'text-indigo-600', bg: 'bg-white', border: 'border-indigo-100', leftBar: 'border-l-indigo-500' }
};

const PackIcon = ({ theme }) => {
  if (theme === 'blue') {
    return (
      <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
    );
  }
  if (theme === 'teal') {
    return (
      <div className="p-1.5 bg-teal-50 text-teal-500 rounded-lg shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
    );
  }
  return (
    <div className="p-1.5 bg-indigo-50 text-indigo-500 rounded-lg shrink-0">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    </div>
  );
};

const HomeScreen = ({ onSelectPack, onOpenTable }) => {
  return (
    <div className="flex-1 flex flex-col p-4 pt-12 pb-8">
      <div className="mb-10 px-2 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Conjuga<span className="text-indigo-600">ES</span>
        </h1>
        <p className="text-gray-500 text-base">西语变位「混淆专项」练习工具</p>
      </div>

      <div className="space-y-4 flex-1 max-w-sm mx-auto w-full">
        {trainingPacks.map(pack => {
          const theme = themeStyles[pack.theme] || themeStyles.indigo;

          return (
            <button
              key={pack.id}
              onClick={() => onSelectPack(pack.id)}
              className={`w-full text-left ${theme.bg} p-6 rounded-2xl shadow-sm border border-l-[6px] ${theme.border} ${theme.leftBar} hover:shadow-md transition-all active:scale-[0.98] transform flex flex-col gap-2 relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start mb-1">
                <h2 className={`text-xl font-bold ${theme.title} pr-2`}>{pack.title}</h2>
                <PackIcon theme={pack.theme} />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{pack.description}</p>
            </button>
          );
        })}

        {/* Feature 2: 完整变位表入口 */}
        <button
          onClick={onOpenTable}
          className="w-full text-left bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md transition-all active:scale-[0.98] transform flex items-center gap-4"
        >
          <span className="text-3xl">📋</span>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-indigo-700">完整变位表速填</h2>
            <p className="text-indigo-500 text-sm">选择动词和时态，填写六格变位表</p>
          </div>
          <span className="text-indigo-400 text-xl">→</span>
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>适合手机端浏览 · 支持特殊字符快填</p>
      </div>
    </div>
  );
};

export default HomeScreen;
