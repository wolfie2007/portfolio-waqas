'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { scalePoint } from 'd3-scale';
import { curveBumpX, line } from 'd3-shape';
import type { Dream } from '@/content/site';
import { Section } from './section';

const hairline = 'rgba(232, 230, 226, 0.10)';
const hairlineStrong = 'rgba(232, 230, 226, 0.32)';

const draw = {
  initial: { pathLength: 0, opacity: 0 },
  transition: {
    duration: 1.1,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

function useDreamGraph(dreams: Dream[]) {
  return useMemo(() => {
    const desktopX = scalePoint<number>()
      .domain(dreams.map((dream) => dream.id))
      .range([64, 656])
      .padding(0);

    const desktop = {
      width: 720,
      height: 248,
      nodeY: 64,
      ai: { x: 360, y: 196 },
      points: dreams.map((dream) => ({
        ...dream,
        x: desktopX(dream.id) ?? 0,
        y: 64,
      })),
    };

    const mobile = {
      width: 360,
      height: 392,
      nodeX: 40,
      ai: { x: 300, y: 348 },
      points: dreams.map((dream, index) => ({
        ...dream,
        x: 40,
        y: 48 + index * 58,
      })),
    };

    const edge = line<[number, number]>()
      .x((point) => point[0])
      .y((point) => point[1])
      .curve(curveBumpX);

    return {
      desktop: {
        ...desktop,
        edges: desktop.points
          .filter((point) => point.ai)
          .map((point) => ({
            id: point.id,
            d:
              edge([
                [desktop.ai.x, desktop.ai.y - 20],
                [point.x, point.y + 16],
              ]) ?? '',
          })),
      },
      mobile: {
        ...mobile,
        edges: mobile.points
          .filter((point) => point.ai)
          .map((point) => ({
            id: point.id,
            d:
              edge([
                [mobile.ai.x, mobile.ai.y - 17],
                [point.x + 14, point.y],
              ]) ?? '',
          })),
      },
    };
  }, [dreams]);
}

export function Dreams({ dreams }: { dreams: Dream[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const { desktop, mobile } = useDreamGraph(dreams);

  return (
    <Section
      id="dreams"
      index="04"
      title="Dreams"
      intro="A timeline I keep revising. Three of these lean on AI; the rest are mine alone."
    >
      <div className="mt-10">
        <svg
          viewBox={`0 0 ${desktop.width} ${desktop.height}`}
          className="hidden w-full md:block"
          aria-hidden
        >
          <motion.path
            d={`M64 ${desktop.nodeY}H${desktop.width - 64}`}
            fill="none"
            stroke={hairline}
            strokeWidth={1}
            initial={draw.initial}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ ...draw.transition, duration: 0.8 }}
          />

          {desktop.edges.map((edge, index) => (
            <motion.path
              key={edge.id}
              d={edge.d}
              fill="none"
              stroke={
                active === edge.id ? hairlineStrong : 'rgba(232, 230, 226, 0.14)'
              }
              strokeWidth={1}
              className="transition-[stroke] duration-300"
              initial={draw.initial}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ ...draw.transition, delay: 0.2 + index * 0.1 }}
            />
          ))}

          {desktop.points.map((point) => {
            const isActive = active === point.id;

            return (
              <g
                key={point.id}
                onPointerEnter={() => setActive(point.id)}
                onPointerLeave={() => setActive(null)}
              >
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  fill="#0a0a0a"
                  stroke={isActive ? hairlineStrong : hairline}
                  strokeWidth={1}
                  initial={false}
                  animate={{ r: isActive ? 16 : 14 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 28 }
                  }
                  className="transition-[stroke] duration-300"
                />
                <text
                  x={point.x}
                  y={point.y + 3.6}
                  textAnchor="middle"
                  fill="rgba(232, 230, 226, 0.62)"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                >
                  {String(point.id).padStart(2, '0')}
                </text>
                <text
                  x={point.x}
                  y={point.y + 38}
                  textAnchor="middle"
                  fill="rgba(232, 230, 226, 0.34)"
                  fontFamily="var(--font-mono)"
                  fontSize={9.5}
                  letterSpacing="0.08em"
                >
                  {point.year}
                </text>
              </g>
            );
          })}

          <g>
            <circle
              cx={desktop.ai.x}
              cy={desktop.ai.y}
              r={18}
              fill="#0a0a0a"
              stroke={hairline}
            />
            <text
              x={desktop.ai.x}
              y={desktop.ai.y + 3.6}
              textAnchor="middle"
              fill="rgba(232, 230, 226, 0.66)"
              fontFamily="var(--font-mono)"
              fontSize={10}
              letterSpacing="0.06em"
            >
              AI
            </text>
            <text
              x={desktop.ai.x}
              y={desktop.ai.y + 38}
              textAnchor="middle"
              fill="rgba(232, 230, 226, 0.28)"
              fontFamily="var(--font-mono)"
              fontSize={8.5}
              letterSpacing="0.08em"
            >
              SHARED DEPENDENCY
            </text>
          </g>
        </svg>

        <svg
          viewBox={`0 0 ${mobile.width} ${mobile.height}`}
          className="w-full md:hidden"
          aria-hidden
        >
          <motion.path
            d={`M${mobile.nodeX} 28V${mobile.height - 42}`}
            fill="none"
            stroke={hairline}
            strokeWidth={1}
            initial={draw.initial}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ ...draw.transition, duration: 0.8 }}
          />

          {mobile.edges.map((edge, index) => (
            <motion.path
              key={edge.id}
              d={edge.d}
              fill="none"
              stroke={
                active === edge.id ? hairlineStrong : 'rgba(232, 230, 226, 0.14)'
              }
              strokeWidth={1}
              className="transition-[stroke] duration-300"
              initial={draw.initial}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ ...draw.transition, delay: 0.2 + index * 0.1 }}
            />
          ))}

          {mobile.points.map((point) => {
            const isActive = active === point.id;

            return (
              <g
                key={point.id}
                onPointerEnter={() => setActive(point.id)}
                onPointerLeave={() => setActive(null)}
              >
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  fill="#0a0a0a"
                  stroke={isActive ? hairlineStrong : hairline}
                  strokeWidth={1}
                  initial={false}
                  animate={{ r: isActive ? 16 : 14 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 420, damping: 28 }
                  }
                  className="transition-[stroke] duration-300"
                />
                <text
                  x={point.x}
                  y={point.y + 3.6}
                  textAnchor="middle"
                  fill="rgba(232, 230, 226, 0.62)"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                >
                  {String(point.id).padStart(2, '0')}
                </text>
                <text
                  x={point.x + 26}
                  y={point.y + 3.4}
                  fill="rgba(232, 230, 226, 0.36)"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  letterSpacing="0.06em"
                >
                  {point.year}
                </text>
              </g>
            );
          })}

          <g>
            <circle
              cx={mobile.ai.x}
              cy={mobile.ai.y}
              r={16}
              fill="#0a0a0a"
              stroke={hairline}
            />
            <text
              x={mobile.ai.x}
              y={mobile.ai.y + 3.6}
              textAnchor="middle"
              fill="rgba(232, 230, 226, 0.66)"
              fontFamily="var(--font-mono)"
              fontSize={10}
              letterSpacing="0.06em"
            >
              AI
            </text>
          </g>
        </svg>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
          <span>01–03 depend on AI</span>
          <span className="hidden sm:inline">Hover a goal to trace it</span>
        </div>
      </div>

      <ol className="mt-10 border-t border-paper/[0.08]">
        {dreams.map((dream, index) => {
          const isActive = active === dream.id;

          return (
            <li
              key={dream.id}
              onPointerEnter={() => setActive(dream.id)}
              onPointerLeave={() => setActive(null)}
              className="border-b border-paper/[0.08]"
            >
              <div className="flex items-baseline gap-4 py-5 sm:gap-6">
                <span className="w-6 shrink-0 font-mono text-[10px] tracking-[0.12em] text-paper/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <h3
                      className={`text-[1.0625rem] leading-6 transition-colors duration-300 ${
                        isActive ? 'text-paper' : 'text-paper/80'
                      }`}
                    >
                      {dream.title}
                    </h3>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/30">
                      {dream.year}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-[52ch] text-sm leading-6 text-paper/45">
                    {dream.note}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
