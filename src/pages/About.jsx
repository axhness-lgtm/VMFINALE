import { motion } from 'framer-motion';
import { Compass, Users, RefreshCw, Sparkles, Smile, MessageSquare, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[calc(100vh-80px)] hidden md:flex flex-col items-center justify-center overflow-hidden bg-[#fdfaf6] pt-16">
        {/* Background Texture */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/texture.png"
            alt="paper texture"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-multiply"
          />
        </div>

        {/* Aspect Ratio Box container */}
        <div 
          className="relative w-full aspect-[16/10] max-h-[85vh] z-10 mx-auto"
          style={{ maxWidth: 'calc(85vh * 1.6)' }}
        >
          {/* Decorative Doodles from a to h */}
          <img src="/a.png" className="absolute top-[5%] left-[30%] w-[5%] object-contain opacity-70 pointer-events-none -rotate-12 mix-blend-multiply" alt="" />
          <img src="/b.png" className="absolute top-[20%] right-[15%] w-[6%] object-contain opacity-80 pointer-events-none rotate-12 mix-blend-multiply" alt="" />
          <img src="/c.png" className="absolute bottom-[25%] left-[2%] w-[4%] object-contain opacity-75 pointer-events-none -rotate-6 mix-blend-multiply" alt="" />
          <img src="/d.png" className="absolute bottom-[20%] right-[30%] w-[5%] object-contain opacity-60 pointer-events-none rotate-45 mix-blend-multiply" alt="" />
          <img src="/e.png" className="absolute top-[50%] left-[20%] w-[4%] object-contain opacity-70 pointer-events-none -rotate-45 mix-blend-multiply" alt="" />
          <img src="/f.png" className="absolute top-[10%] right-[35%] w-[5%] object-contain opacity-80 pointer-events-none rotate-12 mix-blend-multiply" alt="" />
          <img src="/g.png" className="absolute bottom-[10%] left-[25%] w-[5%] object-contain opacity-70 pointer-events-none -rotate-12 mix-blend-multiply" alt="" />
          <img src="/h.png" className="absolute bottom-[40%] right-[5%] w-[6%] object-contain opacity-80 pointer-events-none rotate-6 mix-blend-multiply" alt="" />

          {/* Top Headline - Fades in LAST */}
          <div className="absolute top-[2%] left-1/2 transform -translate-x-1/2 text-center w-full z-30">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 1 }}
              className="w-full"
            >
              <h2 className="text-lg md:text-xl font-body tracking-widest uppercase text-[#3b2b24] mb-1 font-bold">The World Has</h2>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-logo text-[var(--accent-primary)] drop-shadow-sm">Seven Wonders.</h1>
            </motion.div>
          </div>

          {/* 1. Great Wall (Top Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="absolute top-[15%] left-[3%] w-[32%] z-20">
            <img src="/one.png" alt="Wonder 1" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 2. Petra (Mid Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="absolute top-[43%] left-[1%] w-[28%] z-20">
            <img src="/two.png" alt="Wonder 2" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 3. Christ Redeemer (Bottom Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute bottom-[2%] left-[8%] w-[25%] z-20">
            <img src="/three.png" alt="Wonder 3" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 4. Machu Picchu (Bottom Mid-Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="absolute bottom-[2%] left-[26%] w-[28%] z-20">
            <img src="/four.png" alt="Wonder 4" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 5. Chichen Itza (Bottom Mid-Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} className="absolute bottom-[2%] right-[26%] w-[28%] z-20">
            <img src="/five.png" alt="Wonder 5" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 6. Colosseum (Bottom Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.8 }} className="absolute bottom-[5%] right-[6%] w-[32%] z-20">
            <img src="/six.png" alt="Wonder 6" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 7. Taj Mahal (Mid Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.8 }} className="absolute top-[25%] right-[2%] w-[35%] z-20">
            <img src="/seven (2).png" alt="Wonder 7" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 9. The Eighth Wonder Text (Above Table) */}
          <div className="absolute top-[28%] left-1/2 transform -translate-x-1/2 w-[35%] z-30">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6, duration: 1 }} className="w-full">
              <img src="/nine.png" alt="Where the world comes together" className="w-full h-auto object-contain drop-shadow-sm" />
            </motion.div>
          </div>

          {/* 8. The Table (Center) */}
          <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[55%] z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.3, duration: 1 }} className="w-full">
              <img src="/eight.png" alt="The Eighth Wonder - Table" className="w-full h-auto object-contain drop-shadow-xl" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Mobile Fallback */}
      <section className="relative md:hidden flex flex-col items-center justify-center pt-32 pb-20 px-6 bg-[#fdfaf6] overflow-hidden min-h-[70vh]">
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/texture.png"
            alt="paper texture"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center w-full mb-12">
          <h2 className="text-lg font-body tracking-widest uppercase text-[#3b2b24] mb-1 font-bold">The World Has</h2>
          <h1 className="text-5xl font-logo text-[var(--accent-primary)] drop-shadow-sm">Seven Wonders.</h1>
        </div>
        <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }} src="/eight.png" alt="The Table" className="w-[90%] h-auto object-contain relative z-10 drop-shadow-xl mb-8" />
        <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} src="/nine.png" alt="The Eighth Wonder" className="w-[70%] h-auto object-contain relative z-10 drop-shadow-sm" />
      </section>

      {/* 2. WHY VANTAMMAYILU? */}
      <section className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">Why Vantammayilu?</h2>
          </div>

          <div className="max-w-2xl mx-auto bg-[var(--bg-primary)] p-8 md:p-12 rounded-3xl shadow-xl border border-[var(--text-main)]/10 relative stitched-border">
            <div className="masking-tape w-24 h-6 -top-3 left-1/2 -translate-x-1/2 rotate-1" />
            
            {/* Sketched Arrow pointing to question */}
            <div className="absolute top-8 -left-20 hidden lg:block rotate-12 opacity-80">
              <span className="handwritten-annotation absolute -top-8 -left-10 text-xl -rotate-12 w-32">The original idea</span>
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-12 mt-4">
                <path d="M5 35 C 20 5, 40 5, 55 20" stroke="var(--accent-primary)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M45 18 L 56 21 L 52 10" stroke="var(--accent-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            {/* Coffee Stain */}
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-[url('data:image/svg+xml;utf8,%3Csvg opacity=%220.08%22 xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22none%22 stroke=%22%234b2e21%22 stroke-width=%224%22 stroke-dasharray=%2210 2 20 4%22/%3E%3Ccircle cx=%2248%22 cy=%2252%22 r=%2238%22 fill=%22none%22 stroke=%22%234b2e21%22 stroke-width=%221%22 opacity=%220.5%22/%3E%3C/svg%3E')] bg-no-repeat bg-contain pointer-events-none" />

            <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/90 space-y-8 leading-relaxed italic relative z-10">
              <p>"Growing up, food was never just about eating.</p>
              <p>It was how stories were told.</p>
              <p>How people stayed longer.</p>
              <p>How strangers became guests, and guests felt at home.</p>
              <p>Over time, that feeling grew into a question:</p>
              <p className="font-heading text-3xl text-[var(--accent-primary)] not-italic mt-6 pt-6 border-t border-[var(--text-main)]/10">
                What if more people had a place to experience that?
              </p>
              <p className="not-italic text-[var(--text-main)] font-semibold text-lg md:text-xl pt-2">
                That's how Vantammayilu began."
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 4. MEET THE HOST (HYNDAVI) */}
      <section className="py-32 bg-[var(--accent-primary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Photo card */}
            <div className="md:col-span-5 relative">
              <div className="masking-tape w-24 h-6 -top-2 left-1/2 -translate-x-1/2 rotate-1 z-30 opacity-80" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-[3/4] overflow-hidden torn-edge shadow-2xl filter grayscale hover:grayscale-0 transition-all duration-700 relative z-10 polaroid-frame hover-lift"
              >
                <img src="/herofordinner.jpeg" alt="Hyndavi Onimi" className="w-full h-full object-cover" />
              </motion.div>
              <span className="handwritten-annotation absolute -bottom-8 right-0 -rotate-6 z-20 text-3xl text-[#fcf8f2]">Hyndavi</span>
              {/* Pressed flower illustration instead of emoji sticker */}
              <div className="absolute -top-8 -left-8 w-24 h-24 z-20 rotate-[-15deg] opacity-80 select-none pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 80 Q52 50 48 20" stroke="#fcf8f2" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  <path d="M50 50 Q70 40 50 30 Q30 40 50 50" fill="#fcf8f2" fillOpacity="0.8"/>
                  <path d="M50 50 Q65 60 45 65 Q35 50 50 50" fill="#fcf8f2" fillOpacity="0.8"/>
                  <path d="M50 50 Q30 40 40 25 Q55 35 50 50" fill="#fcf8f2" fillOpacity="0.8"/>
                </svg>
              </div>
            </div>

            {/* Right side: Biography */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <span className="font-body italic text-3xl text-[#fcf8f2] -rotate-1 mb-4 block font-logo">The Founder</span>
              <h2 className="text-5xl font-heading text-[#fcf8f2] mb-8">Meet the host.</h2>
              
              <div className="font-body text-lg leading-relaxed space-y-6 text-[#fcf8f2]/90 max-w-xl">
                <p>Hi, I'm Hyndavi.</p>
                <p>
                  I started Vantammayilu because I wanted to create the kind of evenings I wished existed.
                  A place where people could slow down, try something unfamiliar, and leave feeling a little more connected—to the world and to each other.
                </p>
                <p>
                  You'll usually find me in the kitchen, adjusting the playlist, plating the next course or making sure everyone has enough to eat.
                  Mostly, I'm just happy to see a table full of people who didn't know each other a few hours ago.
                </p>
              </div>

              {/* Signature touch */}
              <div className="mt-8 pt-6 border-t border-[#fcf8f2]/30">
                <p className="font-body italic text-2xl text-[#fcf8f2]">— Hyndavi Onimi</p>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 6. IF THIS SOUNDS LIKE YOUR KIND OF EVENING (CTA) */}
      <section className="py-32 bg-[var(--bg-secondary)] relative text-center overflow-hidden flex flex-col items-center justify-center">
        {/* Soft background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading text-[var(--text-main)] mb-6 leading-tight"
          >
            If this sounds like your <br className="hidden md:inline" /> kind of evening...
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 max-w-md mx-auto space-y-2 mb-12 italic">
            <p>There's always another table waiting.</p>
            <p className="font-heading text-[var(--accent-primary)] not-italic">We'd love to save you a seat.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dinner"
              className="group relative inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/5 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-10 py-5 font-body text-lg font-bold tracking-wide"
            >
              See upcoming dinners
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
