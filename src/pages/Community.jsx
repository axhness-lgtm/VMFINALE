import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Heart, Quote, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialEntries = [
  { name: "Anonymous", text: "Came for the food. Stayed for the people.", date: "Vol 01", sticker: "🍋" },
  { name: "Maya S.", text: "I haven't had a conversation like this in years.", date: "Vol 02", sticker: "🌿" },
  { name: "Rahul K.", text: "Exactly what Vizag needed.", date: "Vol 03", sticker: "⛵" },
  { name: "Priya N.", text: "I booked the next dinner before I got home.", date: "Vol 04", sticker: "☕" },
  { name: "David G.", text: "I came alone. I didn't leave that way.", date: "Vol 04", sticker: "🎒" }
];

const stickers = ["🍋", "🌿", "⛵", "☕", "🎒", "🗺️", "🍊", "🍷"];

const heroPeople = [
  { id: 5, top: "10%", left: "5%", rotate: "-12deg", size: "w-28 md:w-36 lg:w-44" },
  { id: 6, top: "45%", left: "12%", rotate: "8deg", size: "w-32 md:w-40 lg:w-48" },
  { id: 7, top: "75%", left: "4%", rotate: "-6deg", size: "w-36 md:w-44 lg:w-52" },
  { id: 8, top: "25%", left: "20%", rotate: "15deg", size: "w-24 md:w-32 lg:w-36", hiddenOnMobile: true },
  
  { id: 9, top: "12%", right: "8%", rotate: "10deg", size: "w-32 md:w-40 lg:w-48" },
  { id: 10, top: "35%", right: "22%", rotate: "-14deg", size: "w-28 md:w-36 lg:w-44", hiddenOnMobile: true },
  { id: 11, top: "65%", right: "6%", rotate: "18deg", size: "w-36 md:w-44 lg:w-52" },
  { id: 12, top: "85%", right: "20%", rotate: "-5deg", size: "w-24 md:w-32 lg:w-36" },
  { id: 13, top: "50%", right: "15%", rotate: "6deg", size: "w-32 md:w-40 lg:w-44", hiddenOnMobile: true },
];

