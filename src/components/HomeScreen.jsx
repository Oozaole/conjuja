import React from 'react';
import { trainingPacks } from '../data/questions';

const themeStyles = {
  blue: { title: 'text-blue-600', bg: 'bg-white', border: 'border-blue-100' },
  teal: { title: 'text-teal-600', bg: 'bg-white', border: 'border-teal-100' },
  indigo: { title: 'text-indigo-600', bg: 'bg-white', border: 'border-indigo-100' }
};

const HomeScreen = ({ onSelectPack }) => {
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
              className={`w-full text-left ${theme.bg} p-6 rounded-2xl shadow-sm border ${theme.border} hover:shadow-md transition-all active:scale-[0.98] transform flex flex-col gap-2 relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start mb-1">
                <h2 className={`text-xl font-bold ${theme.title}`}>{pack.title}</h2>
                <span className="text-xs font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-2 py-1 rounded-md">
                  {pack.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{pack.description}</p>
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>适合手机端浏览 · 支持特殊字符快填</p>
      </div>
    </div>
  );
};

export default HomeScreen;
