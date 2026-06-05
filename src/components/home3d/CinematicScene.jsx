import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 1. Hero Atmospheric Artifacts
const FloatingArtifact = ({ position, rotation, scale, color, speed, index }) => {
  const ref = useRef();
  
  useFrame((state) => {
    const scrollY = window.scrollY;
    // Parallax drifting
    const yOffset = scrollY * 0.003 * speed;
    
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.5 + index) * 0.2 + yOffset;
    ref.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.05;
    ref.current.rotation.y = rotation[1] + Math.cos(state.clock.elapsedTime * speed * 0.2) * 0.05;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1.4]} />
      <meshPhysicalMaterial 
        color={color} 
        side={THREE.DoubleSide} 
        roughness={0.4} 
        metalness={0.0}
        transmission={0.3}
        thickness={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// 3. Abstract Long Table Environment
const LongTableScene = () => {
  const group = useRef();

  useFrame(() => {
    const scrollY = window.scrollY;
    // This section is roughly between 250vh and 650vh
    const vh = window.innerHeight;
    const startScroll = vh * 2;
    const progress = Math.max(0, scrollY - startScroll) * 0.001;
    
    // Slow dolly across the table
    if (group.current) {
      group.current.position.z = -10 + progress * 5;
      group.current.position.y = -2 + Math.min(progress, 2);
    }
  });

  return (
    <group ref={group} position={[0, -20, -10]}>
      {/* Abstract dark shapes for plates/chairs */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[-4 + i * 2, 0, -i * 3]}>
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.8, 32]} />
            <meshStandardMaterial color="#0f0904" roughness={0.7} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} color="#e45a0b" intensity={0.5} distance={3} />
        </group>
      ))}
    </group>
  );
};

// 4. Orbital Memory System
const OrbitalSystem = () => {
  const group = useRef();

  useFrame((state) => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const startScroll = vh * 6.5; // Roughly section 4
    
    if (scrollY > startScroll - vh) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      const progress = (scrollY - startScroll) * 0.002;
      group.current.position.y = -10 + progress * 2; // Drift upward
    } else {
      group.current.position.y = -100; // Hide when not in view
    }
  });

  const cards = useMemo(() => Array.from({ length: 12 }), []);

  return (
    <group ref={group} position={[0, -100, -5]}>
      {cards.map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 4;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle * 2) * 0.5, Math.sin(angle) * radius]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshStandardMaterial color="#f5efe7" roughness={1} opacity={0.4} transparent />
          </mesh>
        );
      })}
    </group>
  );
};

// 5. Floating 3D Invitation Card
const InvitationCard = () => {
  const ref = useRef();

  useFrame((state) => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const startScroll = vh * 8; // Section 5
    
    if (scrollY > startScroll - vh && scrollY < startScroll + vh * 2) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    } else {
      ref.current.position.y = -100;
    }
  });

  return (
    <mesh ref={ref} position={[0, -100, 0]} scale={2}>
      <planeGeometry args={[1, 1.4]} />
      <meshStandardMaterial color="#efe9e1" roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

const CinematicScene = () => {
  const { viewport } = useThree();

  return (
    <group>
      {/* Hero Atmosphere Artifacts */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
        <FloatingArtifact position={[-2, 1, -2]} rotation={[0.1, 0.2, 0.1]} scale={1.5} color="#ffffff" speed={0.8} index={1} />
        <FloatingArtifact position={[2.5, -0.5, -3]} rotation={[-0.2, -0.4, 0.1]} scale={1.2} color="#f5efe7" speed={0.6} index={2} />
        <FloatingArtifact position={[-1.5, -2, -1]} rotation={[0.5, 0.1, 0.2]} scale={0.8} color="#e45a0b" speed={1.2} index={3} />
        <FloatingArtifact position={[3, 2, -4]} rotation={[0, 0.5, -0.2]} scale={2} color="#13368d" speed={0.5} index={4} />
      </Float>

      <LongTableScene />
      <OrbitalSystem />
      <InvitationCard />

      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#13368d" />
      <pointLight position={[5, -5, -5]} intensity={0.5} color="#e45a0b" />

      {/* Atmospheric Fog */}
      <fog attach="fog" args={['#efe9e1', 5, 15]} />
    </group>
  );
};

export default CinematicScene;
