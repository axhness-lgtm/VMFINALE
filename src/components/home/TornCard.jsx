import React from 'react';
import { motion } from 'framer-motion';

const TornCard = ({ src, alt, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`relative group ${className}`}
    >
      <div className="relative overflow-hidden shadow-xl" style={{ 
        clipPath: "polygon(2% 0%, 98% 1%, 100% 98%, 1% 100%, 0% 50%)", // Simple torn-like edges
        maskImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.5\"/></filter><rect width=\"100\" height=\"100\" filter=\"url(%23n)\" opacity=\"0.1\"/><path d=\"M0,5 L5,0 L95,2 L100,5 L98,95 L95,100 L5,98 L0,95 Z\"/></svg>')",
        maskSize: "cover"
      }}>
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
        />
        {/* Film grain overlay for the card specifically */}
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay paper-texture" />
      </div>
    </motion.div>
  );
};

export default TornCard;
