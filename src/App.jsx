import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ConjugationTable from './components/ConjugationTable';

function App() {
  // view: 'home' | 'quiz' | 'table'
  const [view, setView] = useState('home');
  const [currentPack, setCurrentPack] = useState(null);

  const handleSelectPack = (packId) => {
    setCurrentPack(packId);
    setView('quiz');
  };

  const handleBackToHome = () => {
    setCurrentPack(null);
    setView('home');
  };

  const handleOpenTable = () => {
    setView('table');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-gray-50 flex flex-col font-sans">
      {view === 'home' && (
        <HomeScreen
          onSelectPack={handleSelectPack}
          onOpenTable={handleOpenTable}
        />
      )}
      {view === 'quiz' && (
        <QuizScreen packId={currentPack} onBack={handleBackToHome} />
      )}
      {view === 'table' && (
        <ConjugationTable onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
