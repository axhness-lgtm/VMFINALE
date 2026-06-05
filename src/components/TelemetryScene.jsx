import React, { useMemo, useEffect } from 'react';
import { useGLTF, Html, Outlines, Line } from '@react-three/drei';
import * as THREE from 'three';

// Define the platter nodes structure for hover syncing in 3D
const THREE_NODES = [
  { id: 'CRUNCH_LAYER', label: 'FRY_STACK', position: [-4.5, 2.5, -4.5], category: 'CRUNCH', details: 'QTY: 1 BATCH // CRISP: MAXIMUM' },
  { id: 'DIP_NODE_01', label: 'HUMMUS', position: [-8, 2.2, 2.5], category: 'COLD', details: 'OIL: EXTRA_VIRGIN OLIVE' },
  { id: 'DIP_NODE_02', label: 'CHEESE_SAUCE', position: [-4.5, 2.0, 1.5], category: 'HEAT', details: 'TEMP: 52.0°C // EMULSION: STABLE' },
  { id: 'DIP_NODE_03', label: 'YOGURT_DILL', position: [-1.5, 2.0, 4.5], category: 'COLD', details: 'HERB: FRESH HARVEST' },
  { id: 'PROTEIN_UNIT', label: 'BONELESS', position: [3.5, 2.5, -4.5], category: 'MEAT', details: 'PREP: SPICED BATCH_04' },
  { id: 'SWEET_BLOCK', label: 'MARSHMALLOW', position: [5.5, 2.2, 4], category: 'SWEET', details: 'SURFACE: TOASTED ALIGN' },
  { id: 'HEAT_CORE', label: 'TOASTED', position: [5.5, 2.8, 4], category: 'HEAT', details: 'TEMP: 88.5°C // CAST_IRON_BASE' },
  { id: 'BREAD_STACK', label: 'NAAN_CUT', position: [-3, 2.2, 3.5], category: 'CARB', details: 'STYLE: HEARTH FLIPPED' }
];

// Recursive component to render GLTF nodes as React elements with outlines
function BrutalistNode({ node, activeNode, nodeId, setActiveNode }) {
  const isHovered = activeNode && activeNode.id === nodeId;

  // Render Mesh
  if (node.isMesh) {
    const material = useMemo(() => {
      const mat = node.material.clone();
      mat.roughness = 1.0;
      mat.metalness = 0.0;
      return mat;
    }, [node.material]);

    // Apply real-time emissive hover glow
    useEffect(() => {
      material.emissive = new THREE.Color(isHovered ? '#e45a0b' : '#000000');
      material.emissiveIntensity = isHovered ? 0.35 : 0;
    }, [isHovered, material]);

    return (
      <mesh
        geometry={node.geometry}
        material={material}
        position={node.position}
        rotation={node.rotation}
        scale={node.scale}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          if (nodeId) {
            e.stopPropagation();
            const matchedNode = THREE_NODES.find(n => n.id === nodeId);
            if (matchedNode) setActiveNode(matchedNode);
          }
        }}
        onPointerOut={(e) => {
          if (nodeId) {
            e.stopPropagation();
            setActiveNode(null);
          }
        }}
      >
        {/* Outlines draw the clean Ink Blue contour line */}
        <Outlines thickness={0.06} color="#002fa7" opacity={1} />
      </mesh>
    );
  }

  // Render Group / Object3D recursively
  if (node.children && node.children.length > 0) {
    return (
      <group
        position={node.position}
        rotation={node.rotation}
        scale={node.scale}
      >
        {node.children.map((child, index) => (
          <BrutalistNode
            key={index}
            node={child}
            activeNode={activeNode}
            nodeId={nodeId}
            setActiveNode={setActiveNode}
          />
        ))}
      </group>
    );
  }

  return null;
}

