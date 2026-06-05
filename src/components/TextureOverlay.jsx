import React from 'react';

const TextureOverlay = () => {
  const [mousePos, setMousePos] = React.useState({ x: 50, y: 50 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* LAYER 1: Global Grain */}
      <div className="texture-overlay" />
      
      {/* LAYER 2: Candle Flicker (Mouse Sensitive) */}
      <div 
        className="candle-flicker" 
        style={{ 
          '--mouse-x': `${mousePos.x}%`, 
          '--mouse-y': `${mousePos.y}%` 
        }} 
      />
      
      {/* LAYER 3: Emotional Shadow Drift */}
      <div className="shadow-drift" />

      {/* LAYER 4: Foreground Blur Planes (Mouse Driven) */}
      <div 
        className="blur-plane" 
        style={{ 
          opacity: 0.15,
          maskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 10%, black 60%)`,
          WebkitMaskImage: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 10%, black 60%)`
        }} 
      />

      {/* LAYER 5: Paper & Linen System */}
      <div className="paper-atmosphere" />
      <div className="linen-texture" />

      {/* Subtle Film Noise SVG */}
      <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.65" 
              numOctaves="3" 
              stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </>
  );
};

export default TextureOverlay;
