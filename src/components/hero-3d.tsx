"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

const EMERALD = "#059669";
const EMERALD_LIGHT = "#34d399";

/** Suzuvchi 3D "imtihon kartalari" guruhi — pointerga reaktiv. */
function FloatingCards() {
  const group = useRef<THREE.Group>(null);

  const cards = useMemo(
    () => [
      { pos: [0, 0, 0], scale: 1.15, color: "#ffffff", speed: 0.6, phase: 0 },
      {
        pos: [-1.9, 0.6, -0.6],
        scale: 0.7,
        color: EMERALD_LIGHT,
        speed: 0.8,
        phase: 1.2,
      },
      {
        pos: [1.9, -0.5, -0.4],
        scale: 0.78,
        color: EMERALD,
        speed: 0.7,
        phase: 2.1,
      },
      {
        pos: [-1.4, -1.1, 0.4],
        scale: 0.55,
        color: "#ffffff",
        speed: 0.9,
        phase: 3.4,
      },
      {
        pos: [1.5, 1.2, 0.2],
        scale: 0.6,
        color: EMERALD_LIGHT,
        speed: 0.75,
        phase: 4.6,
      },
    ],
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // Pointer parallax (silliq)
    const targetY = state.pointer.x * 0.5;
    const targetX = -state.pointer.y * 0.3;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 3);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);

    // Har bir karta yengil tebranadi
    g.children.forEach((child, i) => {
      const c = cards[i];
      if (!c) return;
      child.position.y =
        (c.pos[1] ?? 0) +
        Math.sin(state.clock.elapsedTime * c.speed + c.phase) * 0.18;
      child.rotation.z =
        Math.sin(state.clock.elapsedTime * c.speed * 0.5 + c.phase) * 0.12;
    });
  });

  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <mesh
          key={i}
          position={c.pos as [number, number, number]}
          scale={c.scale}
        >
          <boxGeometry args={[1.4, 1.8, 0.12]} />
          <meshStandardMaterial
            color={c.color}
            roughness={0.25}
            metalness={0.1}
            emissive={c.color}
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Orqa fon zarrachalari — chuqurlik uchun. */
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 120;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={EMERALD_LIGHT}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export function Hero3D() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      {/* Orqa fon nuri */}
      <div className="absolute inset-6 -z-10 rounded-full bg-gradient-to-br from-primary/25 to-emerald-400/10 blur-3xl" />
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 5, 5]} intensity={1.4} />
        <pointLight position={[-5, -3, 2]} intensity={40} color={EMERALD} />
        <FloatingCards />
        <Particles />
      </Canvas>
    </div>
  );
}

// R3F JSX turlarini ta'minlash uchun (build vaqtida)
export type _R3FElements = ThreeElements;
