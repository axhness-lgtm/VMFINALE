import React from 'react';
import { motion } from 'framer-motion';

const HandDrawnLoop = ({ children, className = "" }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute -inset-x-4 -inset-y-2 w-[calc(100%+2rem)] h-[calc(100%+1rem)] pointer-events-none overflow-visible"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M10,80 Q30,10 100,20 T180,50 T100,90 T20,70"
          fill="none"
          stroke="var(--accent-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.8 }}
        />
      </svg>
    </span>
  );
};

export default HandDrawnLoop;
