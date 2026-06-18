"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

const EMERALD = "#059669";
const EMERALD_LIGHT = "#34d399";

/** Karta yuzasi uchun "imtihon kartasi" ko'rinishida tekstura chizadi. */
function makeCardTexture(opts: {
  day: string;
  month: string;
  accent: string;
}): THREE.Texture {
  const W = 320;
  const H = 412;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fon (oq karta)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Yuqori accent chiziq
  ctx.fillStyle = opts.accent;
  ctx.fillRect(0, 0, W, 14);

  // Sana bloki
  const bx = 28;
  const by = 44;
  ctx.fillStyle = "rgba(5,150,105,0.10)";
  roundRect(ctx, bx, by, 96, 96, 18);
  ctx.fill();
  ctx.fillStyle = opts.accent;
  ctx.font = "bold 46px Arial";
  ctx.textAlign = "center";
  ctx.fillText(opts.day, bx + 48, by + 52);
  ctx.font = "bold 18px Arial";
  ctx.fillText(opts.month.toUpperCase(), bx + 48, by + 78);

  // "Tasdiqlandi" pill
  ctx.fillStyle = "rgba(5,150,105,0.12)";
  roundRect(ctx, 150, 58, 142, 36, 18);
  ctx.fill();
  ctx.fillStyle = opts.accent;
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("✓ Tasdiqlandi", 166, 81);

  // Sarlavha chizig'i (qora)
  ctx.fillStyle = "#0f172a";
  roundRect(ctx, 28, 168, 230, 22, 8);
  ctx.fill();
  // Ikkilamchi chiziqlar (kulrang)
  ctx.fillStyle = "#e2e8f0";
  roundRect(ctx, 28, 210, 264, 16, 8);
  ctx.fill();
  roundRect(ctx, 28, 238, 180, 16, 8);
  ctx.fill();

  // Ajratuvchi
  ctx.strokeStyle = "#eef2f6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(28, 290);
  ctx.lineTo(292, 290);
  ctx.stroke();

  // Narx (yashil) + joy
  ctx.fillStyle = opts.accent;
  ctx.font = "bold 22px Arial";
  ctx.fillText("300 000 so'm", 28, 332);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "16px Arial";
  ctx.fillText("50 joy · Telegram", 28, 364);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Suzuvchi 3D imtihon kartalari — har biri to'ldirilgan ko'rinishda. */
function FloatingCards() {
  const group = useRef<THREE.Group>(null);

  const cards = useMemo(
    () => [
      {
        pos: [0, 0, 0.2],
        scale: 1.2,
        day: "15",
        month: "iyun",
        accent: EMERALD,
        speed: 0.6,
        phase: 0,
      },
      {
        pos: [-2, 0.7, -0.6],
        scale: 0.72,
        day: "03",
        month: "iyul",
        accent: EMERALD_LIGHT,
        speed: 0.8,
        phase: 1.2,
      },
      {
        pos: [2, -0.6, -0.4],
        scale: 0.78,
        day: "21",
        month: "iyun",
        accent: EMERALD,
        speed: 0.7,
        phase: 2.1,
      },
      {
        pos: [-1.5, -1.2, 0.3],
        scale: 0.56,
        day: "09",
        month: "avg",
        accent: EMERALD_LIGHT,
        speed: 0.9,
        phase: 3.4,
      },
      {
        pos: [1.6, 1.3, 0.1],
        scale: 0.6,
        day: "28",
        month: "iyun",
        accent: EMERALD,
        speed: 0.75,
        phase: 4.6,
      },
    ],
    [],
  );

  const textures = useMemo(() => cards.map((c) => makeCardTexture(c)), [cards]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const targetY = t * 0.18 + state.pointer.x * 0.5;
    const targetX = -state.pointer.y * 0.3;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 2);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);

    g.children.forEach((child, i) => {
      const c = cards[i];
      if (!c) return;
      child.position.y =
        (c.pos[1] ?? 0) + Math.sin(t * c.speed + c.phase) * 0.18;
      child.rotation.z = Math.sin(t * c.speed * 0.5 + c.phase) * 0.08;
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
          <boxGeometry args={[1.4, 1.8, 0.08]} />
          <meshStandardMaterial
            map={textures[i]}
            roughness={0.4}
            metalness={0.05}
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
    const count = 100;
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
      <div className="absolute inset-6 -z-10 rounded-full bg-gradient-to-br from-primary/25 to-emerald-400/10 blur-3xl" />
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, 2]} intensity={30} color={EMERALD} />
        <FloatingCards />
        <Particles />
      </Canvas>
    </div>
  );
}

// R3F JSX turlarini ta'minlash uchun (build vaqtida)
export type _R3FElements = ThreeElements;
