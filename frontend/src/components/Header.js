import React from 'react';
import { ArrowRight } from 'lucide-react';

const Header = () => {
  const handleContactClick = () => {
    const modal = document.getElementById('contactModal');
    if (modal) modal.style.display = 'block';
  };

  return (
    <header className="font-['Inter']">
      <div className="container">
        <div className="header-content">
        <a href="#" className="logo flex items-center gap-2">
            <img 
                src="./assets/logo.png" 
                alt="Migracle Logo" 
                className="w-12 h-12 object-contain"
            />
            <span className="text-xl font-semibold">Migracle</span>
        </a>
          <button 
            onClick={handleContactClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black 
                rounded-xl font-semibold text-lg transition-colors hover:bg-white/90"
            >
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
