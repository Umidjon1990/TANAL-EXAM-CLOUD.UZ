"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HeroVisual } from "@/components/hero-visual";
import { TiltCard } from "@/components/tilt-card";

// WebGL sahna faqat kerak bo'lganda yuklanadi (lazy, SSR'siz)
const Hero3D = dynamic(
  () => import("@/components/hero-3d").then((m) => m.Hero3D),
  { ssr: false, loading: () => <HeroVisual /> },
);

/**
 * Kuchli qurilmaларда (keng ekran + nozik pointer + reduced-motion emas)
 * WebGL 3D sahna; aks holda yengil 2D karta (tilt bilan).
 */
export function HeroShowcase() {
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const capable =
      window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setUse3d(capable);
  }, []);

  if (use3d) return <Hero3D />;

  return (
    <TiltCard max={14}>
      <HeroVisual />
    </TiltCard>
  );
}
