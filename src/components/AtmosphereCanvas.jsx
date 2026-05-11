import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function DriftingParticles() {
  const ref = useRef();
  // Generate random points in a sphere
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 25;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3B3833" // Deep brown/charcoal
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

export default function AtmosphereCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <DriftingParticles />
    </Canvas>
  );
}
