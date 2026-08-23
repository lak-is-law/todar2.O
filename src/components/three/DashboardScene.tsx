'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AbstractGem() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.2}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color="#A88A52" // Antique Gold
          emissive="#285640" // Emerald
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          distort={0.2}
          speed={1}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

export default function DashboardScene() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative', zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Optimize for high DPI displays but cap at 2 for performance
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F4EBDD" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#285640" />
        <AbstractGem />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
