'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

export function Magnetic() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 280, damping: 20, mass: 0.6 });

  function follow(event: React.PointerEvent<HTMLButtonElement>) {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 16);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 10);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      type="button"
      onPointerMove={follow}
      onPointerLeave={reset}
      onBlur={reset}
      style={{ x: springX, y: springY }}
      className="group inline-flex flex-col items-center gap-2"
      aria-label="Magnetic link preview"
    >
      <span className="text-[1.5rem] leading-none tracking-[-0.04em] text-paper/85 transition-colors group-hover:text-paper">
        Read the notes
      </span>
      <span className="h-px w-full origin-left scale-x-100 bg-paper/25 transition-colors group-hover:bg-paper/55" />
    </motion.button>
  );
}
