import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TelemetryScene from './TelemetryScene';

export default function PlatterTelemetryWorkspace({ activeNode, setActiveNode }) {
  return (
    <div style={{ width: '100%', height: '750px', position: 'relative' }}>
      <Canvas
        orthographic
        shadows
        camera={{
          zoom: 38,
          position: [40, 45, 40], // Perfect isometric projection coordinates
          near: 0.1,
          far: 500,
        }}
      >
        {/* Soft even ambient background lighting */}
        <ambientLight intensity={0.65} />

        {/* Sharp high-contrast directional sun light for brutalist architectural shadows */}
        <directionalLight
          position={[15, 35, 10]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
        />

        <TelemetryScene 
          activeNode={activeNode} 
          setActiveNode={setActiveNode} 
        />

        {/* Restricted drag controls for tactile user exploration of the volume */}
        <OrbitControls 
          enableZoom={true} 
          enableRotate={true} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 3} 
        />
      </Canvas>
    </div>
  );
}
