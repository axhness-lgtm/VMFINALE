import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Music, Film, Compass, Disc, MapPin, Coffee, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

const editorialCards = [
  {
    num: "01",
    title: "The conversations that only happen after dessert",
    desc: "Sometimes all a table needs is enough time.",
    category: "Reflections",
    img: "/herofordinner.jpeg",
    rot: "-rotate-1"
  },
  {
    num: "02",
    title: "A recipe we keep coming back to",
    desc: "Because some dishes deserve another evening.",
    category: "Recipes",
    img: "/sushi_platter.jpg",
    rot: "rotate-2"
  },
  {
    num: "03",
    title: "The city that inspired this month's dinner",
    desc: "A place that stayed with us long after we left.",
    category: "Travel",
    img: "/italy_pasta_table.png",
    rot: "-rotate-2"
  },
  {
    num: "04",
    title: "Things guests left behind",
    desc: "Not everything fits into a bag when you leave.",
    category: "Observations",
    img: "/hero-collage.png",
    rot: "rotate-1"
  }
];

const tinyObservations = [
  "People always ask for the playlist.",
  "Someone always stays back to help clean up.",
  "Every dinner has one unforgettable conversation.",
  "The loudest laughter usually comes from strangers.",
  "Recipes are rarely written exactly the same twice.",
  "The candles always burn longer than expected."
];

