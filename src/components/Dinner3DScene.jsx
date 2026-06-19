import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── CUSTOM HOVER/SEAT COMPONENT ──────────────────────────────────────────────
function CushionSeat({ 
  seat, 
  isConfirmed, 
  isLockedByOthers, 
  isSelected, 
  hoveredSeat, 
  setHoveredSeat, 
  toggleSeat, 
  textures 
}) {
  const meshRef = useRef();
  const shadowRef = useRef();
  const [localHover, setLocalHover] = useState(false);

  // States
  const isVacant = !isConfirmed && !isLockedByOthers;
  const isActive = isSelected || isConfirmed;

  // Visual offsets for hover lift
  useFrame((state) => {
    if (!meshRef.current || !shadowRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Idle gentle hover float
    let floatY = Math.sin(time * 1.5 + seat.id) * 0.05;
    let floatX = 0;
    
    // Interactive hover lift
    const liftProgress = THREE.MathUtils.lerp(
      meshRef.current.position.y - seat.position[1],
      localHover && isVacant ? 0.25 : 0,
      0.15
    );
    
    meshRef.current.position.x = seat.position[0] + floatX;
    meshRef.current.position.y = seat.position[1] + floatY + liftProgress;
    meshRef.current.position.z = seat.position[2] + liftProgress * 0.5; // shift Z slightly forward when lifted
    
    // Shadow gets slightly smaller and fainter when cushion lifts
    const scaleFactor = 1.0 - liftProgress * 0.4;
    shadowRef.current.scale.set(scaleFactor, scaleFactor, 1.0);
    shadowRef.current.material.opacity = (0.6 - liftProgress * 0.3) * (isActive ? 0.3 : 1.0);
  });

  // Decide cushion color based on state
  let cushionColor = "#ffffff"; // default vacant
  if (isConfirmed || isSelected) {
    cushionColor = "#e86321"; // brand orange
  } else if (isLockedByOthers) {
    cushionColor = "#243b55"; // brand dark blue/grey
  }

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!isVacant) return;
    setLocalHover(true);
    setHoveredSeat(seat.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setLocalHover(false);
    if (hoveredSeat === seat.id) {
      setHoveredSeat(null);
    }
    document.body.style.cursor = 'default';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isVacant) return;
    toggleSeat(seat.id);
  };

  return (
    <group>
      {/* 1. Cushion Shadow */}
      <mesh 
        ref={shadowRef}
        position={[seat.position[0], seat.position[1] - 0.15, seat.position[2] - 0.01]}
        scale={[1.1, 1.1, 1]}
      >
        <planeGeometry args={[0.9, 0.55]} />
        <meshBasicMaterial 
          map={textures.cushionShadow} 
          transparent 
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Pillow Plane */}
      <mesh
        ref={meshRef}
        position={seat.position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <planeGeometry args={[1.3, 0.85]} />
        <meshBasicMaterial 
          map={textures.cushion} 
          transparent 
          color={cushionColor}
          alphaTest={0.01}
          depthWrite={true}
        />
      </mesh>

      {/* 3. Sprout Tag floating Drei HTML Overlay */}
      {(isActive || isLockedByOthers) && (
        <Html
          position={[seat.position[0], seat.position[1] + 0.5, seat.position[2] + 0.1]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`sprout-tag-3d ${isLockedByOthers ? 'held-state' : ''}`}>
            {isLockedByOthers ? '[ SEAT HELD ]' : `[ WELCOME GUEST_0${seat.id} ]`}
          </div>
        </Html>
      )}
    </group>
  );
}

// ── DECORATIVE CUSHION COMPONENT ─────────────────────────────────────────────
function DecorativeCushion({ position, textures }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Subtle float
    meshRef.current.position.y = position[1] + Math.sin(time * 1.2 + position[0]) * 0.03;
  });

  return (
    <group>
      {/* Shadow */}
      <mesh 
        position={[position[0], position[1] - 0.15, position[2] - 0.01]}
        scale={[1.1, 1.1, 1]}
      >
        <planeGeometry args={[0.9, 0.55]} />
        <meshBasicMaterial 
          map={textures.cushionShadow} 
          transparent 
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Cushion */}
      <mesh ref={meshRef} position={position}>
        <planeGeometry args={[1.3, 0.85]} />
        <meshBasicMaterial 
          map={textures.cushion} 
          transparent 
          alphaTest={0.01}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
}

// ── CAMERA & MOUSE PARALLAX CONTROLLER ───────────────────────────────────────
function SceneController() {
  const { camera } = useThree();
  
  useFrame((state) => {
    const { mouse } = state;
    // Multi-plane parallax offset (slow, premium drift)
    const targetX = mouse.x * 0.8;
    const targetY = mouse.y * 0.6;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.04);
  });

  return null;
}

