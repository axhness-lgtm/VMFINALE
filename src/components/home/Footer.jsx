import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0d0804] py-32 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
      <div className="text-center z-10">
        <h2 className="text-[96px] italic text-white font-light tracking-widest">
          Vantammayilu
        </h2>
        <p className="text-mono text-[10px] uppercase tracking-[0.4em] text-white/30 mt-8">
          Visakhapatnam · 2025
        </p>
      </div>

      <nav className="mt-20 flex gap-12 text-mono text-[10px] uppercase tracking-[0.2em] text-white/60 z-10">
        <a href="/dinner" className="hover:text-[#e45a0b] transition-colors">Upcoming Dinner</a>
        <a href="/society" className="hover:text-[#e45a0b] transition-colors">Long Table Society</a>
        <a href="/journal" className="hover:text-[#e45a0b] transition-colors">Journal</a>
      </nav>

      <div className="mt-32 text-center z-10">
        <p className="text-serif italic text-xl text-white/80">The table is already set.</p>
        <p className="text-mono text-[9px] uppercase tracking-[0.3em] orange mt-4">You are welcome here</p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#e45a0b]"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-grain-footer"></div>

      <style>{`
        .bg-grain-footer {
          background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
        }
      `}</style>
    </footer>
  );
};

export default Footer;
