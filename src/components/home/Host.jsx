import React from 'react';

const Host = () => {
  return (
    <section className="bg-[#0d0804] py-32 w-full flex items-center overflow-hidden">
      <div className="container mx-auto px-[5%] lg:px-[8%]">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between" style={{ gap: '80px' }}>
          
          {/* Portrait Left: 40% */}
          <div className="w-full lg:w-[40%] flex justify-center lg:justify-end">
            <div 
              className="relative overflow-hidden border border-white/5"
              style={{ width: '300px', height: '400px', background: 'linear-gradient(135deg, #e86321 0%, #1a0e05 100%)' }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-grain"></div>
              {/* Torn paper edge effect matching the dark background */}
              <div className="absolute top-0 right-0 h-full w-4 bg-[#0d0804]" style={{
                clipPath: 'polygon(100% 0%, 0% 0%, 50% 5%, 0% 10%, 60% 15%, 0% 20%, 40% 25%, 0% 30%, 70% 35%, 0% 40%, 30% 45%, 0% 50%, 80% 55%, 0% 60%, 20% 65%, 0% 70%, 90% 75%, 0% 80%, 10% 85%, 0% 90%, 100% 95%, 0% 100%)'
              }}></div>
            </div>
          </div>

          {/* Text Right: 60% */}
          <div className="w-full lg:w-[60%] flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex flex-col" style={{ maxWidth: '560px' }}>
              <h2 
                className="font-heading italic font-light text-center"
                style={{ fontSize: '28px', color: '#efe9e1', lineHeight: '1.4', maxWidth: '560px', margin: '0 auto' }}
              >
                "I built this because I was hungry for more than food — I was hungry for the kind of conversation that makes you forget the time."
              </h2>
              
              <div 
                className="font-mono space-y-6 text-left"
                style={{ fontSize: '13px', lineHeight: '2', color: 'rgba(239,233,225,0.7)', maxWidth: '560px', margin: '40px auto 0' }}
              >
                <p>
                  Vantammayilu was born out of a simple realization: the most beautiful things happen when strangers share a table. 
                  There is a specific kind of magic in the intersection of a new flavor and a new story.
                </p>
                <p>
                  I spend my days thinking about textures, origins, and the way light hits a ceramic plate. 
                  But my real work is creating the space where you feel safe enough to be curious.
                </p>
              </div>
              
              <div className="pt-10 text-center lg:text-left">
                <span className="font-cursive text-[#e86321] block" style={{ fontSize: '48px', lineHeight: '1' }}>Hyndavi</span>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] mt-4 text-white/40">
                  Founder · Host · Vantammayilu
                </p>
              </div>
              
              <p 
                className="font-heading italic text-center lg:text-left"
                style={{ paddingTop: '3rem', color: 'rgba(239,233,225,0.55)', fontSize: '16px' }}
              >
                If this feels like something you've been looking for, you're already welcome.
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .bg-grain {
          background: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
        }
      `}</style>
    </section>
  );
};

export default Host;
