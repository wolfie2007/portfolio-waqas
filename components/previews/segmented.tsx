'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const items = ['Draft', 'Review', 'Ship'];

export function Segmented() {
  const [active, setActive] = useState(1);
  const reduced = useReducedMotion();

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    setActive((current) => (current + direction + items.length) % items.length);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        role="tablist"
        aria-label="Component preview tabs"
        onKeyDown={onKeyDown}
        className="flex rounded-full border border-paper/[0.08] bg-paper/[0.02] p-1"
      >
        {items.map((item, index) => {
          const selected = active === index;

          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={`relative rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                selected ? 'text-paper' : 'text-paper/35 hover:text-paper/65'
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId="segmented-pill"
                  className="absolute inset-0 rounded-full bg-paper/[0.09]"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }
                  }
                />
              ) : null}
              <span className="relative">{item}</span>
            </button>
          );
        })}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/35">
        {items[active]}
      </p>
    </div>
  );
}
