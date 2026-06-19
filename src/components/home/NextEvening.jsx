import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NextEvening = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const cardRef = useRef(null);
  const sectionRef = useRef(null);
  
  const seats = [
    { id: 1, taken: true }, { id: 2, taken: true }, 
    { id: 3, taken: false }, { id: 4, taken: true },
    { id: 5, taken: false }, { id: 6, taken: false }, 
    { id: 7, taken: true }, { id: 8, taken: false }
  ];

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, x: -20 },
      { 
        opacity: 1, x: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="section-light py-32 w-full relative">
      <div className="container mx-auto px-[5%] lg:px-[8%]">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 lg:gap-0 items-center">
          
          {/* Left Column: 55% */}
          <div className="w-full">
            <div ref={cardRef} className="editorial-card lg:border-r border-[#000]/10 lg:pr-16">
              <span className="text-mono text-[11px] uppercase tracking-[0.2em] opacity-40">Upcoming Dinner · June 14</span>
              <h2 className="text-[80px] font-heading font-light italic leading-tight my-6 text-black">Japanese Winter</h2>
              <p className="text-serif italic text-[24px] leading-relaxed text-black/70 max-w-[600px]">
                A celebration of quiet warmth. Seven bowls of precision and memory, 
                crafted to be shared by those who have never met. 
                A journey from Hokkaido to the heart of the table.
              </p>
            </div>
          </div>

          {/* Right Column: 45% */}
          <div className="w-full lg:pl-16 relative z-10">
            <div className="mb-16">
              <h3 className="text-mono text-[10px] uppercase tracking-[0.3em] mb-10 text-black">Select your seat</h3>
              <div className="grid grid-cols-4 grid-rows-2 gap-y-6 gap-x-4 max-w-[280px]">
                {seats.map((seat) => (
                  <div key={seat.id} className="flex flex-col items-center">
                    <button
                      disabled={seat.taken}
                      onClick={() => setSelectedSeat(seat.id)}
                      className={`
                        w-[40px] h-[40px] rounded-full transition-all duration-500
                        ${seat.taken ? 'bg-[#c8b8a8] cursor-not-allowed' : 
                          selectedSeat === seat.id ? 'bg-[#e86321] border border-[#e86321]' : 
                          'bg-transparent border border-[#e86321] hover:bg-[#e86321]/10 pulse-available'}
                      `}
                    />
                    <span className="text-mono text-[7px] mt-3 uppercase tracking-widest text-black/40">
                      {seat.taken ? 'taken' : `seat ${seat.id}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="group w-full max-w-[320px] py-6 border border-[#e86321] text-mono text-[9px] uppercase tracking-[0.3em] relative overflow-hidden transition-all duration-500 hover:bg-[#e86321] hover:text-white text-black block">
              Reserve your place at the table →
            </button>
            
            <p className="text-serif italic text-[14px] text-[#a49282] mt-6 max-w-[320px] text-center">
              You'll hear from Hyndavi personally.
            </p>
          </div>

        </div>
      </div>

      {/* watercolor stain texture overlay */}
      <div className="absolute top-0 right-0 w-[40%] h-full pointer-events-none opacity-[0.03] bg-radial-warm"></div>

      <style jsx>{`
        .bg-radial-warm {
          background: radial-gradient(circle at center, #e86321 0%, transparent 70%);
        }
        @keyframes pulse-available {
          0% { box-shadow: 0 0 0 0 rgba(228, 90, 11, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(228, 90, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(228, 90, 11, 0); }
        }
        .pulse-available {
          animation: pulse-available 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default NextEvening;
