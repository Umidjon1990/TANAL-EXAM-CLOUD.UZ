"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Sichqoncha harakatiga qarab 3D egiluvchi (tilt) konteyner.
 * - Faqat nozik (fine) pointer'da ishlaydi; sensorli ekranда tekis qoladi.
 * - prefers-reduced-motion bo'lsa o'chiriladi (motion-reduce).
 * - transform GPU'да, willChange bilan — silliq va arzon.
 */
export function TiltCard({
  children,
  className,
  max = 9,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(
        2,
      )}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
    });
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ willChange: "transform" }}
      className={cn(
        "h-full transition-transform duration-300 ease-out [transform-style:preserve-3d] motion-reduce:!transform-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
