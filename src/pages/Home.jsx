import React, { useEffect, useRef, useState } from 'react';
import Hero from '../components/home/Hero';
import Idea from '../components/home/Idea';
import Atmosphere from '../components/home/Atmosphere';
import Gathering from '../components/home/Gathering';
import NextEvening from '../components/home/NextEvening';
import JournalPreview from '../components/home/JournalPreview';
import Society from '../components/home/Society';
import Host from '../components/home/Host';
import Footer from '../components/home/Footer';

const Home = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Custom Cursor Logic
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
      }
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div className="home-container relative">
      <div 
        ref={cursorRef} 
        className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      />
      <div className="grain-overlay" />
      
      <main className="scroll-smooth">
        <Hero onHover={setIsHovering} />
        <Idea />
        <Atmosphere />
        <Gathering />
        <NextEvening />
        <JournalPreview />
        <Society />
        <Host />
        <Footer />
      </main>

      <style jsx global>{`
        body {
          cursor: none;
        }
        a, button, [role="button"] {
          cursor: none;
        }
        .scroll-smooth {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Home;
