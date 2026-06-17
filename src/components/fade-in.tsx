"use client";

import * as motion from "motion/react-client";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Yengil kirish animatsiyasi — ekranda ko'ringanda bir marta ishlaydi.
 * Performance uchun `viewport once` va kichik transform ishlatiladi.
 */
export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
