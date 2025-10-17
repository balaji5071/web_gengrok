import React from 'react';

function Header({ onGetStartedClick }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">GenGrok</span>
          </div>
          <div>
            <button 
              onClick={onGetStartedClick}
              className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300" // <-- CHANGED
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;