export default function Journal() {
  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col lg:flex-row items-center px-6 lg:px-16 overflow-hidden bg-[#f4ebd9] z-0 pt-24 pb-12 lg:py-0">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 paper-texture opacity-50 mix-blend-multiply pointer-events-none" />
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 relative z-10 w-full">
          
          {/* LEFT COLUMN: TEXT & FLORALS */}
          <div className="flex flex-col justify-center relative pt-12 lg:pt-0 max-w-xl">
            {/* Date Stamp Overlay */}
            <div className="absolute -top-8 left-4 md:-top-12 md:left-8 stamp rotate-[-8deg] opacity-70 border-dashed border-2 border-[#cc785c] text-[#cc785c] px-3 py-1 font-mono text-xs tracking-widest bg-transparent">
              VOL 04 <br/> 2025
            </div>
            
            <span className="text-[#c16e4f] font-body tracking-[0.2em] uppercase text-xs mb-4 block font-bold">
              THE JOURNAL
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-body leading-[1.1] text-[#2c2b29] mb-8">
              The evening doesn't end <br className="hidden md:inline" />
              <span className="relative inline-block mt-2 md:mt-0">
                when everyone leaves.
                <svg className="absolute w-[90%] h-3 -bottom-3 left-[5%] text-[#c16e4f] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M5,5 Q40,8 95,5" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="font-body text-xl md:text-[1.35rem] text-[#2c2b29] max-w-md leading-relaxed mb-10">
              Stories, recipes, places, conversations and little things worth holding on to.
            </p>
            
            <div>
              <a 
                href="#featured-essays" 
                className="inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/10 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-6 py-3 font-body text-[1.05rem]"
              >
                Read the latest entry
              </a>
            </div>

            {/* Bottom Left Decoration (Flowers) */}
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              src="/journal4.png" 
              alt="Floral decoration" 
              className="absolute -bottom-12 -left-8 lg:-bottom-20 lg:-left-12 w-24 md:w-32 lg:w-40 object-contain mix-blend-multiply opacity-90 pointer-events-none"
            />
            
            {/* Bottom Right Decoration (Olive Branch) */}
            <motion.img 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              src="/journal3.png" 
              alt="Olive branch" 
              className="absolute -bottom-8 right-12 lg:-bottom-12 lg:right-4 w-16 md:w-24 lg:w-28 object-contain mix-blend-multiply opacity-90 pointer-events-none"
            />
          </div>

          {/* RIGHT COLUMN: MAIN ILLUSTRATION */}
          <div className="relative flex items-center justify-center min-h-[50vh] lg:min-h-0 w-full mt-12 lg:mt-0">
            <motion.img 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src="/journal1.png" 
              alt="People at dinner table illustration" 
              className="w-full lg:w-[110%] max-w-none object-contain mix-blend-multiply drop-shadow-sm -mr-0 lg:-mr-8 pointer-events-none"
            />
            
            {/* Extra scattered elements around the main illustration */}
            <motion.img 
              initial={{ opacity: 0, rotate: -15 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              src="/journal2.png" 
              alt="Scrap note" 
              className="absolute bottom-[5%] left-[20%] w-24 md:w-32 object-contain mix-blend-multiply pointer-events-none"
            />
            <motion.img 
              initial={{ opacity: 0, rotate: 15 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              src="/journal5.png" 
              alt="Small decoration" 
              className="absolute bottom-[10%] right-[15%] w-20 md:w-28 object-contain mix-blend-multiply pointer-events-none"
            />
          </div>

        </div>
      </section>

      {/* 2. RECENTLY FROM THE TABLE (EDITORIAL CARDS) */}
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center bg-[var(--bg-secondary)] overflow-hidden z-10 shadow-2xl">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2">Recent Entries</span>
            <h2 className="text-5xl md:text-6xl font-body text-[var(--text-main)]">Recently from the table</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {editorialCards.map((card, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className={`bg-[var(--bg-primary)] p-5 shadow-xl border border-[var(--text-main)]/5 flex flex-col justify-between scrap-img ${card.rot} hover-lift relative torn-edge group z-10 polaroid-frame`}
              >
                {/* Bookmark ribbon on alternating items */}
                {i % 2 !== 0 && <div className="bookmark-ribbon" />}
                
                {/* Tape on alternating items */}
                {i % 2 === 0 && <div className="masking-tape w-16 h-4 -top-2 left-1/2 -translate-x-1/2 rotate-1" />}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body text-xs uppercase tracking-widest text-[var(--accent-primary)] font-bold">{card.category}</span>
                    <span className="font-mono text-xs text-[var(--text-main)]/30 border border-dashed border-[var(--text-main)]/20 p-1">No.{card.num}</span>
                  </div>

                  <div className="aspect-[4/3] overflow-hidden mb-6 shadow-inner torn-edge filter grayscale-[0.2] relative">
                    <img src={card.img} alt={card.title} className="w-full h-full object-cover filter sepia-[0.15] group-hover:scale-105 transition-transform duration-700" />
                    {i === 1 && <span className="handwritten-annotation absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl rotate-[-15deg] bg-white/80 px-2 py-1 shadow-sm hidden group-hover:block">Must read!</span>}
                  </div>

                  <h3 className="font-body text-xl font-bold text-[var(--text-main)] mb-3 leading-snug relative inline-block">
                    {card.title}
                    {/* Animated Underline */}
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[2px] bg-[var(--accent-primary)]/40 transition-all duration-500 group-hover:w-full"></span>
                  </h3>
                </div>
                
                <p className="font-body text-sm text-[var(--text-main)]/70 italic mt-4 border-t border-dashed border-[var(--text-main)]/15 pt-4">
                  {card.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TINY OBSERVATIONS (PLAYFUL LIST) */}
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-[var(--bg-primary)] z-20 shadow-2xl">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-20">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2">Gathered Thoughts</span>
            <h2 className="text-5xl md:text-6xl font-body text-[var(--text-main)]">Tiny observations</h2>
            <p className="font-body text-lg text-[var(--text-main)]/60 mt-4">One line. One thought.</p>
          </div>

          {/* Notebook Spiral Margin grid layout */}
          <div className="bg-[#fdfaf5] rounded-r-xl border border-[var(--text-main)]/10 shadow-2xl p-8 md:p-12 relative max-w-3xl mx-auto notebook-paper torn-edge">
            {/* Spiral binding rings */}
            <div className="absolute top-0 bottom-0 left-0 w-8 flex flex-col justify-evenly py-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-8 h-2 bg-zinc-400 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] relative -ml-2">
                  <div className="absolute right-2 top-0 bottom-0 w-1 bg-zinc-800 opacity-30"></div>
                </div>
              ))}
            </div>

            {/* Hanging paper details (red margin lines) */}
            <div className="absolute top-0 bottom-0 left-12 border-l-2 border-red-400/30 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-14 border-l border-red-400/20 pointer-events-none" />

            {/* Coffee Stain */}
            <div className="absolute -top-10 -right-10 w-32 h-32 coffee-ring opacity-40 rotate-[120deg]" />

            <ul className="space-y-8 pl-12 md:pl-20 relative z-10">
              {tinyObservations.map((obs, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="font-body text-xl md:text-2xl text-[var(--text-main)] leading-relaxed flex items-start gap-4 relative group"
                >
                  <span className="text-[var(--accent-primary)] select-none mt-1 opacity-50">✦</span>
                  <span className="border-b border-blue-900/10 pb-1">{obs}</span>
                  
                  {/* Handwritten arrows/doodles on specific items */}
                  {idx === 2 && (
                    <span className="absolute -right-12 top-0 handwritten-note rotate-12 opacity-0 group-hover:opacity-100 transition-opacity">
                      ← true!
                    </span>
                  )}
                  {idx === 5 && (
                    <span className="absolute -bottom-6 left-12 handwritten-note rotate-[-5deg] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      (we need more candles)
                    </span>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. FROM OUR NOTEBOOK (MIX OF VISUAL & WRITTEN) */}
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center bg-[var(--bg-secondary)] overflow-hidden z-30 shadow-2xl">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-24">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2">Scrap Notes</span>
            <h2 className="text-5xl md:text-6xl font-body text-[var(--text-main)]">From our notebook</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            
            {/* Places we're thinking about */}
            <div className="p-8 bg-[#fafafa] border border-[var(--text-main)]/10 shadow-md relative rotate-[-1deg] torn-edge hover-lift flex flex-col justify-between">
              <div className="masking-tape w-20 h-6 -top-3 left-6 rotate-6" />
              <div>
                <div className="flex items-center justify-center text-[var(--accent-primary)] mb-4">
                  <Compass size={22} />
                </div>
                <h3 className="font-heading text-center font-bold text-2xl text-[var(--text-main)] mb-2 uppercase tracking-widest border-y border-double border-[var(--text-main)]/20 py-2">Places</h3>
                <ul className="space-y-3 font-body text-lg text-[var(--text-main)]/80 italic mt-6 columns-1">
                  {["Lisbon.", "Oaxaca.", "Kyoto.", "George Town.", "Istanbul.", "Marrakech."].map((place, idx) => (
                    <li key={idx} className="border-b border-dashed border-[var(--text-main)]/15 pb-1 text-center">
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Things we're cooking */}
            <div className="p-8 bg-[#faf8f5] border border-amber-900/10 shadow-md relative rotate-[2deg] torn-edge hover-lift flex flex-col justify-between">
              <div className="masking-tape w-20 h-6 -top-3 right-6 -rotate-3" />
              <div>
                <div className="flex items-center justify-center text-[var(--accent-primary)] mb-4">
                  <Utensils size={22} />
                </div>
                <h3 className="font-heading text-center font-bold text-2xl text-[var(--text-main)] mb-2 uppercase tracking-widest border-y border-double border-[var(--text-main)]/20 py-2">Cooking</h3>
                <ul className="space-y-3 font-body text-lg text-[var(--text-main)]/80 italic mt-6 columns-1">
                  {["Fresh pasta.", "Pho.", "Bibimbap.", "Paella.", "Ratatouille."].map((dish, idx) => (
                    <li key={idx} className="border-b border-dashed border-[var(--text-main)]/15 pb-1 text-center">
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Things we're listening to */}
            <div className="p-8 bg-zinc-50 border border-zinc-200 shadow-md relative rotate-[-2deg] torn-edge hover-lift flex flex-col justify-between">
              <div className="masking-tape w-20 h-6 -top-3 left-1/2 -translate-x-1/2 rotate-1" />
              <div>
                <div className="flex items-center justify-center text-[var(--accent-primary)] mb-4">
                  <Disc size={22} />
                </div>
                <h3 className="font-heading text-center font-bold text-2xl text-[var(--text-main)] mb-2 uppercase tracking-widest border-y border-double border-[var(--text-main)]/20 py-2">Listening</h3>
                <ul className="space-y-3 font-body text-lg text-[var(--text-main)]/80 italic mt-6 columns-1 text-center">
                  {[
                    "Jazz while cooking.",
                    "Vinyl on rainy evenings.",
                    "Old Bollywood while cleaning up.",
                    "Acoustic guitar after dessert."
                  ].map((track, idx) => (
                    <li key={idx} className="border-b border-dashed border-[var(--text-main)]/15 pb-1">
                      {track}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WORTH SHARING (LONGER STORIES INTROS) */}
      <section id="featured-essays" className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden bg-[var(--bg-primary)] z-40 shadow-2xl">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-24">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2">Longer Reads</span>
            <h2 className="text-5xl md:text-6xl font-body text-[var(--text-main)]">Worth sharing</h2>
          </div>

          <div className="space-y-16">
            {[
              {
                title: "How food changes the way strangers meet",
                desc: "Sometimes it's easier to talk when everyone is passing the same bowl."
              },
              {
                title: "Hosting taught us to slow down",
                desc: "The best evenings were never rushed."
              },
              {
                title: "The best souvenir is a recipe",
                desc: "Some places stay with you through what you cook."
              }
            ].map((story, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group border-b border-dashed border-[var(--text-main)]/20 pb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="max-w-2xl relative">
                  {/* Subtle scribble marker on hover */}
                  <span className="absolute -left-6 top-2 text-[var(--accent-primary)] font-logo text-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    *
                  </span>
                  <h3 className="font-body font-bold text-3xl md:text-4xl text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition-colors duration-300">
                    {story.title}
                  </h3>
                  <p className="font-body text-lg text-[var(--text-main)]/70 mt-3">
                    {story.desc}
                  </p>
                </div>
                <button className="flex items-center gap-2 font-body text-xs uppercase tracking-widest text-[var(--text-main)]/60 hover:text-[var(--accent-primary)] font-bold transition-colors">
                  Read story
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CURRENTLY INSPIRING US (LIVING MOODBOARD) */}
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center bg-[var(--bg-secondary)] overflow-hidden z-50 shadow-2xl">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2">Moodboard</span>
            <h2 className="text-5xl md:text-6xl font-body text-[var(--text-main)]">Currently inspiring us</h2>
          </div>

          {/* Living Moodboard tags scattered */}
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {[
              { text: "Books", icon: <BookOpen size={16} />, rot: "rotate-2" },
              { text: "Films", icon: <Film size={16} />, rot: "-rotate-2" },
              { text: "Markets", icon: <Compass size={16} />, rot: "rotate-3" },
              { text: "Restaurants", icon: <Coffee size={16} />, rot: "-rotate-1" },
              { text: "Music", icon: <Music size={16} />, rot: "rotate-1" },
              { text: "Travel", icon: <Compass size={16} />, rot: "-rotate-3" },
              { text: "Art", icon: <BookOpen size={16} />, rot: "rotate-2" },
              { text: "People", icon: <Coffee size={16} />, rot: "-rotate-2" }
            ].map((tag, idx) => (
              <motion.div
                key={idx}
                className={`relative px-8 py-5 bg-[#fafafa] border border-[var(--text-main)]/10 shadow-md font-body font-bold text-2xl text-[var(--text-main)] flex items-center gap-3 cursor-pointer ${tag.rot} hover-lift torn-edge`}
              >
                {/* Push Pin on specific items, Tape on others */}
                {idx % 3 === 0 ? (
                  <div className="push-pin" />
                ) : (
                  <div className="masking-tape w-10 h-3 -top-1 left-1/2 -translate-x-1/2 rotate-2 opacity-70" />
                )}
                
                <span className="text-[var(--accent-primary)]">{tag.icon}</span>
                <span>{tag.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. UNTIL NEXT TIME (CTA) */}
      <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden bg-[var(--bg-primary)] z-[60] shadow-2xl">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-body text-[var(--text-main)] mb-10 leading-tight"
          >
            Until next time.
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 max-w-xl mx-auto space-y-4 mb-16 italic border-l-2 border-[var(--accent-primary)]/20 pl-6 md:pl-10 text-left">
            <p>The table will be set again soon.</p>
            <p className="not-italic text-[var(--text-main)] font-semibold mt-4">Until then,</p>
            <p className="font-body font-bold text-3xl text-[var(--accent-primary)] not-italic mt-2">stay curious.</p>
            <div className="space-y-1 text-sm md:text-base font-body uppercase tracking-widest text-[var(--text-main)]/60 not-italic pt-4">
              <p>• Cook something new.</p>
              <p>• Invite someone over.</p>
              <p>• Take the longer route home.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/dinner"
              className="btn-paper bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] hover:bg-[var(--text-main)] hover:border-[var(--text-main)] px-10 py-5 text-xl tracking-[0.1em]"
            >
              See the next dinner
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
