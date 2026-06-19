import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  const location = useLocation();

  return (
    <div className="fixed top-4 left-0 w-full z-50 flex justify-center px-6 pointer-events-none">
      <header className="pointer-events-auto bg-cream/90 backdrop-blur-md border border-[#3b2b24]/10 shadow-lg rounded-2xl px-4 py-2 w-full max-w-6xl flex justify-between items-center transition-all duration-300">
        
        {/* Logo */}
        <Link to="/" className="relative z-50 flex-shrink-0 hover:opacity-80 transition-opacity duration-300 flex items-center">
          <span className="text-xl md:text-2xl text-[var(--accent-primary)] font-logo leading-none tracking-wide">
            Vantammayilu
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-5 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path}
              className="group relative"
            >
              <span className={`text-[10px] font-body uppercase tracking-[0.1em] block ${
                location.pathname === link.path ? 'text-[var(--accent-primary)]' : 'text-[var(--text-main)]'
              }`}>
                <RollingText text={link.name} active={location.pathname === link.path} />
              </span>
              {/* Subtle animated underline */}
              <span className={`absolute -bottom-1 left-0 h-[1px] bg-[var(--accent-primary)] transition-all duration-300 ${
                location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          
          <Link to="/dinner" className="btn-paper ml-4 font-body uppercase tracking-[0.1em] text-[7px] !px-2.5 !py-1 group flex items-center justify-center">
            <RollingText text="Reserve" active={false} hoverColorClass="text-[color:var(--bg-primary)]" />
          </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden relative z-50 text-[var(--text-main)] p-2 hover:text-[var(--accent-primary)] transition-colors pointer-events-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

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
                      onClick={() => setIsOpen(false)}
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