export default function Community() {
  const [guestbook, setGuestbook] = useState(initialEntries);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('🍋');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newEntry = {
      name: name.trim(),
      text: text.trim(),
      date: "Just now",
      sticker: selectedSticker
    };

    setGuestbook([newEntry, ...guestbook]);
    setName('');
    setText('');
    setSelectedSticker('🍋');
  };

  return (
    <div className="w-full relative bg-[var(--bg-primary)]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-40 pb-20 px-6 lg:px-16 overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        {/* Scattered background people illustrations */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {heroPeople.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 1, ease: "easeOut" }}
              className={`absolute ${p.size} ${p.hiddenOnMobile ? 'hidden md:block' : ''}`}
              style={{ 
                top: p.top, 
                left: p.left, 
                right: p.right, 
                rotate: p.rotate 
              }}
            >
              <img src={`/people${p.id}.png`} alt={`Guest ${i}`} className="w-full h-auto drop-shadow-md filter contrast-[1.05]" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto max-w-2xl text-center relative z-10 bg-[var(--bg-primary)]/80 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-[var(--text-main)]/10 torn-edge">
          <div className="masking-tape w-32 h-6 -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
          <div className="absolute -top-12 -left-12 lg:-left-16 w-32 h-32 coffee-ring opacity-50 rotate-[45deg]" />
          <div className="absolute -bottom-8 -right-8 stamp rotate-[12deg] opacity-70 scale-90 bg-[var(--bg-primary)]">LONG-TBL</div>
          
          <span className="text-[var(--accent-primary)] font-body tracking-[0.25em] uppercase text-xs mb-6 block font-bold mt-4">
            LONG TABLE SOCIETY
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading leading-tight text-[var(--text-main)] mb-8">
            A table that <br className="hidden md:inline" /> keeps growing.
          </h1>
          <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 max-w-2xl mx-auto space-y-3 mb-12 relative z-10">
            <p>Some people come once.</p>
            <p>Some keep coming back.</p>
            <p className="italic text-[var(--accent-primary)] relative inline-block">
              Either way, they leave a little something behind.
              <span className="handwritten-annotation absolute -bottom-8 -right-16 text-xl rotate-[-5deg] hidden lg:block">Even just a memory...</span>
            </p>
          </div>
          
          <Link 
            to="/dinner" 
            className="group relative inline-block bg-[#efe8db] text-[#2c2b29] border border-[#2c2b29]/5 shadow-sm hover:shadow-md transition-all duration-300 rounded-full px-10 py-5 font-body text-lg font-bold tracking-wide"
          >
            Join the next gathering
          </Link>
        </div>
      </section>

      {/* 2. YOU'LL PROBABLY FIT IN IF... (LISTS / CARDS) */}
      <section className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-20">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Compatibility</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">You'll probably fit in if...</h2>
          </div>

          {/* Staggered lists/cards layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              "You save restaurants months before your trip.",
              "You ask people what they're reading.",
              "You enjoy cooking for friends.",
              "You stop to photograph interesting doors.",
              "You think conversations are better without a clock.",
              "You love discovering places through food."
            ].map((trait, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.02, rotate: idx % 2 === 0 ? -1 : 1 }}
                className="bg-[#faf8f5] p-8 rounded-sm shadow-sm border border-[var(--text-main)]/10 min-h-[180px] flex flex-col justify-between relative torn-edge hover-lift"
              >
                <div className="masking-tape w-16 h-4 -top-2 left-1/2 -translate-x-1/2 rotate-1" />
                
                {/* Washi tape details on random cards */}
                {idx % 2 === 0 && (
                  <div className="absolute w-12 h-4 bg-[var(--accent-primary)]/10 backdrop-blur-[1px] border border-[var(--accent-primary)]/5 -top-2 left-6 rotate-12" />
                )}
                
                <div className="flex items-center justify-between">
                  <span className="font-heading text-sm text-[var(--accent-primary)]/40 font-bold">0{idx + 1}.</span>
                  <span className="handwritten-annotation text-lg text-emerald-800 rotate-[-15deg] opacity-70 hidden md:block">✓</span>
                </div>
                <p className="font-body text-xl text-[var(--text-main)] leading-relaxed mt-4">
                  "{trait}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THINGS WE'VE FOUND AT THE TABLE (OBJECTS) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Artifacts</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">Things we've found at the table.</h2>
            <p className="font-body text-lg text-[var(--text-main)]/65 mt-4">
              Instead of explaining the community, let objects tell the story.
            </p>
          </div>

          {/* Visual representations of table discoveries */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-0 lg:-mx-8">
            
            {/* Postcard */}
            <div className="bg-[#fcf8f0] w-full md:w-[45%] lg:w-[28%] p-6 border border-amber-800/20 shadow-xl rotate-[-2deg] flex flex-col justify-between h-64 relative hover-lift z-10">
              <div className="absolute top-4 right-4 border border-dashed border-amber-800/40 w-12 h-14 flex items-center justify-center text-[8px] font-mono text-amber-800/60 uppercase tracking-widest rotate-6">
                Stamp
              </div>
              <p className="font-logo text-xl text-amber-900/80 leading-relaxed mt-8">
                "Pondicherry was warm, but this dinner felt warmer."
              </p>
              <div className="border-t border-dashed border-amber-800/20 pt-2 flex justify-between items-end">
                <span className="font-body text-[10px] uppercase tracking-wider text-amber-800/60">Pondicherry Postcard</span>
                <span className="font-body text-[10px] text-amber-800/60">Vol 02</span>
              </div>
            </div>

            {/* Sketch of dessert */}
            <div className="bg-[#fafafa] w-full md:w-[45%] lg:w-[28%] lg:-ml-8 lg:mt-12 p-6 border border-gray-300 shadow-xl rotate-[1deg] flex flex-col justify-between h-64 relative hover-lift-inverse torn-edge z-20">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100%_20px]" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-24 h-16 border border-dashed border-gray-300 mx-auto rounded flex items-center justify-center text-gray-300 text-xs">
                  [ sketch ]
                </div>
                <p className="font-body italic text-center text-gray-600 mt-4">
                  A rough pencil sketch of the banana coconut soup.
                </p>
                <span className="font-mono text-[9px] uppercase text-gray-400 text-right">Sketchbook torn leaf</span>
              </div>
            </div>

            {/* Recipe card */}
            <div className="bg-yellow-50/80 w-full md:w-[45%] lg:w-[28%] lg:-ml-8 lg:-mt-8 p-6 border border-yellow-200 shadow-xl rotate-[-1deg] flex flex-col justify-between h-64 relative hover-lift paper-texture z-30">
              <div className="w-full h-2 bg-red-400/20 absolute top-0 left-0" />
              <div className="mt-4">
                <span className="block font-heading text-xs text-amber-800/50 uppercase tracking-wider mb-2">Recipe Card</span>
                <p className="font-mono text-sm text-amber-900/90 leading-relaxed">
                  Ginger syrup:<br/>
                  • A big hand of ginger<br/>
                  • Palm sugar (by eye)<br/>
                  • Simmer until sticky.
                </p>
              </div>
              <span className="font-body text-[10px] text-amber-700/60 italic text-right">"No measurements."</span>
            </div>

            {/* Cassette Tape (Playlist) */}
            <div className="bg-zinc-800 text-zinc-100 w-full md:w-[45%] lg:w-[28%] lg:-ml-8 lg:mt-8 p-6 border-2 border-zinc-700 shadow-xl rotate-[4deg] flex flex-col justify-between h-64 relative rounded-md hover-lift-inverse z-40">
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-zinc-600" />
                  <span className="w-3 h-3 rounded-full bg-zinc-600" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400">SIDE A</span>
              </div>
              <div className="bg-zinc-700 p-3 rounded text-center">
                <p className="font-logo text-lg text-[var(--accent-primary)] tracking-wide truncate">Rainy Evenings</p>
                <p className="font-body text-[9px] text-zinc-400 uppercase mt-1">Curated at Vantammayilu</p>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500">
                <span>90 MIN</span>
                <span>VOL. IV</span>
              </div>
            </div>

            {/* Film camera */}
            <div className="bg-[#f0ece2] w-full md:w-[45%] lg:w-[28%] lg:mt-16 p-5 border border-zinc-300 shadow-xl rotate-[-2deg] flex flex-col justify-between h-64 relative hover-lift z-10">
              <div className="w-full h-36 bg-zinc-900 rounded flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="w-16 h-16 rounded-full border-4 border-zinc-800 bg-zinc-950 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-900/40" />
                </div>
              </div>
              <p className="font-body text-xs text-zinc-500 text-center italic mt-2">
                An old Olympus Trip 35, left on the side board.
              </p>
            </div>

            {/* Travel itinerary */}
            <div className="bg-[#eef2f7] w-full md:w-[45%] lg:w-[28%] lg:-ml-8 lg:mt-8 p-6 border border-blue-200 shadow-xl rotate-[1deg] flex flex-col justify-between h-64 relative hover-lift-inverse ticket-edge z-20">
              <div className="absolute top-2 left-2 w-4 h-4 rounded-full border border-blue-300/40" />
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-500 block mb-2">Boarding Pass Stub</span>
                <h4 className="font-heading text-lg text-blue-900 leading-tight">VIZAG → HANOI</h4>
                <p className="font-body text-xs text-blue-800/70 mt-2">
                  "Let's see if we can find that noodle alley..." (scribbled in margins)
                </p>
              </div>
              <span className="font-body text-[9px] text-blue-400 text-right">Unfinished itinerary</span>
            </div>

            {/* Bookmark */}
            <div className="bg-[#fcfcfc] w-full md:w-[45%] lg:w-[28%] lg:-ml-8 lg:-mt-4 p-4 border border-zinc-200 shadow-xl rotate-[-3deg] flex flex-col justify-between h-64 relative mx-auto hover-lift z-30">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-auto" />
              <div className="border-l border-r border-zinc-200 py-6 px-2 text-center">
                <p className="font-heading text-xl text-zinc-700 italic leading-snug">
                  "A book is a device to ignite the imagination."
                </p>
              </div>
              <span className="font-body text-[9px] text-zinc-400 text-center uppercase">Found in page 142</span>
            </div>

            {/* Pressed flower */}
            <div className="bg-[#faf7f2] w-full md:w-[45%] lg:w-[28%] lg:-ml-8 lg:mt-4 p-6 border border-zinc-200 shadow-xl rotate-[3deg] flex flex-col justify-between h-64 relative hover-lift-inverse z-40">
              <div className="masking-tape w-12 h-4 top-2 left-1/2 -translate-x-1/2 rotate-2 opacity-50" />
              <div className="flex-grow flex items-center justify-center opacity-20">
                {/* Simulated flower/leaf shape */}
                <svg className="w-20 h-20 text-emerald-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 12 22 12 22S16 10 17 8zM7 8C16 10 12 22 12 22S8 10 7 8zM12 2C12 2 10 5 12 8C14 5 12 2 12 2z"/>
                </svg>
              </div>
              <p className="font-body text-xs text-zinc-600 text-center italic mt-2 relative z-10">
                A single jasmine bud pressed flat between parchment.
              </p>
              <span className="font-mono text-[9px] text-zinc-400 text-right uppercase">Pressed Flower</span>
            </div>

          </div>

          <div className="text-center mt-20">
            <p className="font-heading text-3xl md:text-4xl text-[var(--accent-primary)] -rotate-1 italic">
              "Maybe you'll leave something too."
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONVERSATIONS WE'VE OVERHEARD (QUOTES) */}
      <section className="py-32 bg-[var(--text-main)] text-[var(--bg-secondary)] relative overflow-hidden">
        {/* Subtle SVG overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Snippet Echoes</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--bg-secondary)]">Conversations we've overheard.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { quote: "You have to visit Kyoto in autumn.", rot: "-rotate-1", alignment: "items-start" },
              { quote: "Can you send me that playlist?", rot: "rotate-2", alignment: "items-end" },
              { quote: "My grandmother makes it differently.", rot: "-rotate-2", alignment: "items-start" },
              { quote: "Let's plan that trip.", rot: "rotate-1", alignment: "items-end" },
              { quote: "I've never told anyone this before.", rot: "-rotate-3", alignment: "items-start", highlight: true },
              { quote: "Same time next month?", rot: "rotate-2", alignment: "items-end" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`flex flex-col ${item.alignment} group`}
              >
                <div className={`p-8 rounded-md bg-[var(--bg-secondary)] text-[var(--text-main)] max-w-md shadow-lg border border-white/5 relative ${item.rot} ${item.highlight ? 'border-[var(--accent-primary)]/40 shadow-[var(--accent-primary)]/5' : ''} torn-edge`}>
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-[var(--text-main)]/10" />
                  
                  {/* Subtle scribble/star that appears on hover */}
                  <div className="absolute -top-4 -left-4 text-xl text-[var(--accent-primary)] font-logo opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rotate-[-15deg]">
                    ✨
                  </div>

                  <p className={`font-body text-xl md:text-2xl leading-relaxed ${item.highlight ? 'text-[var(--accent-primary)] font-heading italic text-2xl md:text-3xl' : 'text-[var(--text-main)]'}`}>
                    "{item.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BY THE END OF THE NIGHT... (OBSERVATIONS) */}
      <section className="py-36 bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-6 font-logo">The Transition</span>
          <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)] mb-20">By the end of the night...</h2>

          <div className="flex flex-col items-center justify-center space-y-12 max-w-xl mx-auto relative">
            {/* Dashed vertical connector line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 border-l border-dashed border-[var(--text-main)]/15 pointer-events-none z-0" />

            {[
              { text: "Names become stories.", size: "text-2xl md:text-3xl", color: "text-[var(--text-main)]/70" },
              { text: "Stories become memories.", size: "text-3xl md:text-4xl", color: "text-[var(--text-main)]/90 font-semibold" },
              { text: "Memories become reasons to come back.", size: "text-4xl md:text-5xl", color: "text-[var(--accent-primary)] font-heading" },
              { text: "No one asks to leave early.", size: "text-5xl md:text-6xl", color: "text-[var(--text-main)] font-heading leading-tight" }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className={`relative z-10 bg-[var(--bg-secondary)] px-8 py-3 rounded-full border border-[var(--text-main)]/5 shadow-sm inline-block ${step.size} ${step.color}`}
              >
                {step.text}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. THE GUESTBOOK (TESTIMONIALS / INTERACTIVE) */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="font-body italic text-3xl text-[var(--accent-primary)] block mb-2 font-logo">Signatures</span>
            <h2 className="text-5xl md:text-6xl font-heading text-[var(--text-main)]">The Guestbook</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 bg-[var(--bg-secondary)] p-8 rounded-3xl shadow-xl border border-[var(--text-main)]/10 relative">
              <div className="masking-tape w-24 h-6 -top-3 left-1/2 -translate-x-1/2 rotate-1" />
              <h3 className="font-heading text-3xl text-[var(--text-main)] mb-2">Leave your mark</h3>
              <p className="font-body text-sm text-[var(--text-main)]/60 mb-6">
                Add a little reflection about your supper club experience. Choose a sticker stamp to seal it.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body text-xs uppercase tracking-widest text-[var(--text-main)]/60 mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya S. or Anonymous"
                    className="w-full bg-transparent border-b border-[var(--text-main)]/30 pb-2 font-heading text-xl focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-main)]"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-widest text-[var(--text-main)]/60 mb-2">Your reflection</label>
                  <textarea
                    required
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. Came alone. Didn't leave that way..."
                    className="w-full bg-transparent border-b border-[var(--text-main)]/30 pb-2 font-body text-lg focus:outline-none focus:border-[var(--accent-primary)] text-[var(--text-main)] resize-none"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-widest text-[var(--text-main)]/60 mb-3">Choose a Stamp Sticker</label>
                  <div className="flex flex-wrap gap-3">
                    {stickers.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedSticker(st)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border ${selectedSticker === st ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white' : 'border-[var(--text-main)]/10 hover:bg-[var(--text-main)]/5'}`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-paper bg-[var(--text-main)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] py-4 flex items-center justify-center gap-2 text-lg"
                >
                  <Send size={18} />
                  Sign the Guestbook
                </button>
              </form>
            </div>

            {/* Guestbook List Column */}
            <div className="lg:col-span-7 space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-[var(--accent-primary)]/20 p-4 bg-[#faf8f5] rounded-xl border border-[var(--text-main)]/5 paper-texture shadow-inner">
              <AnimatePresence>
                {guestbook.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-6 bg-[var(--bg-primary)] border-b border-[var(--text-main)]/10 relative flex flex-col justify-between rotate-${idx % 2 === 0 ? '[-1deg]' : '[1deg]'}`}
                  >
                    {/* Sticker stamp positioning */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--text-main)]/15 shadow-md flex items-center justify-center text-2xl rotate-12 select-none">
                      {entry.sticker}
                    </div>

                    <div className="pr-8">
                      <p className="font-heading text-2xl leading-relaxed text-[var(--text-main)]">
                        "{entry.text}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-6 border-[var(--text-main)]/10 pt-4">
                      <span className="font-body text-sm font-bold text-[var(--accent-primary)] handwritten-note">— {entry.name}</span>
                      <span className="font-mono text-[10px] text-[var(--text-main)]/40 uppercase">{entry.date}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 7. THE TABLE IS ALWAYS CHANGING (CTA) */}
      <section className="py-32 relative text-center overflow-hidden bg-[var(--bg-secondary)] border-t border-[var(--text-main)]/10 flex flex-col items-center justify-center">
        {/* Soft background accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-primary)]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-heading text-[var(--text-main)] mb-6 leading-tight"
          >
            The table is <br className="md:hidden" /> always changing.
          </motion.h2>

          <div className="font-body text-xl md:text-2xl text-[var(--text-main)]/80 max-w-md mx-auto space-y-2 mb-12 italic">
            <p>Different cuisine.</p>
            <p>Different people.</p>
            <p className="font-heading text-[var(--accent-primary)] not-italic">Same feeling.</p>
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
              Find your seat
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
