import { motion } from 'framer-motion';
import { Compass, Users, RefreshCw, Sparkles, Smile, MessageSquare, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-40 pb-20 px-6 lg:px-16 overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col justify-center relative z-20">
            <span className="text-[var(--accent-primary)] font-body tracking-[0.25em] uppercase text-xs mb-6 block font-bold">
              ABOUT VANTAMMAYILU
            </span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading leading-[1.05] text-[var(--text-main)] mb-8">
              It started with <br/>a simple idea.
            </h1>
            <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 max-w-2xl space-y-4 leading-relaxed">
              <p>That the best way to discover the world isn't always by travelling.</p>
              <p className="italic text-[var(--accent-primary)]">Sometimes, it begins with inviting people over for dinner.</p>
            </div>
          </div>

          {/* Hero Image / Collage */}
          <div className="lg:col-span-5 relative w-full h-[45vh] lg:h-[65vh] flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] aspect-[4/5] scrap-img rotate-2 hover-lift">
              {/* Tape */}
              <div className="masking-tape w-24 h-8 -top-4 right-1/4 -rotate-3" />
              
              {/* Subtle map fragment behind image */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[url('data:image/svg+xml;utf8,%3Csvg opacity=%220.1%22 xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath fill=%22none%22 stroke=%22%233b2b24%22 stroke-width=%220.5%22 d=%22M10,10 Q30,20 50,10 T90,10 M10,30 Q30,40 50,30 T90,30 M10,50 Q30,60 50,50 T90,50 M10,70 Q30,80 50,70 T90,70 M10,90 Q30,100 50,90 T90,90 M30,10 L30,90 M70,10 L70,90%22/%3E%3C/svg%3E')] rotate-[-10deg] -z-10" />

              <img 
                src="/hero-collage.png" 
                alt="Marrakech Collage" 
                className="relative z-10 w-full h-full object-cover torn-edge shadow-xl"
              />
              
              {/* Postage Stamp Overlay */}
              <div className="absolute top-6 left-6 z-20 stamp bg-[var(--bg-secondary)] shadow-sm rotate-[-12deg]">
                Vizag 11/25
              </div>

              {/* Handwritten Note Overlay */}
              <div className="absolute bottom-4 right-4 z-20 bg-[#f9f6f0] px-4 py-2 border border-[var(--text-main)]/10 shadow-md text-sm font-logo text-[var(--accent-primary)] rotate-[-2deg] torn-edge">
                <div className="masking-tape w-8 h-4 -top-2 left-1/2 -translate-x-1/2 rotate-1" />
                Visakhapatnam, circa 2025
              </div>
            </div>
          </div>
        </div>
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

      {/* 3. MORE THAN A DINNER (THREE PRINCIPLES) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-24">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Principles</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">More than a dinner.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Explore */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#faf8f5] p-8 border border-[var(--text-main)]/10 shadow-sm flex flex-col justify-between min-h-[280px] hover-lift ticket-edge rotate-[-1deg] relative"
            >
              <div className="masking-tape w-16 h-4 -top-2 left-6 rotate-2" />
              <div className="absolute -top-4 -right-2 stamp rotate-[15deg] opacity-60 z-10 scale-75 bg-[var(--bg-primary)]">EXPL</div>
              <div className="flex items-center gap-3 text-[var(--accent-primary)] mb-6">
                <Compass size={24} />
                <h3 className="font-heading text-3xl text-[var(--text-main)]">Explore.</h3>
              </div>
              <p className="font-body text-lg text-[var(--text-main)]/80 leading-relaxed">
                Every dinner is inspired by a different place, its food, its culture and the stories behind it.
              </p>
              <div className="w-full border-t border-dashed border-[var(--text-main)]/20 mt-6 pt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-[var(--text-main)]/45">
                <span>Module 01</span>
                <span className="font-mono text-[var(--accent-primary)]/60">TRV-01</span>
              </div>
            </motion.div>

            {/* Connect */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#faf8f5] p-8 border border-[var(--text-main)]/10 shadow-sm flex flex-col justify-between min-h-[280px] hover-lift ticket-edge rotate-[1deg] relative"
            >
              <div className="masking-tape w-16 h-4 -bottom-2 right-6 -rotate-2" />
              <div className="absolute -bottom-2 -left-4 stamp rotate-[-10deg] opacity-50 z-10 scale-75 bg-[var(--bg-primary)]">PEOPLE</div>
              <div className="flex items-center gap-3 text-[var(--accent-primary)] mb-6">
                <Users size={24} />
                <h3 className="font-heading text-3xl text-[var(--text-main)]">Connect.</h3>
              </div>
              <p className="font-body text-lg text-[var(--text-main)]/80 leading-relaxed">
                The best part of the evening isn't planned. It's the conversation that happens somewhere between the first course and dessert.
              </p>
              <div className="w-full border-t border-dashed border-[var(--text-main)]/20 mt-6 pt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-[var(--text-main)]/45">
                <span>Module 02</span>
                <span className="font-mono text-[var(--accent-primary)]/60">CON-02</span>
              </div>
            </motion.div>

            {/* Return */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#faf8f5] p-8 border border-[var(--text-main)]/10 shadow-sm flex flex-col justify-between min-h-[280px] hover-lift ticket-edge rotate-[0deg] relative"
            >
              <div className="masking-tape w-16 h-4 -top-2 right-12 rotate-[-1deg]" />
              <div className="flex items-center gap-3 text-[var(--accent-primary)] mb-6">
                <RefreshCw size={24} />
                <h3 className="font-heading text-3xl text-[var(--text-main)]">Return.</h3>
              </div>
              <p className="font-body text-lg text-[var(--text-main)]/80 leading-relaxed">
                Not because the menu repeats. But because the feeling stays with you.
              </p>
              <div className="w-full border-t border-dashed border-[var(--text-main)]/20 mt-6 pt-4 flex justify-between items-center text-[10px] uppercase tracking-widest text-[var(--text-main)]/45">
                <span>Module 03</span>
                <span className="font-mono text-[var(--accent-primary)]/60">RET-03</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. MEET THE HOST (HYNDAVI) */}
      <section className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Photo card */}
            <div className="md:col-span-5 relative">
              <div className="masking-tape w-24 h-6 -top-2 left-1/2 -translate-x-1/2 rotate-1 z-30" />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-[3/4] overflow-hidden torn-edge shadow-2xl filter grayscale hover:grayscale-0 transition-all duration-700 relative z-10 polaroid-frame hover-lift"
              >
                <img src="/herofordinner.jpeg" alt="Hyndavi Onimi" className="w-full h-full object-cover" />
              </motion.div>
              <span className="handwritten-annotation absolute -bottom-8 right-0 -rotate-6 z-20 text-3xl">Hyndavi</span>
              {/* Pressed flower illustration instead of emoji sticker */}
              <div className="absolute -top-8 -left-8 w-24 h-24 z-20 rotate-[-15deg] opacity-80 select-none pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 80 Q52 50 48 20" stroke="#78866B" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M50 50 Q70 40 50 30 Q30 40 50 50" fill="#EAD5A8" fillOpacity="0.7"/>
                  <path d="M50 50 Q65 60 45 65 Q35 50 50 50" fill="#EAD5A8" fillOpacity="0.7"/>
                  <path d="M50 50 Q30 40 40 25 Q55 35 50 50" fill="#EAD5A8" fillOpacity="0.7"/>
                </svg>
              </div>
            </div>

            {/* Right side: Biography */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <span className="font-body italic text-3xl text-[var(--accent-primary)] -rotate-1 mb-4 block font-logo">The Founder</span>
              <h2 className="text-5xl font-heading text-[var(--text-main)] mb-8">Meet the host.</h2>
              
              <div className="font-body text-lg leading-relaxed space-y-6 text-[var(--text-main)]/80 max-w-xl">
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
              <div className="mt-8 pt-6 border-t border-[var(--text-main)]/10">
                <p className="font-body italic text-2xl text-[var(--accent-primary)]">— Hyndavi Onimi</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHAT WE'RE REALLY SERVING (CATALOG GRID) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-24">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Offerings</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">What we're really serving.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: "Curiosity.", icon: <Sparkles size={18} />, rot: "rotate-[-1deg]" },
              { title: "Conversation.", icon: <MessageSquare size={18} />, rot: "rotate-[2deg]" },
              { title: "A reason to host your own friends.", icon: <Smile size={18} />, rot: "rotate-[0deg]" },
              { title: "Stories you'll retell.", icon: <Bookmark size={18} />, rot: "rotate-[1deg]" },
              { title: "A place you'll think about later.", icon: <Heart size={18} />, rot: "rotate-[-2deg]" },
              { title: "A reminder that trying something new is always worth it.", icon: <Sparkles size={18} />, rot: "rotate-[1deg]" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className={`p-6 bg-[#fafafa] rounded-md border border-[var(--text-main)]/10 flex flex-col justify-between h-44 shadow-md ${item.rot} hover-lift relative`}
              >
                {/* Small tape detail */}
                <div className="absolute w-8 h-3 bg-[var(--bg-secondary)] border border-[var(--text-main)]/5 -top-1 left-1/2 -translate-x-1/2 rotate-1 shadow-sm opacity-60" />
                
                <div className="flex justify-between items-center text-[var(--accent-primary)] relative z-10">
                  {item.icon}
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-main)]/30 border border-dashed border-[var(--text-main)]/20 p-1 rounded-sm">Stamp #{idx+1}</span>
                </div>
                <h3 className="font-body text-xl font-bold text-[var(--text-main)] leading-snug relative z-10">
                  {item.title}
                </h3>
              </motion.div>
            ))}
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
