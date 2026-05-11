import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function SceneContent({ scrollProgress }) {
  const groupRef = useRef();
  const forkRef = useRef();
  const tableRef = useRef();
  
  // States: 
  // 0.0 - 0.33: Fork only
  // 0.33 - 0.66: Fork + Hand (represented by a sphere/primitive for now to ensure reliability)
  // 0.66 - 1.0: Full Table (8 plates)

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth camera orbit in State 3 (last 33%)
    if (scrollProgress > 0.66) {
      const angle = state.clock.getElapsedTime() * 0.2;
      state.camera.position.x = Math.sin(angle) * 10;
      state.camera.position.z = Math.cos(angle) * 10;
      state.camera.lookAt(0, 0, 0);
    } else {
      // Transition camera position based on scroll
      const targetZ = THREE.MathUtils.lerp(6, 12, scrollProgress);
      const targetY = THREE.MathUtils.lerp(0, 8, scrollProgress);
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1);
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {/* STATE 1 & 2: FORK */}
      <group visible={scrollProgress < 0.7}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh ref={forkRef} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2, 16]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            {/* Simple tines */}
            {[...Array(4)].map((_, i) => (
              <mesh key={i} position={[(i - 1.5) * 0.1, 1, 0]}>
                <boxGeometry args={[0.03, 0.4, 0.03]} />
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
          </mesh>
        </Float>
      </group>

      {/* STATE 2: THE "HAND" (Abstract low-poly representation) */}
      <group visible={scrollProgress > 0.3 && scrollProgress < 0.7}>
        <mesh position={[0, -1, 0]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.6, 1.2, 0.4]} />
          <meshStandardMaterial color="#d4a373" roughness={0.8} />
        </mesh>
      </group>

      {/* STATE 3: FULL TABLE (8 Plates) */}
      <group visible={scrollProgress > 0.6}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 3.5;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
              <meshStandardMaterial color="#fff" roughness={0.3} />
            </mesh>
          );
        })}
        {/* Table top */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5, 64]} />
          <meshStandardMaterial color="#efe9e1" roughness={1} />
        </mesh>
      </group>

      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#e45a0b" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#4ea8de" />
      
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2.4} />
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
