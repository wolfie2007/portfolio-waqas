'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function SpringSwitch() {
  const [on, setOn] = useState(true);
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Toggle preview"
        onClick={() => setOn((value) => !value)}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={`relative h-9 w-16 rounded-full border border-paper/15 p-1 transition-colors duration-300 ${
          on ? 'bg-paper/[0.12]' : 'bg-paper/[0.03]'
        }`}
      >
        <motion.span
          className="block h-7 w-7 origin-center rounded-full bg-paper"
          animate={{ x: on ? 28 : 0, scaleX: pressed ? 1.18 : 1 }}
          transition={
            reduced
              ? { duration: 0 }
              : { type: 'spring', stiffness: 500, damping: 27, mass: 0.7 }
          }
        />
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/35">
        {on ? 'On' : 'Off'}
      </p>
    </div>
  );
}
