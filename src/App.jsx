import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';

function App() {
  const [currentPack, setCurrentPack] = useState(null);

  const handleSelectPack = (packId) => {
    setCurrentPack(packId);
  };

  const handleBackToHome = () => {
    setCurrentPack(null);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-gray-50 flex flex-col font-sans">
      {!currentPack ? (
        <HomeScreen onSelectPack={handleSelectPack} />
      ) : (
        <QuizScreen packId={currentPack} onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;