export default function TelemetryScene({ activeNode, setActiveNode }) {
  // Load 8 GLTF models
  const table = useGLTF('/assets/platter/main_table_canvas.glb');
  const woodenPlank = useGLTF('/assets/platter/wooden_block_platter.glb');
  const skillet = useGLTF('/assets/platter/cast_iron_skillet.glb');
  const dipBowl = useGLTF('/assets/platter/square_dip_bowl.glb');
  const friesStack = useGLTF('/assets/platter/waffle_fries_nest.glb');
  const chipRing = useGLTF('/assets/platter/nacho_chip_ring.glb');
  const proteinRow = useGLTF('/assets/platter/protein_veggie_row.glb');
  const dessertPile = useGLTF('/assets/platter/marshmallow_graham_pile.glb');

  return (
    <group>
      {/* Invisible deep blue shadow capture deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.16} color="#002fa7" />
      </mesh>

      {/* Layer 1: Table Canvas Frame */}
      <BrutalistNode node={table.scene} activeNode={activeNode} setActiveNode={setActiveNode} />

      {/* Layer 2: Planks and Trays */}
      <BrutalistNode node={woodenPlank.scene} activeNode={activeNode} setActiveNode={setActiveNode} />
      
      {/* Skillet and Dessert pile share the skillet position */}
      <group position={[5.5, 0.2, 4]}>
        <BrutalistNode node={skillet.scene} activeNode={activeNode} nodeId="HEAT_CORE" setActiveNode={setActiveNode} />
        <BrutalistNode node={dessertPile.scene} activeNode={activeNode} nodeId="SWEET_BLOCK" setActiveNode={setActiveNode} />
      </group>

      {/* Layer 3: Cloned Dip Bowls */}
      <group position={[-8, 1.0, 2.5]}>
        <BrutalistNode node={dipBowl.scene} activeNode={activeNode} nodeId="DIP_NODE_01" setActiveNode={setActiveNode} />
      </group>
      <group position={[-4.5, 0.4, 1.5]}>
        <BrutalistNode node={dipBowl.scene} activeNode={activeNode} nodeId="DIP_NODE_02" setActiveNode={setActiveNode} />
      </group>
      <group position={[-1.5, 0.4, 4.5]}>
        <BrutalistNode node={dipBowl.scene} activeNode={activeNode} nodeId="DIP_NODE_03" setActiveNode={setActiveNode} />
      </group>

      {/* Layer 4: Culinary Proxies */}
      <group position={[-4.5, 1.0, -4.5]}>
        <BrutalistNode node={friesStack.scene} activeNode={activeNode} nodeId="CRUNCH_LAYER" setActiveNode={setActiveNode} />
      </group>
      <group position={[-3, 0.2, 3.5]}>
        <BrutalistNode node={chipRing.scene} activeNode={activeNode} nodeId="BREAD_STACK" setActiveNode={setActiveNode} />
      </group>
      <group position={[3.5, 0.2, -4.5]}>
        <BrutalistNode node={proteinRow.scene} activeNode={activeNode} nodeId="PROTEIN_UNIT" setActiveNode={setActiveNode} />
      </group>

      {/* 3D Dashed leader lines and targets */}
      {THREE_NODES.map((node) => {
        const isActive = activeNode?.id === node.id;
        const lineStart = [node.position[0], 0.2, node.position[2]];
        const lineEnd = [node.position[0], node.position[1] - 0.25, node.position[2]];
        
        return (
          <group key={`node-wire-${node.id}`}>
            {/* Dashed blueprint tether line, made solid and thicker when active */}
            <Line
              points={[lineStart, lineEnd]}
              color={isActive ? "#e45a0b" : "#002fa7"}
              lineWidth={isActive ? 2.5 : 1.5}
              dashed={!isActive}
              dashScale={4}
              dashSize={0.15}
              gapSize={0.15}
            />
            {/* Target Reticle Anchor Dot */}
            <mesh position={lineStart}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color={isActive ? "#e45a0b" : "#002fa7"} />
            </mesh>
          </group>
        );
      })}

      {/* 3D Drei HTML Floating Telemetry Badges */}
      {THREE_NODES.map((node) => {
        const isActive = activeNode?.id === node.id;
        return (
          <Html
            key={`three-badge-${node.id}`}
            position={node.position}
            center
            distanceFactor={15}
          >
            <div className={`telemetry-badge ${isActive ? 'hot-state' : ''}`}>
              <div className="badge-header">
                <span>{node.id}</span>
                <span className="square-marker"></span>
              </div>
              <div className="badge-body">[ {node.label} ]</div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}
