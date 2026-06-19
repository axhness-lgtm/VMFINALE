import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative mr-[0.25em] mt-[0.1em] inline-block">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

export default function ScrollHighlight({ text, className, scrollYProgress, range = [0, 1] }) {
  const words = text.split(" ");

  return (
    <p className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const wordStart = range[0] + (i / words.length) * (range[1] - range[0]);
        const wordEnd = range[0] + ((i + 1) / words.length) * (range[1] - range[0]);
        return (
          <Word key={i} progress={scrollYProgress} range={[wordStart, wordEnd]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}
