import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ borderRadius: 'var(--card-radius)' }} className="sitewide-block-manifesto relative bg-[#e45a0b] text-[#002fa7] border-4 border-[#002fa7] min-h-[600px] overflow-hidden flex flex-col justify-between py-16 px-6 md:px-12 select-none mt-20">
      
      {/* Background Monumental Typography Anchor */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-90 select-none overflow-hidden leading-none z-0">
        <h1 className="font-serif text-[13vw] font-black uppercase tracking-tight text-[#002fa7] manifesto-text-shadow leading-none text-center">
          VANTAMMA
        </h1>
        <h1 className="font-serif text-[13vw] font-black uppercase tracking-tight text-[#002fa7] manifesto-text-shadow leading-none text-center -mt-4">
          YILU
        </h1>
      </div>

      {/* Overlapping Global Card Matrix */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 md:mt-24">
        
        {/* Card A: Directory & Substack Intake */}
        <div style={{ borderRadius: 'var(--card-radius)', boxShadow: '4px 4px 0px rgba(0, 47, 167, 0.08)' }} className="relative bg-[#efe9e1] border-4 border-[#002fa7] p-8 max-w-md mx-auto w-full rotate-[-1deg]">
          {/* Masking tape details */}
          <div className="absolute -top-3 left-1/4 -translate-x-1/2 w-20 h-6 bg-[#e6dfd5]/80 border border-[#002fa7]/20 rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] pointer-events-none" />
          <div className="absolute -top-3 right-1/4 translate-x-1/2 w-20 h-6 bg-[#e6dfd5]/80 border border-[#002fa7]/20 rotate-[2deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] pointer-events-none" />

          <h3 className="font-serif text-xl md:text-2xl font-black uppercase tracking-tight mb-4">
            [ INTAKE // REGISTRATION ]
          </h3>
          <p className="font-mono text-[10px] md:text-xs mb-6 leading-relaxed">
            Register your protocol for seats at the kitchen porch. New letters and scrapbooks sent weekly.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-4">
            {subscribed ? (
              <div style={{ borderRadius: 'var(--card-radius)' }} className="border-2 border-[#002fa7] p-3 text-center bg-[#e45a0b] text-[#efe9e1] font-mono text-xs font-bold">
                [ Protocol Saved // Welcome ]
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  required
                  placeholder="name@server.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: 'var(--card-radius)' }}
                  className="w-full bg-[#efe9e1] border-2 border-[#002fa7] font-mono text-xs p-3 outline-none focus:bg-[#002fa7]/5 text-[#002fa7]"
                />
                <button 
                  type="submit" 
                  style={{ borderRadius: 'var(--card-radius)', boxShadow: '2px 2px 0px rgba(0, 47, 167, 0.12)' }}
                  className="w-full bg-[#e45a0b] text-[#efe9e1] font-mono text-xs font-bold p-3 border-2 border-[#002fa7] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Card B: Global Sitewide Links */}
        <div style={{ borderRadius: 'var(--card-radius)', boxShadow: '4px 4px 0px rgba(0, 47, 167, 0.08)' }} className="relative bg-[#efe9e1] border-4 border-[#002fa7] p-8 max-w-md mx-auto w-full rotate-[1deg]">
          {/* Masking tape details */}
          <div className="absolute -top-3 left-1/3 -translate-x-1/2 w-20 h-6 bg-[#e6dfd5]/80 border border-[#002fa7]/20 rotate-[2deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] pointer-events-none" />
          <div className="absolute -top-3 right-1/3 translate-x-1/2 w-20 h-6 bg-[#e6dfd5]/80 border border-[#002fa7]/20 rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)] pointer-events-none" />

          <h3 className="font-serif text-xl md:text-2xl font-black uppercase tracking-tight mb-6">
            [ ARCHIVAL INDEX ]
          </h3>

          <ul className="space-y-4 font-mono text-xs md:text-sm font-bold">
            <li>
              <Link to="/dinner" className="hover:text-[#e45a0b] transition-colors flex justify-between items-center border-b border-dashed border-[#002fa7]/20 pb-2">
                <span>[ 01 / Book a Seat ]</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link to="/substack" className="hover:text-[#e45a0b] transition-colors flex justify-between items-center border-b border-dashed border-[#002fa7]/20 pb-2">
                <span>[ 02 / Journal ]</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-[#e45a0b] transition-colors flex justify-between items-center border-b border-dashed border-[#002fa7]/20 pb-2">
                <span>[ 03 / Fellowship ]</span>
                <span>→</span>
              </Link>
            </li>
            <li>
              <a href="#" onClick={handleBackToTop} className="hover:text-[#e45a0b] transition-colors flex justify-between items-center border-b border-dashed border-[#002fa7]/20 pb-2">
                <span>[ 04 / Back to Top ↑ ]</span>
                <span>▲</span>
              </a>
            </li>
          </ul>

          <div className="mt-8 font-mono text-[9px] opacity-60 text-right">
            Est. 2026 // Cultivated for Gathering
          </div>
        </div>
      </div>

      {/* Sitewide Footer Metadata strip */}
      <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center mt-12 md:mt-24 border-t border-[#002fa7]/20 pt-6 font-mono text-[10px]">
        <span>© 2026 VANTAMMAYILU. ALL RIGHTS RESERVED.</span>
        <span className="mt-2 md:mt-0">[ Design by Antigravity for the Bold ]</span>
      </div>
    </footer>
  );
}