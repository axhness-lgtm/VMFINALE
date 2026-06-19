import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DustParticles({ count = 200 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  return (
    <Points positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#e86321"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function CeramicPlate() {
  const meshRef = useRef();
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Slow rotation on Y axis
    meshRef.current.rotation.y += 0.002;
    
    // Mouse parallax tilting (5 degrees = ~0.087 rad)
    const targetRotationX = mouse.y * 0.087;
    const targetRotationZ = -mouse.x * 0.087;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotationX, 0.05);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotationZ, 0.05);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Simple flat disc geometry for a minimal ceramic plate */}
        <cylinderGeometry args={[2.5, 2.5, 0.15, 64]} />
        <meshStandardMaterial 
          color="#E6E1D8" 
          roughness={0.2} 
          metalness={0.1}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

export default function HomeHero3D() {
  return (
    <div className="canvas-wrapper">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
        
        {/* Atmosphere: Dark warm background is handled in CSS, 
            but we can add a subtle fog here */}
        <fog attach="fog" args={['#0d0804', 5, 15]} />

        <ambientLight intensity={0.2} />
        
        {/* Volumetric orange light from lower left */}
        <pointLight 
          position={[-5, -5, 2]} 
          intensity={150} 
          color="#e86321" 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Blue accent rim light from upper right */}
        <pointLight 
          position={[5, 5, -2]} 
          intensity={50} 
          color="#4ea8de" 
        />

        <DustParticles />
        <CeramicPlate />
      </Canvas>
    </div>
  );
}
