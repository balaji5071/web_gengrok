// src/components/Header.jsx

import React from 'react';

// 1. Accept the onGetStartedClick prop
function Header({ onGetStartedClick }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* ... (logo svg code) ... */}
            <span className="text-xl font-bold text-gray-800">GenGrok</span>
          </div>

          {/* Get Started Button */}
          <div>
            {/* 2. Add the onClick handler */}
            <button 
              onClick={onGetStartedClick}
              className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors duration-300"
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