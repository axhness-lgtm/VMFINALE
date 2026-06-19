import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CameraRig = ({ progressRef }) => {
  useFrame((state) => {
    const progress = progressRef.current;
    let targetX = 0;
    let targetZ = 5;
    
    if (progress < 0.33) {
      targetX = (progress / 0.33) * 10;
    } else if (progress < 0.66) {
      targetX = 10 + ((progress - 0.33) / 0.33) * 10;
    } else {
      targetX = 20; 
      targetZ = 5 - ((progress - 0.66) / 0.34) * 1.5; // zoom in slightly
    }

    state.camera.position.lerp({ x: targetX, y: 2, z: targetZ }, 0.05);
    state.camera.lookAt(targetX, 0, 0);
  });
  return null;
};

const MorphScene = () => {
  const group1 = useRef();
  const group2 = useRef();
  const group3 = useRef();

  useFrame(() => {
    if (group1.current) group1.current.rotation.y += 0.005;
    if (group2.current) group2.current.rotation.y += 0.005;
    if (group3.current) group3.current.rotation.y += 0.005;
  });

  return (
    <>
      {/* Scene 1: 0% */}
      <group ref={group1} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.05, 1.5, 0.05]} /><meshStandardMaterial color="#efe9e1" /></mesh>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[(i - 1.5) * 0.1, 1, 0]}><boxGeometry args={[0.02, 0.5, 0.02]} /><meshStandardMaterial color="#efe9e1" /></mesh>
        ))}
      </group>

      {/* Scene 2: 33% */}
      <group ref={group2} position={[10, 0, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[0.6, 0.8, 0.1]} /><meshStandardMaterial color="#e86321" /></mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[(i - 2) * 0.12, 0.6, 0]} rotation={[0, 0, (i - 2) * 0.1]}><boxGeometry args={[0.08, 0.6, 0.08]} /><meshStandardMaterial color="#1c0e06" /></mesh>
        ))}
      </group>

      {/* Scene 3: 66% */}
      <group ref={group3} position={[20, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}><circleGeometry args={[3.5, 64]} /><meshStandardMaterial color="#1c0e06" roughness={0.9} /></mesh>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return <mesh key={i} position={[Math.cos(angle) * 2, -0.4, Math.sin(angle) * 2]}><cylinderGeometry args={[0.4, 0.35, 0.05, 32]} /><meshStandardMaterial color="#e86321" /></mesh>
        })}
      </group>
    </>
  );
};

const Idea = () => {
  const sectionRef = useRef();
  const textRef = useRef();
  const monoRef = useRef();
  const progressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          }
        }
      });

      // Background transition over first 100vh (0 to 0.33 of the timeline)
      tl.to(sectionRef.current, { backgroundColor: '#efe9e1', color: '#0d0804', duration: 1, ease: 'none' }, 0);

      const lines = textRef.current.querySelectorAll('.truth-line');
      
      // Line 1 fades in at 0%
      tl.fromTo(lines[0], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0);
      
      // Line 2 fades in at 33%
      tl.fromTo(lines[1], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1);
      
      // Line 3 fades in at 66%
      tl.fromTo(lines[2], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2);
      
      // Mono text fades in around the same time as Line 3
      tl.fromTo(monoRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.5);

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="flex flex-row w-full min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0d0804', color: '#efe9e1' }}>
      {/* Sticky Text Layer */}
      <div className="w-[60%] h-screen flex flex-col justify-center pl-[10%] pr-[5%] relative z-10">
        <div ref={textRef} className="flex flex-col relative w-full" style={{ gap: '120px' }}>
          <h2 className="truth-line text-[52px] font-heading italic font-light leading-tight" style={{ opacity: 0 }}>This is not a restaurant.</h2>
          <h2 className="truth-line text-[52px] font-heading italic font-light leading-tight" style={{ opacity: 0 }}>This is not an event.</h2>
          <div>
            <h2 className="truth-line text-[52px] font-heading italic font-light leading-tight text-[#e86321]" style={{ opacity: 0 }}>This is an invitation.</h2>
            <p ref={monoRef} className="text-mono text-xs tracking-widest uppercase mt-8 text-[#888888]" style={{ opacity: 0 }}>
              Eight seats. One evening. Every time.
            </p>
          </div>
        </div>
      </div>

      {/* 3D Canvas Layer */}
      <div className="w-[40%] h-screen relative z-10">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <CameraRig progressRef={progressRef} />
          <MorphScene />
          <Environment preset="apartment" />
        </Canvas>
      </div>

      <div className="absolute top-0 left-0 w-full h-8 z-20 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-[#0d0804]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 95% 80%, 90% 100%, 85% 70%, 80% 100%, 75% 85%, 70% 100%, 65% 75%, 60% 100%, 55% 80%, 50% 100%, 45% 70%, 40% 100%, 35% 85%, 30% 100%, 25% 75%, 20% 100%, 15% 80%, 10% 100%, 5% 70%, 0% 100%)' }}></div>
      </div>
    </section>
  );
};

export default Idea;
