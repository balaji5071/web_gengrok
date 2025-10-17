import React from 'react';

function Hero({ onOrderClick }) {
  return (
    <div className="text-center py-24 sm:py-32">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight">
        Professional Websites
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Built for Students
        </span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
        Stand out from the crowd with a stunning, custom-built website. Perfect for portfolios, resumes, and projects.
      </p>
      <div className="mt-8 flex justify-center">
        <button 
          onClick={onOrderClick}
          className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300" // <-- CHANGED
        >
          Order Your Website
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>
    </div>
  );
}

export default Hero;