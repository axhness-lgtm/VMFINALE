import React, { useRef } from 'react';

const cardsData = [
  { text: '"She read her poem before the harissa was served."', meta: 'Morocco Evening' },
  { text: '"The quiet before the first course. The only sound was the pouring of wine."', meta: 'Japanese Winter' },
  { text: 'A hand-drawn sketch of the long table, left behind on a napkin.', meta: 'Founders Note' },
  { text: '"Nobody wanted the evening to end."', meta: 'Late Night Talks' },
  { text: 'Candlelight and conversation stretching into the early hours.', meta: 'Italian Dusk' },
];

const JournalPreview = () => {
  const scrollContainerRef = useRef(null);

  // Optional: add mouse wheel scrolling support for horizontal container
  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <section className="bg-[#0d0804] py-32 overflow-hidden flex flex-col relative w-full">
      <div className="px-[5%] lg:px-[8%] mb-16 flex flex-col">
        <span className="text-mono text-[10px] uppercase tracking-[0.3em] text-[#e86321] mb-4">The Archive</span>
        <h2 className="text-[56px] font-heading font-light italic text-white leading-tight">Fragments from Past Evenings</h2>
      </div>

      <div className="w-full">
        {/* Native horizontal scroll container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-[16px] px-[5%] lg:px-[8%] pb-12 pt-8 hide-scrollbar scroll-smooth"
          style={{ padding: '2rem 8%' }}
          onWheel={handleWheel}
        >
          {cardsData.map((card, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 flex flex-col justify-between"
              style={{
                width: '240px',
                minHeight: '320px',
                background: '#f5efe7',
                border: '0.5px solid rgba(26,18,8,0.12)',
                padding: '1.5rem',
                transform: `rotate(${i % 2 === 0 ? '-1.5deg' : '1.5deg'})`,
                transition: 'transform 0.4s ease',
              }}
            >
              <div className="flex-1 flex items-center justify-center py-6">
                <p className="text-serif italic font-light text-[18px] text-[#1a1208] text-center leading-relaxed">
                  {card.text}
                </p>
              </div>
              <div className="mt-8 border-t border-[#1a1208]/10 pt-4 flex justify-center">
                <span className="text-mono text-[8px] uppercase tracking-widest text-[#1a1208]/50">
                  {card.meta}
                </span>
              </div>
            </div>
          ))}

          {/* Last Card */}
          <div 
            className="flex-shrink-0 flex items-center justify-center group cursor-pointer"
            style={{
              width: '240px',
              minHeight: '320px',
              background: '#e86321',
              padding: '1.5rem',
              transform: 'rotate(-1.5deg)',
              transition: 'transform 0.4s ease',
            }}
          >
            <a href="/journal" className="text-white text-serif italic font-light text-[22px] group-hover:scale-105 transition-transform">
              More from the journal →
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default JournalPreview;
