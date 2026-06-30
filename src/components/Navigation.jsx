import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, Volume2, VolumeX } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dinners', path: '/dinner' },
  { name: 'About', path: '/about' },
  { name: 'Community', path: '/community' },
  { name: 'Journal', path: '/journal' },
];

const RollingText = ({ text, active, hoverColorClass="text-[var(--accent-secondary)]" }) => (
  <div className="relative overflow-hidden inline-block h-[1.2em]">
    <div className={`transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${active ? '-translate-y-full' : 'group-hover:-translate-y-full'}`}>
      <span className="block leading-[1.2em]">{text}</span>
    </div>
    <div className={`absolute top-0 left-0 w-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${active ? 'translate-y-0 text-[var(--accent-primary)] italic' : `translate-y-full group-hover:translate-y-0 ${hoverColorClass} italic`}`}>
      <span className="block leading-[1.2em]">{text}</span>
    </div>
  </div>
);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const lenis = useLenis();

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  };

  const toggleMusic = () => {
    const audio = document.getElementById('bg-music');
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.volume = 0.5;
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Audio play error:", err);
          alert("Could not start audio. Please click anywhere on the page first or verify your browser audio permissions.");
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className="fixed left-0 w-full z-50 flex justify-center pointer-events-none transition-all duration-300 top-4 px-6">
      <header className="pointer-events-auto flex justify-between items-center transition-all duration-300 bg-cream/90 backdrop-blur-md border border-[#3b2b24]/10 shadow-lg rounded-2xl px-6 py-3 w-full max-w-6xl">
        
        {/* Logo */}
        <Link to="/" onClick={handleScrollTop} className="relative z-50 flex-shrink-0 hover:opacity-80 transition-opacity duration-300 flex items-center">
          <span className="text-2xl md:text-3xl text-[var(--accent-primary)] font-logo leading-none tracking-wide">
            Vantammayilu
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              onClick={handleScrollTop}
              className="group relative pt-1"
            >
              <span className={`text-[13px] font-body uppercase tracking-[0.15em] font-bold block ${
                location.pathname === link.path ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'
              }`}>
                <RollingText text={link.name} active={location.pathname === link.path} />
              </span>
              {/* Subtle animated underline */}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-[var(--accent-primary)] transition-all duration-300 ${
                location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          
          <Link 
            to="/dinner" 
            onClick={handleScrollTop} 
            className="ml-6 px-9 py-3 rounded-xl font-heading italic font-light text-lg tracking-wider bg-[var(--accent-primary)] text-white hover:bg-[#c14a27] hover:scale-105 active:scale-95 shadow-md transition-all duration-300"
          >
            Reserve
          </Link>
          
          <button 
            onClick={toggleMusic}
            className="ml-2 text-[var(--text-main)] hover:text-[var(--accent-primary)] transition-colors p-1"
            title="Toggle Background Music"
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </nav>

        <div className="md:hidden flex items-center gap-4 relative z-50 pointer-events-auto">
          <button 
            onClick={toggleMusic}
            className="text-[var(--text-main)] hover:text-[var(--accent-primary)] transition-colors"
          >
            {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button 
            className="text-[var(--text-main)] p-2 hover:text-[var(--accent-primary)] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 mt-4 mx-6 bg-[var(--bg-secondary)] border border-[var(--text-main)]/10 shadow-2xl rounded-2xl p-8 z-40 flex flex-col pointer-events-auto"
            >
              <div className="flex flex-col gap-6 relative z-10 w-full">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link 
                      to={link.path}
                      onClick={() => { setIsOpen(false); handleScrollTop(); }}
                      className={`text-2xl font-body uppercase tracking-[0.1em] transition-colors ${
                        location.pathname === link.path ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)] hover:text-[var(--accent-secondary)]'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
