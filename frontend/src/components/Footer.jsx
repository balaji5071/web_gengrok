import React from 'react';

function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-16">
      <div className="container mx-auto px-4 py-8 text-center">
        <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
        <p className="mb-4">We're here to help you create the perfect website.</p>
        
        <div className="flex justify-center items-center space-x-6 mb-6">
          {/* === REPLACE WITH YOUR DETAILS === */}
          <a 
            href="mailto:teamgengrok@gmail.com" 
            className="hover:text-white transition-colors"
          >
            teamgengrok@gmail.com
          </a>
          <span className="text-slate-500">|</span>
          <a 
            href="tel:+919346163673" 
            className="hover:text-white transition-colors"
          >
            +91 93461 63673
          </a>
          {/* =============================== */}
        </div>

        <div className="border-t border-slate-700 pt-6 text-sm text-slate-400">
          <p>&copy; 2025 StudentSites. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;