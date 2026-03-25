import React from 'react';

const chars = ['á', 'é', 'í', 'ó', 'ú', 'ñ'];

const SpecialKeyboard = ({ onInsert }) => {
  return (
    <div className="flex justify-center gap-2 mt-4 px-1">
      {chars.map(char => (
        <button
          key={char}
          onClick={(e) => {
            e.preventDefault(); // Prevent losing focus on input
            onInsert(char);
          }}
          className="bg-white hover:bg-gray-50 active:bg-gray-200 text-gray-800 font-medium text-lg rounded-xl shadow-sm border border-gray-200 flex-1 h-12 flex items-center justify-center select-none"
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default SpecialKeyboard;
