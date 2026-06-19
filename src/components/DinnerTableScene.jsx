import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Table component
const Table = ({ position, texturePath }) => {
  const texture = useTexture(texturePath);
  return (
    <Float floatIntensity={0.5} rotationIntensity={0.1} speed={1.5}>
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[4.5, 4.5]} />
        <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} alphaTest={0.1} />
      </mesh>
    </Float>
  );
};

// Cushion component
const Cushion = ({ position, texturePath, delay = 0 }) => {
  const texture = useTexture(texturePath);
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float 
      floatIntensity={hovered ? 4 : 1} 
      rotationIntensity={hovered ? 0.4 : 0.1} 
      speed={hovered ? 3 : 1.5}
    >
      <mesh 
        position={position} 
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        cursor="pointer"
      >
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide} 
          alphaTest={0.1} 
          color={hovered ? "#ffe8cc" : "#ffffff"}
        />
      </mesh>
    </Float>
  );
};

export default function DinnerTableScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 8, 6], fov: 45 }} shadows>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 10, 5]} intensity={2} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-5, 5, -5]} intensity={1} />
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2 - 0.1} 
          minDistance={5} 
          maxDistance={18}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {/* Tables (2 tables side by side horizontally) */}
            <Table position={[-2.5, 0.5, 0]} texturePath="/3dtable/1.png" />
            <Table position={[2.5, 0.5, 0]} texturePath="/3dtable/2.png" />
            
            {/* Cushions for Left Table */}
            <Cushion position={[-2.5, 0, -2.8]} texturePath="/3dtable/5.png" />
            <Cushion position={[-2.5, 0, 2.8]} texturePath="/3dtable/6.png" />
            <Cushion position={[-5.2, 0, 0]} texturePath="/3dtable/7.png" />
            <Cushion position={[-0.2, 0, 0]} texturePath="/3dtable/8.png" />
            
            {/* Cushions for Right Table */}
            <Cushion position={[2.5, 0, -2.8]} texturePath="/3dtable/9.png" />
            <Cushion position={[2.5, 0, 2.8]} texturePath="/3dtable/10.png" />
            {/* Reuse some cushions since there are only 6 images for 8 seats */}
            <Cushion position={[0.2, 0, 0]} texturePath="/3dtable/5.png" /> 
            <Cushion position={[5.2, 0, 0]} texturePath="/3dtable/6.png" />
          </group>

          {/* Soft floor shadow */}
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={20} blur={2.5} far={4} color="#5e4933" />
        </Suspense>
      </Canvas>
    </div>
  );
}
