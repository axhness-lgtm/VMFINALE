import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function SceneContent({ scrollProgress }) {
  const groupRef = useRef();
  
  // Warm Candlelight movement
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    
    // Flickering candle light intensity
    const intensity = 2 + Math.sin(time * 3) * 0.5 + Math.random() * 0.2;
    groupRef.current.children.forEach(child => {
      if (child.type === 'SpotLight') child.intensity = intensity;
    });

    // Camera drift
    const targetX = Math.sin(time * 0.2) * 5;
    const targetY = 8 + Math.cos(time * 0.3) * 2;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* THE TABLE SURFACE */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#efe9e1" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* DYNAMIC PLATES (Populating on scroll) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4;
        const visible = scrollProgress > (i / 10);
        return (
          <group 
            key={i} 
            position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            rotation={[0, -angle, 0]}
            visible={visible}
          >
            {/* Plate */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
              <meshStandardMaterial color="#fff" roughness={0.2} />
            </mesh>
            
            {/* Flower / Centerpiece (Emerging) */}
            {visible && i % 3 === 0 && (
              <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#e45a0b" emissive="#e45a0b" emissiveIntensity={0.5} />
              </mesh>
            )}

            {/* Note Scrap (Memory Residue) */}
            {visible && (
              <mesh position={[0.5, 0.05, 0.5]} rotation={[0, 0.2, 0]}>
                <boxGeometry args={[0.4, 0.01, 0.3]} />
                <meshStandardMaterial color="#fdfaf6" roughness={1} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* AMBIENT LIGHTING */}
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={2} color="#e45a0b" castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#13368d" />
      
      <ContactShadows position={[0, -0.05, 0]} opacity={0.3} scale={15} blur={2.5} />
    </group>
  );
}

export default function IdeaCanvas({ scrollProgress }) {
  return (
    <div className="idea-canvas-container">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <SceneContent scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
