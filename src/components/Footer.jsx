import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-primary)] border-t border-[var(--text-main)]/10 py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 paper-texture opacity-30 mix-blend-multiply pointer-events-none z-0" />
      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center">
        <h2 className="font-logo text-5xl md:text-6xl text-[var(--accent-primary)] mb-6 drop-shadow-sm">Vantammayilu</h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 font-body italic text-xl md:text-2xl text-[var(--text-main)]/80 mb-12">
          <Link to="/dinner" className="hover:text-[var(--accent-primary)] transition-colors">Dinners</Link>
          <Link to="/about" className="hover:text-[var(--accent-primary)] transition-colors">Story</Link>
          <Link to="/journal" className="hover:text-[var(--accent-primary)] transition-colors">Journal</Link>
          <Link to="/community" className="hover:text-[var(--accent-primary)] transition-colors">Community</Link>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 font-mono text-xs uppercase tracking-widest text-[var(--text-main)]/50">
          <span>© {new Date().getFullYear()} Vantammayilu. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
