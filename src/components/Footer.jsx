import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if(email) setSubscribed(true);
  };

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#fdfaf5] border-t border-[var(--text-main)]/10 pt-24 pb-12 px-6 md:px-12 mt-12 relative overflow-hidden paper-texture">
      
      {/* Abstract Map Fragment Background */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 opacity-5 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,72.6,41.2C63.8,53.2,51.8,62.8,38.1,70.5C24.4,78.2,9,83.9,-5.4,81.8C-19.7,79.6,-33,69.5,-46.8,60.6C-60.5,51.7,-74.6,44,-82.4,31.4C-90.2,18.8,-91.7,1.4,-86.6,-13.3C-81.6,-28.1,-70,-40.2,-56.9,-48.9C-43.8,-57.5,-29.2,-62.7,-14.9,-68.8C-0.5,-74.9,14.6,-82.1,30.6,-83.6C44.7,-76.4,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-8 items-center lg:items-start justify-between">
        
        {/* Left Side: Editorial Note & Sign-off */}
        <div className="w-full lg:w-5/12 flex flex-col relative">
          {/* Decorative Stamp */}
          <div className="absolute -top-12 -left-8 stamp rotate-[-15deg] opacity-60 scale-110 z-10 bg-[var(--bg-primary)]">
            VIZAG MAIN
          </div>
          
          {/* Taped-in Illustration */}
          <div className="relative mb-12 w-3/4 max-w-[300px] torn-edge shadow-md hover-lift rotate-[-2deg] z-20 polaroid-frame">
            <div className="masking-tape w-20 h-5 -top-2 left-6 -rotate-3" />
            <img 
              src="/footerass.png" 
              alt="Vantammayilu Illustration" 
              className="w-full h-auto object-cover grayscale-[0.2] sepia-[0.1]"
            />
          </div>

          <div className="relative pl-4 md:pl-8 border-l border-dashed border-[var(--text-main)]/20 mb-12">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[var(--text-main)] mb-6 leading-[0.95]">
              To the stranger<br/>reading this...
            </h2>
            <p className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 leading-relaxed italic mb-8 max-w-md">
              There is a seat waiting for you. Come hungry, bring a story, and leave the rest to us.
            </p>
            <div className="mt-8 relative inline-block">
              <span className="handwritten-annotation text-4xl rotate-[-8deg] ml-8 block">Until the next table,</span>
              <span className="handwritten-annotation text-5xl rotate-[-5deg] ml-16 mt-4 block text-[var(--accent-primary)]">Hyndavi</span>
            </div>
          </div>
        </div>

        {/* Middle: The Ticket Stub Newsletter */}
        <div className="w-full lg:w-4/12 flex justify-center z-20">
          <div className="bg-[#fcfbf9] w-full max-w-sm border-2 border-dashed border-[var(--text-main)]/30 p-8 shadow-xl rotate-[1deg] hover-lift ticket-edge relative">
            <div className="masking-tape w-16 h-4 -bottom-2 right-12 rotate-[-2deg]" />
            <div className="absolute top-4 right-4 stamp rotate-12 opacity-40 scale-75 border-red-800 text-red-800">WAITLIST</div>
            
            <div className="flex items-center gap-3 text-[var(--text-main)] mb-6 border-b border-[var(--text-main)]/10 pb-4">
              <Mail size={20} className="text-[var(--accent-primary)]" />
              <h3 className="font-heading text-2xl uppercase tracking-widest">The Guest List</h3>
            </div>
            
            <p className="font-body text-[var(--text-main)]/70 mb-8 italic">
              Strangers hear about the next dinner first. Drop your email to get the invite.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-[var(--text-main)]/30 pb-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-main)]/50">Passenger Email</label>
                <input 
                  type="email" 
                  placeholder="hello@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none font-body text-lg text-[var(--text-main)] placeholder:text-[var(--text-main)]/30 w-full"
                />
              </div>
              <button 
                type="submit" 
                className="mt-4 bg-[var(--accent-primary)] text-white py-3 px-6 font-mono text-xs uppercase tracking-widest hover:bg-[var(--text-main)] transition-colors text-center shadow-sm w-full"
              >
                {subscribed ? 'Ticket Confirmed ✓' : 'Request a Seat'}
              </button>
            </form>
            
            {/* Ticket stub perforated edge detail */}
            <div className="absolute left-0 right-0 bottom-12 border-t-2 border-dotted border-[var(--text-main)]/20"></div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-[9px] font-mono uppercase text-[var(--text-main)]/40 tracking-widest">
              <span>Class: Economy</span>
              <span>Seat: TBD</span>
            </div>
          </div>
        </div>

        {/* Right Side: Margins & Navigation */}
        <div className="w-full lg:w-3/12 flex flex-col items-center lg:items-end justify-between relative h-full">
          
          {/* Circular Stamp */}
          <div className="relative w-32 h-32 mb-12 opacity-80 animate-[spin_20s_linear_infinite] pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[var(--accent-primary)]">
              <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent" />
              <text fontSize="11" fontFamily="monospace" letterSpacing="2.5" fill="currentColor">
                <textPath href="#circlePath">
                  • STORIES BY THE SEA • VANTAMMAYILU 
                </textPath>
              </text>
            </svg>
          </div>

          <div className="flex flex-col gap-6 text-center lg:text-right relative">
            <div className="masking-tape w-8 h-3 -left-4 top-2 rotate-90 opacity-60 hidden lg:block" />
            
            <div className="flex flex-col gap-3 font-body text-xl lg:text-2xl text-[var(--text-main)]/80 hover-lift-inverse">
              <Link to="/dinner" className="hover:text-[var(--accent-primary)] transition-colors italic border-b border-transparent hover:border-dashed hover:border-[var(--accent-primary)] w-max lg:ml-auto mx-auto lg:mx-0">Dinners.</Link>
              <Link to="/about" className="hover:text-[var(--accent-primary)] transition-colors italic border-b border-transparent hover:border-dashed hover:border-[var(--accent-primary)] w-max lg:ml-auto mx-auto lg:mx-0">Story.</Link>
              <Link to="/journal" className="hover:text-[var(--accent-primary)] transition-colors italic border-b border-transparent hover:border-dashed hover:border-[var(--accent-primary)] w-max lg:ml-auto mx-auto lg:mx-0">Journal.</Link>
              <Link to="/community" className="hover:text-[var(--accent-primary)] transition-colors italic border-b border-transparent hover:border-dashed hover:border-[var(--accent-primary)] w-max lg:ml-auto mx-auto lg:mx-0">Community.</Link>
            </div>
            
            <div className="mt-8 flex flex-col gap-2 font-mono text-xs text-[var(--text-main)]/50 tracking-widest uppercase">
              <a href="#" className="hover:text-[var(--text-main)] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors">Substack</a>
              <a href="#" className="hover:text-[var(--text-main)] transition-colors">Contact</a>
            </div>
          </div>
          
        </div>
      </div>

      {/* Very Bottom Bar */}
      <div className="container mx-auto max-w-6xl mt-24 border-t border-[var(--text-main)]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="font-logo text-2xl text-[var(--accent-primary)] opacity-80">V</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-main)]/40">© {new Date().getFullYear()} Vantammayilu. All rights reserved.</span>
        </div>
        <div className="flex gap-6 font-mono text-[10px] uppercase tracking-widest text-[var(--text-main)]/40">
          <a href="#" className="hover:text-[var(--text-main)] transition-colors">Terms</a>
          <a href="#" className="hover:text-[var(--text-main)] transition-colors">Privacy</a>
          <a href="#" onClick={handleBackToTop} className="hover:text-[var(--text-main)] transition-colors flex items-center gap-1 group">
            Back to top <ArrowRight size={10} className="-rotate-90 group-hover:-translate-y-1 transition-transform"/>
          </a>
        </div>
      </div>
      
      {/* Final subtle coffee ring overlapping the edge */}
      <div className="absolute bottom-4 right-1/3 w-24 h-24 coffee-ring opacity-40 rotate-[80deg] pointer-events-none" />
      
    </footer>
  );
}
