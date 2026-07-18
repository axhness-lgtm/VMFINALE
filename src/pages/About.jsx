import { motion } from 'framer-motion';
import { Compass, Users, RefreshCw, Sparkles, Smile, MessageSquare, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import EdgeDivider from '../components/EdgeDivider';

export default function About() {
  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen hidden md:flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-primary)] pt-20 pb-12 no-reveal">

        {/* Aspect Ratio Box container widened */}
        <div 
          className="relative w-full max-w-7xl aspect-[16/10] min-h-[800px] z-10 mx-auto px-4 pb-8"
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

          {/* Top Headline - Fades in FIRST after 7 wonders (at delay 2.3s) */}
          <div className="absolute top-[2%] left-1/2 transform -translate-x-1/2 text-center w-full z-30">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 1 }}
              className="w-full"
            >
              <h2 className="text-lg md:text-xl font-body tracking-widest uppercase text-[var(--accent-primary)] mb-1 font-bold">The World Has</h2>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-logo text-[var(--text-main)] drop-shadow-sm">Seven Wonders.</h1>
              <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-normal not-italic text-[var(--accent-primary)] mt-4 md:mt-6 drop-shadow-sm">
                We believe there is an eighth!
              </p>
            </motion.div>
          </div>

          {/* 1. Great Wall (Top Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="absolute top-[12%] left-[6%] w-[22%] max-w-[260px] z-20">
            <img src="/a1.png" alt="Wonder 1" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 2. Petra (Mid Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="absolute top-[36%] left-[2%] w-[20%] max-w-[235px] z-20">
            <img src="/a2.png" alt="Wonder 2" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 3. Christ Redeemer (Bottom Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute bottom-[20%] left-[9%] w-[19%] max-w-[220px] z-20">
            <img src="/a3.png" alt="Wonder 3" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 4. Machu Picchu (Bottom Mid-Left) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="absolute bottom-[18%] left-[27%] w-[20%] max-w-[240px] z-20">
            <img src="/a4.png" alt="Wonder 4" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 5. Chichen Itza (Bottom Mid-Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }} className="absolute bottom-[18%] right-[27%] w-[20%] max-w-[240px] z-20">
            <img src="/a5.png" alt="Wonder 5" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 6. Colosseum (Bottom Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.8 }} className="absolute bottom-[20%] right-[9%] w-[21%] max-w-[250px] z-20">
            <img src="/a7.png" alt="Wonder 6" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>

          {/* 7. Taj Mahal (Mid Right) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0, duration: 0.8 }} className="absolute top-[18%] right-[4%] w-[22%] max-w-[260px] z-20">
            <img src="/a8.png" alt="Wonder 7" className="w-full h-auto object-contain hover:scale-105 transition-transform drop-shadow-md" />
          </motion.div>


          {/* 8. The Table (Center) - Fades in at the END after a 1 second gap from text (at delay 3.3s) */}
          <div className="absolute top-[44%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[34%] max-w-[390px] z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.3, duration: 1 }} className="w-full">
              <img src="/a9.png" alt="The Eighth Wonder - Table" className="w-full h-auto object-contain drop-shadow-xl" />
            </motion.div>
          </div>

        </div>
      </section>

      {/* Mobile Fallback */}
      <section className="relative md:hidden flex flex-col items-center justify-center pt-32 pb-20 px-6 bg-[var(--bg-primary)] overflow-hidden min-h-screen no-reveal">
        <div className="relative z-10 text-center w-full mb-12">
          <h2 className="text-lg font-body tracking-widest uppercase text-[var(--accent-primary)] mb-1 font-bold">The World Has</h2>
          <h1 className="text-5xl font-logo text-[var(--text-main)] drop-shadow-sm">Seven Wonders.</h1>
          <p className="text-xl font-heading font-normal not-italic text-[var(--accent-primary)] mt-2 drop-shadow-sm">We believe there is an eighth!</p>
        </div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1, y: [0, -10, 0] }} 
          transition={{ delay: 0.2, duration: 1, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }} 
          className="w-full flex justify-center"
        >
          <img src="/a9.png" alt="The Table" className="w-[90%] h-auto object-contain relative z-10 drop-shadow-xl mb-8" />
        </motion.div>
      </section>

      <EdgeDivider src="/edge4.png" />

      {/* 2. WHAT IS VANTAMMAYILU? */}
      <section className="min-h-screen py-24 md:py-32 bg-[var(--accent-primary)] relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 w-full flex-1 flex flex-col justify-center">
          <div className="text-center mb-14">
            <h2 className="text-5xl md:text-7xl font-heading text-white drop-shadow-sm">What is Vantammayilu?</h2>
          </div>

          <div className="w-full max-w-5xl mx-auto bg-[var(--bg-primary)] p-10 md:p-20 rounded-3xl shadow-2xl border-2 border-[var(--text-main)]/15 relative stitched-border overflow-hidden">
            <div className="masking-tape w-32 h-8 -top-4 left-1/2 -translate-x-1/2 rotate-1" />
            
            {/* Sketched Arrow pointing to question */}
            <div className="absolute top-8 -left-20 hidden lg:block rotate-12 opacity-80">
              <span className="handwritten-annotation absolute -top-8 -left-10 text-xl -rotate-12 w-32">The original idea</span>
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-12 mt-4">
                <path d="M5 35 C 20 5, 40 5, 55 20" stroke="var(--accent-primary)" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M45 18 L 56 21 L 52 10" stroke="var(--accent-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            
            {/* Coffee Stain */}
            <div className="absolute bottom-6 right-6 w-32 h-32 bg-[url('data:image/svg+xml;utf8,%3Csvg opacity=%220.08%22 xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22none%22 stroke=%22%234b2e21%22 stroke-width=%224%22 stroke-dasharray=%2210 2 20 4%22/%3E%3Ccircle cx=%2248%22 cy=%2252%22 r=%2238%22 fill=%22none%22 stroke=%22%234b2e21%22 stroke-width=%221%22 opacity=%220.5%22/%3E%3C/svg%3E')] bg-no-repeat bg-contain pointer-events-none" />

            <div className="font-body text-lg md:text-xl lg:text-2xl text-[var(--text-main)]/95 space-y-4 md:space-y-5 leading-relaxed not-italic relative z-10 font-normal">
              
              {/* Headline */}
              <motion.div 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
                className="font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--accent-primary)] font-bold pb-2 border-b border-[var(--text-main)]/10"
              >
                Food is where it begins. Never where it ends.
              </motion.div>

              {/* Body Paragraphs */}
              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                Every month, we choose a different part of the world and bring it to one table.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                Not just through its food, but through its stories, traditions, rituals and the people it inspires.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                Because we've always believed that a meal is more than something you eat.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
                className="font-semibold text-[var(--accent-primary)]"
              >
                It's one of the oldest ways humans have connected.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                Around every table, people arrive carrying different lives.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
                className="pl-6 border-l-2 border-[var(--accent-primary)]/40 italic space-y-1 my-3 text-base md:text-lg lg:text-xl text-[var(--text-main)]/85"
              >
                <p>Different childhoods.</p>
                <p>Different cities.</p>
                <p>Different cultures.</p>
                <p>Different memories.</p>
              </motion.div>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                Yet somehow, over a shared meal, those worlds begin to overlap.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                A story reminds someone of home.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                A flavour unlocks a forgotten memory.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                A place you've never been suddenly feels familiar because someone across the table has lived it.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                For a brief evening, eight different lives become part of the same conversation.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
              >
                And when everyone leaves, they don't just carry home memories of the food.
              </motion.p>

              <motion.p 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
                className="font-medium"
              >
                They leave with new perspectives, new friendships, new stories, and one more thread woven into their own.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
                className="pt-4 space-y-1 font-semibold text-[var(--accent-primary)] text-xl md:text-2xl"
              >
                <p>That's what Vantammayilu is.</p>
                <p className="font-normal text-base md:text-lg text-[var(--text-main)]/80">Not a dinner.</p>
                <p className="font-normal text-base md:text-lg text-[var(--text-main)]/80">Not a restaurant.</p>
                <p className="pt-1">But a place where people discover the world—and each other—one table at a time.</p>
              </motion.div>

              {/* Closing Statement */}
              <motion.div 
                initial={{ opacity: 0.2, y: 5 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: false, margin: "-10%" }} 
                transition={{ duration: 0.5 }}
                className="mt-8 pt-6 border-t border-[var(--text-main)]/15 font-heading text-2xl md:text-3xl lg:text-4xl text-[var(--accent-primary)] italic leading-snug"
              >
                <p>The food brings us together.</p>
                <p>The people are what stay with us.</p>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <EdgeDivider src="/edge2.png" />

      {/* 4. MEET THE HOST (HYNDAVI) */}
      <section className="py-20 md:py-24 bg-[var(--bg-primary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side: Photo graphic */}
            <div className="md:col-span-6 relative flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-lg overflow-hidden shadow-2xl relative z-10 rounded-2xl hover:scale-[1.02] transition-all duration-500"
              >
                <img src="/host.png" alt="Hyndavi Onimi" className="w-full h-auto object-contain" />
              </motion.div>
            </div>

            {/* Right side: Biography */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <span className="font-body italic text-3xl text-[var(--accent-primary)] -rotate-1 mb-4 block font-logo">The Founder</span>
              <h2 className="text-5xl font-heading text-[var(--text-main)] mb-8">Meet the host.</h2>
              
              <div className="font-body text-lg leading-relaxed space-y-6 text-[var(--text-main)]/85 max-w-xl">
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
              <div className="mt-8 pt-6 border-t border-[var(--text-main)]/15">
                <p className="font-body italic text-2xl text-[var(--text-main)]">— Hyndavi Onimi</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <EdgeDivider src="/edge3.png" />

      {/* 6. IF THIS SOUNDS LIKE YOUR KIND OF EVENING (CTA) */}
      <section className="py-20 md:py-24 bg-[var(--accent-primary)] relative text-center overflow-hidden flex flex-col items-center justify-center text-[#efe8db]">
        <div className="absolute inset-0 paper-texture opacity-20 mix-blend-multiply pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading text-[var(--bg-primary)] mb-6 leading-tight drop-shadow-sm"
          >
            If this sounds like your <br className="hidden md:inline" /> kind of evening...
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[var(--bg-primary)]/90 max-w-md mx-auto space-y-2 mb-12 italic">
            <p>There's always another table waiting.</p>
            <p className="font-heading text-white not-italic underline decoration-white/40 underline-offset-4">We'd love to save you a seat.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dinner"
              className="inline-block bg-[var(--bg-primary)] text-[var(--accent-primary)] border-2 border-[var(--bg-primary)] hover:bg-[var(--text-main)] hover:text-white hover:border-[var(--text-main)] px-8 py-3.5 text-sm md:text-base font-bold tracking-[0.15em] rounded-md shadow-xl transition-all duration-300 hover:scale-105 uppercase"
            >
              See upcoming dinners
            </Link>
          </motion.div>
        </div>
      </section>

      <EdgeDivider src="/edge4.png" />
    </div>
  );
}
