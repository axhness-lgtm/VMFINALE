import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DriftingArtifact = ({ children, speed = 1, initialX = 0, initialY = 0, rotation = 0, zIndex = 1, className = "" }) => {
  const { scrollY } = useScroll();
  
  // Subtle parallax based on scroll
  const y = useTransform(scrollY, [0, 1000], [0, -100 * speed]);
  const x = useTransform(scrollY, [0, 1000], [0, 20 * speed]);
  const rotate = useTransform(scrollY, [0, 1000], [rotation, rotation + (5 * speed)]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        left: initialX,
        top: initialY,
        zIndex,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 2, 
        ease: [0.23, 1, 0.32, 1],
        opacity: { duration: 1.5 }
      }}
      className={`absolute pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default DriftingArtifact;
