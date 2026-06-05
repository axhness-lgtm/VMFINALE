import React, { useState, useRef } from 'react';
import './CommandDeckHero.css';

const TRAIL_IMAGES = [
  '/assets/hand_lifting_ceramic_dish_1778932857855.png',
  '/assets/vsp_travel_stamp_1778932837511.png',
  '/images/journal_art_1.png',
  '/images/journal_art_2.png',
  '/images/journal_art_3.png',
  '/candlelit_fragment.png',
  '/floating_objects.png',
  '/sushi_platter.jpg'
];

const CommandDeckHero = () => {
  const [trail, setTrail] = useState([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const imageIndexRef = useRef(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - lastMousePos.current.x;
    const dy = y - lastMousePos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Spawn an image square every 70px of movement
    if (distance > 70) {
      lastMousePos.current = { x, y };

      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const image = TRAIL_IMAGES[imageIndexRef.current % TRAIL_IMAGES.length];
      imageIndexRef.current += 1;

      // Random rotation from -20deg to 20deg for physical archival scrap-book feel
      const rotation = (Math.random() - 0.5) * 40;

      setTrail((prev) => [...prev, { id: newId, x, y, image, rotation }]);

      // Remove the square after 1 second (matching the CSS animation lifecycle)
      setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== newId));
      }, 1000);
    }
  };

  return (
    <section className="command-deck-hero" onMouseMove={handleMouseMove}>
      {/* Dynamic Cursor Trail Squares */}
      {trail.map((item) => (
        <div
          key={item.id}
          className="trail-image-square"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            '--rotation': `${item.rotation}deg`,
            backgroundImage: `url(${item.image})`
          }}
        />
      ))}

      <h1 className="deck-headline">THE LONG TABLE<br />SOCIETY.</h1>
      <div className="deck-spec-manual">
        [ Protocol // Sys_401 // Community_Index ]
      </div>
    </section>
  );
};

export default CommandDeckHero;
