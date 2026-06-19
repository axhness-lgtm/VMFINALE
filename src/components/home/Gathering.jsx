import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Center } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

const seatsData = [
  { id: 1, story: "A writer from Vizag. He finished his first chapter here." },
  { id: 2, story: "A traveler from Berlin. She found a home in our spices." },
  { id: 3, story: "A painter from Hyderabad. She brought a sketch. She left with a friend." },
  { id: 4, story: "A retired teacher. He shared a secret recipe for silence." },
  { id: 5, story: "Reserved for you.", isReserved: true },
  { id: 6, story: "An architect who loved the way the shadows fell on the linen." },
  { id: 7, story: "A musician who hummed a song nobody had heard yet." },
  { id: 8, story: "A chef who came to eat, not to work, for the first time in years." }
];

const Plate = ({ position, seat, onHover }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, hovered ? 0.3 : 0.05, 0.1);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={() => { setHovered(true); onHover(seat); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
    >
      {/* Ceramic plate */}
      <cylinderGeometry args={[0.35, 0.3, 0.05, 32]} />
      <meshStandardMaterial 
        color={seat.isReserved ? "#e86321" : "#f5efe7"} 
        emissive={seat.isReserved ? "#e86321" : "#000000"}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        roughness={0.2}
        metalness={0.1}
      />
      {seat.isReserved && (
        <mesh position={[0, -0.05, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshBasicMaterial color="#e86321" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

const Candle = ({ position }) => {
  const lightRef = useRef();
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 5) * 0.3;
    }
  });
  return <pointLight ref={lightRef} position={position} color="#ffaa33" intensity={1.5} distance={6} />;
};

const Gathering = () => {
  const sectionRef = useRef();
  const [activeSeat, setActiveSeat] = useState(null);
  const headlineRef = useRef();

  useEffect(() => {
    if (headlineRef.current) {
      gsap.fromTo(headlineRef.current,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, 
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#0d0804] flex flex-col h-screen relative overflow-hidden">
      <div className="w-full flex flex-col items-center justify-center pt-24 z-10 pointer-events-none">
        <div ref={headlineRef} className="text-center">
          <h2 
            className="text-[64px] font-heading italic font-light text-white leading-[1.2]"
            style={{ wordSpacing: '0.1em', letterSpacing: '0.02em' }}
          >
            You don't know<br />who you'll meet.
          </h2>
          <h2 
            className="text-[64px] font-heading italic font-light text-[#e86321] leading-[1.2]"
            style={{ paddingTop: '1rem', wordSpacing: '0.1em', letterSpacing: '0.02em' }}
          >
            That's the point.
          </h2>
        </div>
      </div>

      <div className="flex-1 w-full relative">
        <Canvas shadows>
          {/* Top-down view */}
          <PerspectiveCamera makeDefault position={[0, 8, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={45} />
          <ambientLight intensity={0.2} />
          <Candle position={[0, 0.5, 0]} />
          <Center top>
            {/* Circular table */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <cylinderGeometry args={[2.5, 2.5, 0.1, 64]} />
              <meshStandardMaterial color="#1a0e05" roughness={0.8} />
            </mesh>
            {seatsData.map((seat, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const r = 1.8;
              return <Plate key={seat.id} position={[Math.cos(angle) * r, 0.05, Math.sin(angle) * r]} seat={seat} onHover={setActiveSeat} />;
            })}
          </Center>
        </Canvas>

        {activeSeat && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[150%] pointer-events-none bg-[#f5efe7] p-6 w-72 shadow-2xl z-20 animate-fade-in border border-black/10">
            <span className="text-mono text-[8px] uppercase tracking-[0.25em] block mb-3 text-[#e86321]">Seat {activeSeat.id}</span>
            <p className="text-serif italic font-light text-[18px] leading-relaxed text-[#1a0e05]">{activeSeat.story}</p>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-[#1a0e05] py-4 border-t border-white/5 overflow-hidden z-20 flex whitespace-nowrap">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="text-mono text-[10px] uppercase tracking-[0.2em] text-[#e86321] mx-8">
              warmth · curiosity · poetry · laughter · slow food · new friends · familiar strangers ·
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .animate-marquee { animation: marquee 60s linear infinite; display: flex; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -120%); } to { opacity: 1; transform: translate(-50%, -150%); } }
      `}</style>
    </section>
  );
};

export default Gathering;
