import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* PART 1: THE INITIAL FIXED HEADER (COLLAPSED STATE) */}
      <div className="fixed top-0 left-0 w-full h-20 bg-transparent z-[100] flex items-center justify-between px-8 select-none pointer-events-none">
        
        {/* Left Side: Capsule Navigation Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Circular Logo Link */}
          <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#002fa7] overflow-hidden bg-[#efe9e1] shadow-[2px_2px_0px_rgba(0,47,167,0.1)] hover:scale-105 transition-all mr-1">
            <img src="/assets/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </Link>

          <Link to="/" className="nav-capsule active font-mono text-[11px] font-bold tracking-widest px-4 py-2 border-2 border-[#002fa7] rounded-full bg-[#e45a0b] text-[#efe9e1] hover:bg-[#efe9e1] hover:text-[#002fa7] transition-all">
            Home
          </Link>
          <Link to="/founder" className="nav-capsule font-mono text-[11px] font-bold tracking-widest px-4 py-2 border-2 border-[#002fa7] rounded-full bg-[#efe9e1] text-[#002fa7] hover:bg-[#002fa7] hover:text-[#efe9e1] transition-all">
            About Us
          </Link>
          <Link to="/substack" className="nav-capsule font-mono text-[11px] font-bold tracking-widest px-4 py-2 border-2 border-[#002fa7] rounded-full bg-[#efe9e1] text-[#002fa7] hover:bg-[#002fa7] hover:text-[#efe9e1] transition-all">
            Journal
          </Link>
          <Link to="/dinner" className="nav-capsule font-mono text-[11px] font-bold tracking-widest px-4 py-2 border-2 border-[#002fa7] rounded-full bg-[#efe9e1] text-[#002fa7] hover:bg-[#002fa7] hover:text-[#efe9e1] transition-all">
            Dinners
          </Link>
          <Link to="/community" className="nav-capsule font-mono text-[11px] font-bold tracking-widest px-4 py-2 border-2 border-[#002fa7] rounded-full bg-[#efe9e1] text-[#002fa7] hover:bg-[#002fa7] hover:text-[#efe9e1] transition-all">
            Community
          </Link>
        </div>

        {/* Right Side: Search Bar & Hamburger Icon */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Search Capsule */}
          <div className="flex items-center gap-2 border-2 border-[#002fa7] rounded-full px-4 py-2 bg-[#efe9e1] shadow-[2px_2px_0px_rgba(0,47,167,0.1)]">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#002fa7]" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="search memories" 
              className="bg-transparent outline-none font-mono text-[11px] placeholder:text-[#002fa7]/50 text-[#002fa7] w-32"
            />
          </div>

          {/* Menu circle toggle button */}
          <button 
            onClick={toggleOpen}
            className="w-10 h-10 rounded-full border-2 border-[#002fa7] bg-[#efe9e1] text-[#002fa7] flex items-center justify-center font-bold hover:bg-[#e45a0b] hover:text-[#efe9e1] transition-all shadow-[2px_2px_0px_rgba(0,47,167,0.1)]"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* PART 2: THE EXPANDED OVERLAY (ACTIVE DIRECTORY STATE) */}
      <div 
        className={`fixed left-0 w-full bg-[#efe9e1] z-[90] transition-all duration-300 ease-out overflow-hidden flex flex-col ${
          isOpen ? 'top-12 h-[calc(100vh-48px)] opacity-100' : 'top-12 h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full border-t border-[#002fa7] relative">
          
          {/* Quadrant 1 (Top-Left): 01 // THE DINNER */}
          <Link 
            to="/dinner" 
            onClick={closeMenu}
            className="border-r-2 border-b-2 border-[#002fa7] flex flex-col items-center justify-center bg-[#efe9e1] hover:bg-[#e45a0b] text-[#002fa7] hover:text-[#efe9e1] transition-all duration-300 group relative p-4"
          >
            <span className="font-serif text-2xl sm:text-4xl md:text-6xl lg:text-[4.5vw] font-black uppercase tracking-tight text-center leading-none transition-transform duration-300 group-hover:scale-105">
              01 // THE DINNER
            </span>
            <span className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-[9px] md:text-xs font-bold tracking-widest text-[#002fa7] group-hover:text-[#efe9e1]">
              [ EXPLORE ROUTE → ]
            </span>
          </Link>

          {/* Quadrant 2 (Top-Right): 02 // SOCIETY */}
          <Link 
            to="/community" 
            onClick={closeMenu}
            className="border-b-2 border-[#002fa7] flex flex-col items-center justify-center bg-[#efe9e1] hover:bg-[#e45a0b] text-[#002fa7] hover:text-[#efe9e1] transition-all duration-300 group relative p-4"
          >
            <span className="font-serif text-2xl sm:text-4xl md:text-6xl lg:text-[4.5vw] font-black uppercase tracking-tight text-center leading-none transition-transform duration-300 group-hover:scale-105">
              02 // SOCIETY
            </span>
            <span className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-[9px] md:text-xs font-bold tracking-widest text-[#002fa7] group-hover:text-[#efe9e1]">
              [ EXPLORE ROUTE → ]
            </span>
          </Link>

          {/* Quadrant 3 (Bottom-Left): 03 // JOURNAL */}
          <Link 
            to="/substack" 
            onClick={closeMenu}
            className="border-r-2 border-[#002fa7] flex flex-col items-center justify-center bg-[#efe9e1] hover:bg-[#e45a0b] text-[#002fa7] hover:text-[#efe9e1] transition-all duration-300 group relative p-4"
          >
            <span className="font-serif text-2xl sm:text-4xl md:text-6xl lg:text-[4.5vw] font-black uppercase tracking-tight text-center leading-none transition-transform duration-300 group-hover:scale-105">
              03 // JOURNAL
            </span>
            <span className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-[9px] md:text-xs font-bold tracking-widest text-[#002fa7] group-hover:text-[#efe9e1]">
              [ EXPLORE ROUTE → ]
            </span>
          </Link>

          {/* Quadrant 4 (Bottom-Right): 04 // ABOUT US */}
          <Link 
            to="/founder" 
            onClick={closeMenu}
            className="flex flex-col items-center justify-center bg-[#efe9e1] hover:bg-[#e45a0b] text-[#002fa7] hover:text-[#efe9e1] transition-all duration-300 group relative p-4"
          >
            <span className="font-serif text-2xl sm:text-4xl md:text-6xl lg:text-[4.5vw] font-black uppercase tracking-tight text-center leading-none transition-transform duration-300 group-hover:scale-105">
              04 // ABOUT US
            </span>
            <span className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-[9px] md:text-xs font-bold tracking-widest text-[#002fa7] group-hover:text-[#efe9e1]">
              [ EXPLORE ROUTE → ]
            </span>
          </Link>

        </div>
      </div>
    </>
  );
};

export default Navigation;
