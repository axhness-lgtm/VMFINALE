import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const CARD_WIDTH = 4;
const CARD_HEIGHT = 2.6;
const GAP_SIZE = 15; // Increased gap for cinematic feel

function Card({ url, index, rowOffset, scrollProgress, totalCardsPerRow }) {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Each row has its own cards, but they all move with the same scrollProgress
    const currentScroll = scrollProgress.current * (totalCardsPerRow - 1);
    const relativePos = index - currentScroll;
    
    // Calculate gap only for the center row (rowOffset.x === 0)
    let zOffset = 0;
    const isCenterRow = Math.abs(rowOffset.x) < 0.1;
    if (isCenterRow) {
      if (relativePos > 0.1) zOffset = GAP_SIZE;
      if (relativePos < -0.1) zOffset = -GAP_SIZE;
    }
    
    const isCenterCard = isCenterRow && Math.abs(relativePos) < 0.5;
    
    // Layout: Parallel Rows
    // x: rowOffset.x + small staggering
    // y: rowOffset.y + relativePos * diagonal slope
    // z: relativePos * spacing
    
    const x = rowOffset.x + (relativePos * 0.1);
    const y = rowOffset.y + (relativePos * -0.05);
    const z = relativePos * -0.3; // Extremely tight stacking like museum archive stacks

    ref.current.position.set(x, y, z + zOffset);
    
    // Rotation: Slight editorial tilt
    ref.current.rotation.y = -0.4;
    
    // Hide if it's the active card being detached
    ref.current.visible = !isCenterCard;
    
    // Performance: Fade out distant cards
    const dist = Math.abs(relativePos);
    const opacity = THREE.MathUtils.smoothstep(dist, 50, 10); // Fade out after 10-50 units
    ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, opacity, 0.1);
    ref.current.material.transparent = true;
  });

  return (
    <Image 
      ref={ref} 
      url={url} 
      scale={[CARD_WIDTH, CARD_HEIGHT]} 
      toneMapped={false}
      transparent
    />
  );
}

function ActiveCard({ card }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    meshRef.current.rotation.y = Math.cos(t * 0.3) * 0.05;
  });

  if (!card) return null;

  return (
    <group position={[0, 0, 8]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <Image
          ref={meshRef}
          url={card.img}
          scale={[CARD_WIDTH * 1.5, CARD_HEIGHT * 1.5]}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </Float>
    </group>
  );
}

export default function JournalScene({ cards, scrollProgress }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { viewport } = useThree();

  // Distribute cards into 3 parallel rows
  const rows = useMemo(() => {
    const rowCount = 3;
    const cardsPerRow = Math.floor(cards.length / rowCount);
    const result = [];
    
    const offsets = [
      { x: -12, y: 4 },  // Left Row (Higher)
      { x: 0, y: 0 },    // Center Row
      { x: 12, y: -4 }   // Right Row (Lower)
    ];

    for (let r = 0; r < rowCount; r++) {
      const rowCards = cards.slice(r * cardsPerRow, (r + 1) * cardsPerRow).map((c, i) => ({
        ...c,
        index: i,
        rowOffset: offsets[r]
      }));
      result.push({ cards: rowCards, offset: offsets[r] });
    }
    return result;
  }, [cards]);

  useFrame(() => {
    // Active index is based on the center row (row 1)
    const cardsPerRow = Math.floor(cards.length / 3);
    const idxInRow = Math.round(scrollProgress.current * (cardsPerRow - 1));
    const globalIdx = cardsPerRow + idxInRow; // Center row starts after the first row
    if (globalIdx !== activeIndex) {
      setActiveIndex(globalIdx);
    }
  });

  // Render window for performance
  const renderWindow = 60; 
  const visibleCards = useMemo(() => {
    const currentIdxInRow = Math.round(scrollProgress.current * (Math.floor(cards.length / 3) - 1));
    return rows.flatMap(row => 
      row.cards.filter(c => Math.abs(c.index - currentIdxInRow) < renderWindow)
    );
  }, [scrollProgress.current, rows]);

  return (
    <>
      <color attach="background" args={['#fcfcfc']} />
      <ambientLight intensity={2.5} />
      <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={30} />
      
      <group>
        {visibleCards.map((card) => (
          <Card 
            key={`${card.id}-${card.index}`} 
            url={card.img} 
            index={card.index} 
            rowOffset={card.rowOffset}
            scrollProgress={scrollProgress} 
            totalCardsPerRow={Math.floor(cards.length / 3)} 
          />
        ))}
      </group>
      
      {cards[activeIndex] && (
        <ActiveCard 
          card={cards[activeIndex]} 
        />
      )}
    </>
  );
}
