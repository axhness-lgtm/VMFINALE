import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const [logoFadeIn, setLogoFadeIn] = useState(false);

  useEffect(() => {
    // Trigger smooth single fade-in on mount
    setTimeout(() => setLogoFadeIn(true), 50);

    // Exactly 2 seconds total loading time (2000 ms)
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        setFadeOut(true);
        window.dispatchEvent(new Event('loadingScreenFinished'));
        setTimeout(() => setVisible(false), 700); // 700ms smooth fade out to reveal the site
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#efe8db] flex flex-col items-center justify-center pointer-events-auto select-none transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Vantammayilu logo ass2.png - Fades in once cleanly and stays solid without flickering/pulsing */}
        <img 
          src="/ass2.png" 
          alt="Vantammayilu" 
          className={`w-56 sm:w-64 md:w-72 h-auto object-contain mb-1 filter drop-shadow-sm transition-opacity duration-1000 ease-out ${
            logoFadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Minimal Loading Bar brought right under the logo */}
        <div className="w-[80vw] max-w-[288px] flex flex-col items-center relative">
          {/* Fork doodle illustration - larger size tracking right over the loading bar */}
          <div 
            className="w-full flex items-center transition-all duration-75 ease-out mb-1"
            style={{ paddingLeft: `calc(${Math.min(progress, 84)}% - 14px)` }}
          >
            <img 
              src="/d1alt.png" 
              onError={(e) => { e.target.src = '/f.png'; }}
              alt="utensil illustration" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-md transform -rotate-12 transition-transform hover:scale-105" 
            />
          </div>

          {/* Rounded loading bar track */}
          <div className="w-full h-1.5 sm:h-2 bg-[#3b2b24]/10 rounded-full overflow-hidden p-[1px] shadow-inner">
            {/* On fully loading is filled in the same orange color used in the website (#e86321) */}
            <div 
              className="h-full bg-[#e86321] rounded-full transition-all duration-75 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#3b2b24]/60 mt-3.5">
            Setting the table... {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