// ── MAIN R3F CANVAS CONTAINER ────────────────────────────────────────────────
export default function Dinner3DScene({ 
  selectedSeats, 
  hoveredSeat, 
  setHoveredSeat, 
  toggleSeat, 
  isSeatConfirmed, 
  isSeatLockedByOthers,
  hideBlackPaint = false
}) {
  
  const CanvasContent = () => {
    const textures = useTexture({
      blackPaint: '/assets/dinner/black_paint_bg.png',
      gridMat: '/assets/dinner/grid_mat.png',
      tableBack: '/assets/dinner/table_back.png',
      tableFront: '/assets/dinner/table_front.png',
      cushion: '/assets/dinner/cushion.png',
      cushionShadow: '/assets/dinner/cushion_shadow.png'
    });

    // 8 Selectable Seat configurations
    const SEATS = useMemo(() => [
      // Table 1 (Front Table) Outer Left Cushions:
      { id: 1, position: [-3.8, -1.05, 0.35] },
      { id: 6, position: [-3.2, -0.65, 0.35] },
      { id: 8, position: [-2.6, -0.25, 0.35] },
      { id: 7, position: [-2.0,  0.15, 0.35] },

      // Table 2 (Back Table) Outer Right Cushions:
      { id: 4, position: [ 2.0,  0.55, 0.15] },
      { id: 2, position: [ 2.6,  0.95, 0.15] },
      { id: 3, position: [ 3.2,  1.35, 0.15] },
      { id: 5, position: [ 3.8,  1.75, 0.15] },
    ], []);

    // 8 Decorative Cushions to fill inner positions and heads of tables
    const DECORATIVE_CUSHIONS = useMemo(() => [
      // Table 1 (Front Table) Inner Right Cushions:
      [-0.6,  0.15, 0.25],
      [-1.2, -0.25, 0.25],
      [-1.8, -0.65, 0.25],
      [-2.4, -1.05, 0.25],
      // Table 2 (Back Table) Inner Left Cushions:
      [ 0.6,  0.55, 0.20],
      [ 1.2,  0.95, 0.20],
      [ 1.8,  1.35, 0.20],
      [ 2.4,  1.75, 0.20],
    ], []);

    return (
      <group>
        <SceneController />

        {/* 1. Base Layer: Black Paint Background Splash */}
        {!hideBlackPaint && (
          <mesh position={[0, 0.35, -0.2]} scale={[13.5, 9.5, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={textures.blackPaint} 
              transparent 
              alphaTest={0.01}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* 2. Grid Layer: Isometric Grid Mat */}
        <mesh position={[0, 0.35, -0.1]} scale={[11.5, 7.5, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={textures.gridMat} 
            transparent 
            alphaTest={0.01}
            depthWrite={false}
          />
        </mesh>

        {/* 3. Table Back (decorated) */}
        <mesh position={[0.7, 0.85, 0.1]} scale={[5.5, 3.2, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={textures.tableBack} 
            transparent 
            alphaTest={0.01}
            depthWrite={true}
          />
        </mesh>

        {/* 4. Table Front (decorated) */}
        <mesh position={[-0.7, -0.15, 0.3]} scale={[5.5, 3.2, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={textures.tableFront} 
            transparent 
            alphaTest={0.01}
            depthWrite={true}
          />
        </mesh>

        {/* 5. 8 Selectable Cushions */}
        {SEATS.map((seat) => (
          <CushionSeat 
            key={`seat-${seat.id}`}
            seat={seat}
            isConfirmed={isSeatConfirmed(seat.id)}
            isLockedByOthers={isSeatLockedByOthers(seat.id)}
            isSelected={selectedSeats.includes(seat.id)}
            hoveredSeat={hoveredSeat}
            setHoveredSeat={setHoveredSeat}
            toggleSeat={toggleSeat}
            textures={textures}
          />
        ))}

        {/* 6. 8 Decorative Cushions */}
        {DECORATIVE_CUSHIONS.map((pos, idx) => (
          <DecorativeCushion 
            key={`decor-cushion-${idx}`}
            position={pos}
            textures={textures}
          />
        ))}
      </group>
    );
  };

  return (
    <div className="isometric-3d-stage">
      <Canvas 
        orthographic 
        camera={{ zoom: 55, position: [0, 0, 5] }}
        gl={{ antialias: true }}
      >
        <CanvasContent />
      </Canvas>
    </div>
  );
}
