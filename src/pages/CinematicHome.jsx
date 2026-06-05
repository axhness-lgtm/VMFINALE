import React, { useEffect, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Noise, DepthOfField, Vignette } from '@react-three/postprocessing';
import CinematicScene from '../components/home3d/CinematicScene';
import HomeEditorial from '../components/HomeEditorial';

const CinematicHome = () => {
  const lenisRef = useRef();

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.05, smoothWheel: true }}>
      <div className="relative w-full bg-[#efe9e1]">
        <div className="grain-overlay"></div>
        
        {/* Background WebGL Layer - Fixed or subtle scroll */}
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-40">
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: false, powerPreference: "high-performance" }}
          >
            <color attach="background" args={['#ff8811']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#e45a0b" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#13368d" />
            
            <CinematicScene />

            <EffectComposer multisampling={0}>
              <DepthOfField 
                focusDistance={0.025} 
                focalLength={0.05} 
                bokehScale={1.5} 
                height={480} 
              />
              <Noise opacity={0.03} />
              <Vignette eskil={false} offset={0.05} darkness={1.1} />
            </EffectComposer>
          </Canvas>
        </div>

        {/* Foreground Editorial Content */}
        <div className="relative z-10">
          <HomeEditorial />
        </div>

      </div>
    </ReactLenis>
  );
};

export default CinematicHome;
