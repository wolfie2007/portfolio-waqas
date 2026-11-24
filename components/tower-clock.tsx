'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

function readLocalTime(): Time {
  const now = new Date();
  return {
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  };
}

const CENTER = 50;

/** Point measured as a radius from the dial centre, 0° at twelve, clockwise. */
function point(radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(angle),
    y: CENTER - radius * Math.cos(angle),
  };
}

/** All sixty minute marks as one path — one node instead of sixty. */
const MINUTE_TRACK = Array.from({ length: 60 }, (_, minute) => {
  const inner = point(minute % 5 === 0 ? 39.9 : 41.2, minute * 6);
  const outer = point(43.3, minute * 6);
  return `M${inner.x.toFixed(2)} ${inner.y.toFixed(2)}L${outer.x.toFixed(2)} ${outer.y.toFixed(2)}`;
}).join('');

const HOURS = Array.from({ length: 12 }, (_, index) => index);

const FACE = '#cfc7b8';
const INK = '#141210';

/** Asymptotic rubber-band curve so pulling further feels progressively heavier. */
function rubberBand(offset: number, maxPull = 120): number {
  return maxPull * Math.tanh(offset / maxPull);
}

export function TowerClock() {
  const root = useRef<HTMLDivElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const cordShadowRef = useRef<SVGPathElement>(null);
  const anchorRef = useRef<SVGCircleElement>(null);
  const prevSecondsRef = useRef<number | null>(null);
  const cumulativeSecondsRef = useRef<number>(0);

  const [time, setTime] = useState<Time | null>(null);
  const [inView, setInView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const reduced = useReducedMotion();

  // Motion values for zero-rerender 60-120fps drag + elastic spring-back
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragOriginRef = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const tilt = useTransform(x, [-120, 120], [-14, 14]);

  const updateCord = () => {
    const host = root.current;
    const path = cordRef.current;
    const shadow = cordShadowRef.current;
    const anchor = anchorRef.current;
    if (!host || !path || !shadow || !anchor) return;

    const halfW = host.clientWidth / 2;
    const halfH = host.clientHeight / 2;
    const cx = x.get();
    const cy = y.get();
    const dist = Math.hypot(cx, cy);

    anchor.setAttribute('cx', halfW.toFixed(1));
    anchor.setAttribute('cy', halfH.toFixed(1));

    if (dist < 1) {
      path.style.opacity = '0';
      shadow.style.opacity = '0';
      anchor.style.opacity = '0';
      return;
    }

    // Slight catenary sag when slack, pulls taut as distance grows
    const tension = Math.min(1, dist / 110);
    const sag = (1 - tension * 0.78) * Math.min(16, dist * 0.18);
    const startX = halfW;
    const startY = halfH;
    const endX = halfW + cx;
    const endY = halfH + cy;
    const midX = (startX + endX) * 0.5;
    const midY = (startY + endY) * 0.5 + sag;

    const d = `M ${startX.toFixed(1)} ${startY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    const width = (1.9 - tension * 0.65).toFixed(2);

    path.setAttribute('d', d);
    path.setAttribute('stroke-width', width);
    path.style.opacity = (0.75 + tension * 0.25).toFixed(2);

    shadow.setAttribute('d', d);
    shadow.setAttribute('stroke-width', (Number(width) + 1.4).toFixed(2));
    shadow.style.opacity = '0.55';

    anchor.style.opacity = '0.8';
  };

  useMotionValueEvent(x, 'change', updateCord);
  useMotionValueEvent(y, 'change', updateCord);

  // Only run the dial while the footer is near the viewport
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '300px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tick = () => {
      const next = readLocalTime();
      const prev = prevSecondsRef.current;

      if (prev === null) {
        cumulativeSecondsRef.current = next.seconds;
      } else {
        const delta = (next.seconds - prev + 60) % 60;
        cumulativeSecondsRef.current += delta === 0 ? 1 : delta;
      }

      prevSecondsRef.current = next.seconds;
      setTime(next);
    };

    tick();

    if (!inView) return;

    const interval = window.setInterval(tick, 1_000);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        prevSecondsRef.current = null;
        tick();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [inView]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    dragOriginRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: x.get(),
      startY: y.get(),
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const origin = dragOriginRef.current;
    if (!origin) return;

    const rawX = origin.startX + (event.clientX - origin.pointerX);
    const rawY = origin.startY + (event.clientY - origin.pointerY);

    x.set(rubberBand(rawX, 130));
    y.set(rubberBand(rawY, 105));
  }

  function release() {
    if (!dragOriginRef.current) return;
    dragOriginRef.current = null;
    setIsDragging(false);

    if (reduced) {
      x.set(0);
      y.set(0);
      return;
    }

    const spring = {
      type: 'spring' as const,
      stiffness: 340,
      damping: 15,
      mass: 0.85,
    };

    animate(x, 0, spring);
    animate(y, 0, spring);
  }

  const secondAngle = cumulativeSecondsRef.current * 6;
  const minuteAngle = time ? (time.minutes + time.seconds / 60) * 6 : 0;
  const hourAngle = time
    ? ((time.hours % 12) + time.minutes / 60 + time.seconds / 3600) * 30
    : 0;

  const label = time
    ? `Local time ${time.hours}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`
    : 'Local analog clock';

  return (
    <div
      ref={root}
      className="absolute aspect-square -translate-x-1/2 -translate-y-1/2"
      style={{
        left: 'var(--clock-left)',
        top: 'var(--clock-top)',
        width: 'var(--clock-w)',
      }}
    >
      {/* Recessed dark socket revealed when the clock is pulled out of the tower */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[2%] z-0 rounded-full bg-[#090807] shadow-[inset_0_2px_10px_rgba(0,0,0,0.95)] ring-1 ring-paper/[0.08]"
      />

      {/* Elastic cord connecting the tower socket center to the dragged clock */}
      <svg
        aria-hidden
        overflow="visible"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      >
        <path
          ref={cordShadowRef}
          d="M 0 0 L 0 0"
          fill="none"
          stroke="#000000"
          strokeWidth="3.2"
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
        <path
          ref={cordRef}
          d="M 0 0 L 0 0"
          fill="none"
          stroke="#e4dccb"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
        <circle
          ref={anchorRef}
          cx="50%"
          cy="50%"
          r="2.6"
          fill="#e4dccb"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* Draggable clock dial */}
      <motion.div
        style={{
          x,
          y,
          rotate: reduced ? 0 : tilt,
          touchAction: 'none',
        }}
        animate={{
          scale: isDragging ? 1.06 : 1,
        }}
        transition={
          reduced
            ? { duration: 0 }
            : { type: 'spring', stiffness: 450, damping: 26 }
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        className={`relative z-20 h-full w-full select-none rounded-full transition-shadow duration-200 ${
          isDragging
            ? 'cursor-grabbing shadow-[0_14px_34px_rgba(0,0,0,0.75)]'
            : 'cursor-grab hover:shadow-[0_4px_16px_rgba(0,0,0,0.45)]'
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label={label}
          className="pointer-events-none block h-full w-full overflow-visible"
        >
          {/* aged dial, warmed to sit inside the photograph instead of cutting into it */}
          <circle cx="50" cy="50" r="49.4" fill={FACE} fillOpacity="0.97" />
          <circle
            cx="50"
            cy="50"
            r="49.4"
            fill="none"
            stroke={INK}
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="46.6"
            fill="none"
            stroke={INK}
            strokeOpacity="0.1"
            strokeWidth="2.6"
          />
          <circle
            cx="50"
            cy="50"
            r="45.2"
            fill="none"
            stroke={INK}
            strokeOpacity="0.34"
            strokeWidth="0.4"
          />

          <path
            d={MINUTE_TRACK}
            fill="none"
            stroke={INK}
            strokeOpacity="0.45"
            strokeWidth="0.38"
            strokeLinecap="butt"
          />

          {/* hour blocks — heavy at 12/3/6/9, sitting just inside the minute ring */}
          {HOURS.map((index) => {
            const quarter = index % 3 === 0;
            const width = quarter ? 2.8 : 1.3;
            return (
              <rect
                key={index}
                x={50 - width / 2}
                y={quarter ? 11.4 : 12.2}
                width={width}
                height={quarter ? 4.8 : 3.8}
                fill={INK}
                fillOpacity={quarter ? 0.92 : 0.6}
                transform={`rotate(${index * 30} 50 50)`}
              />
            );
          })}

          {time ? (
            <>
              {/* Hour hand */}
              <g
                style={{
                  transform: `rotate(${hourAngle}deg)`,
                  transformOrigin: '50px 50px',
                  transition: 'transform 0.8s linear',
                }}
              >
                <path
                  d="M 48.95 54.4 L 49.3 31.2 L 50 29 L 50.7 31.2 L 51.05 54.4 Z"
                  fill={INK}
                />
              </g>

              {/* Minute hand */}
              <g
                style={{
                  transform: `rotate(${minuteAngle}deg)`,
                  transformOrigin: '50px 50px',
                  transition: 'transform 0.8s linear',
                }}
              >
                <path
                  d="M 49.45 55.6 L 49.62 21.2 L 50 19 L 50.38 21.2 L 50.55 55.6 Z"
                  fill={INK}
                />
              </g>

              {/* Second hand — mechanical 1s escapement tick */}
              <g
                style={{
                  transform: `rotate(${secondAngle}deg)`,
                  transformOrigin: '50px 50px',
                  transition: reduced
                    ? 'none'
                    : 'transform 140ms cubic-bezier(0.34, 1.4, 0.64, 1)',
                }}
              >
                <path
                  d="M 49.55 60 L 49.78 16.5 L 50 14.5 L 50.22 16.5 L 50.45 60 Z"
                  fill={INK}
                  fillOpacity="0.82"
                />
              </g>

              <circle cx="50" cy="50" r="2.6" fill={INK} />
              <circle cx="50" cy="50" r="0.9" fill={FACE} />
            </>
          ) : null}
        </svg>
      </motion.div>
    </div>
  );
}
