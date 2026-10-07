import { useMemo } from 'react';
import rough from 'roughjs';
import type { Options } from 'roughjs/bin/core';
import '@fontsource-variable/caveat';

/*
  Hand-drawn system sketches, the way I'd draw them on paper to explain a
  project. Rough.js does the wobbly ink; everything is seeded so the drawing
  is the same on every visit. Only parts named in the project text appear.
*/

type Box = { x: number; y: number; w: number; h: number; t: string; s?: string; hot?: boolean; stack?: number };
type Link = { a: [number, number]; b: [number, number]; bend?: number; t?: string; tx?: number; ty?: number; rot?: number; both?: boolean };
type Note = { x: number; y: number; t: string; a: [number, number]; b: [number, number]; bend?: number };
type Balloon = { x: number; y: number; n: number };
export type Drawing = { boxes: Box[]; links: Link[]; balloons: Balloon[]; note?: Note; legend: string[] };

export const drawings: Record<string, Drawing> = {
  SiteMind: {
    boxes: [
      { x: 40, y: 58, w: 180, h: 80, t: 'Your website', s: 'any public site' },
      { x: 40, y: 318, w: 180, h: 80, t: 'Crawler', s: 'reads every page' },
      { x: 296, y: 180, w: 214, h: 112, t: 'Knowledge base', s: 'chunks + pgvector', hot: true },
      { x: 590, y: 58, w: 180, h: 80, t: 'Gemini', s: 'answers from sources' },
      { x: 590, y: 318, w: 180, h: 80, t: 'Chat widget', s: 'one line of code' },
    ],
    links: [
      { a: [128, 144], b: [124, 310], bend: 16, t: 'crawl', tx: 140, ty: 236, rot: -4 },
      { a: [226, 352], b: [290, 266], bend: -22, t: 'index', tx: 238, ty: 372, rot: -3 },
      { a: [516, 214], b: [584, 112], bend: 20, t: 'hybrid search', tx: 584, ty: 178, rot: -3, both: true },
      { a: [680, 144], b: [682, 310], bend: -14, t: 'cited answer', tx: 694, ty: 236, rot: -4 },
    ],
    balloons: [{ x: 402, y: 160, n: 1 }, { x: 792, y: 58, n: 2 }, { x: 792, y: 318, n: 3 }],
    note: { x: 300, y: 412, t: 'the hard part', a: [360, 398], b: [392, 302], bend: 18 },
    legend: ['Knowledge base built from your site', 'Answers only from your content', 'Source attached to every answer'],
  },
  CodeDuel: {
    boxes: [
      { x: 40, y: 58, w: 180, h: 80, t: 'Player A', s: 'browser' },
      { x: 40, y: 318, w: 180, h: 80, t: 'Player B', s: 'browser' },
      { x: 296, y: 180, w: 214, h: 112, t: 'Room server', s: 'Next.js + Socket.IO', hot: true },
      { x: 590, y: 58, w: 180, h: 80, t: 'Judge0', s: 'runs code in Docker' },
      { x: 590, y: 318, w: 180, h: 80, t: 'Gemini', s: 'writes the problem' },
    ],
    links: [
      { a: [226, 104], b: [290, 214], bend: -20, t: 'live', tx: 212, ty: 186, rot: -4, both: true },
      { a: [226, 352], b: [290, 262], bend: 20, t: 'live', tx: 212, ty: 300, rot: 4, both: true },
      { a: [516, 214], b: [584, 104], bend: 20, t: 'submit / verdict', tx: 584, ty: 178, rot: -3, both: true },
      { a: [584, 352], b: [516, 264], bend: 18, t: 'new problem', tx: 470, ty: 352, rot: 4 },
    ],
    balloons: [{ x: 402, y: 160, n: 1 }, { x: 792, y: 58, n: 2 }, { x: 792, y: 318, n: 3 }],
    note: { x: 300, y: 412, t: 'both screens stay in sync', a: [390, 398], b: [404, 302], bend: -14 },
    legend: ['Live rooms kept in sync', 'Code judged in a sandbox', 'A fresh AI-written problem every match'],
  },
  Encrypto: {
    boxes: [
      { x: 40, y: 190, w: 170, h: 84, t: 'Input', s: 'files + data' },
      { x: 280, y: 172, w: 200, h: 120, t: 'C++ core', s: 'encrypt / decrypt', hot: true },
      { x: 560, y: 60, w: 200, h: 80, t: 'Ciphers', s: 'several algorithms', stack: 3 },
      { x: 560, y: 318, w: 200, h: 80, t: 'SQLite', s: 'local store' },
      { x: 280, y: 380, w: 200, h: 72, t: 'install.sh', s: 'Bash on Linux' },
    ],
    links: [
      { a: [216, 232], b: [274, 232], bend: -8, t: 'in', tx: 236, ty: 214, rot: -4 },
      { a: [486, 200], b: [552, 112], bend: 18, both: true },
      { a: [486, 264], b: [552, 352], bend: -18, t: 'save', tx: 532, ty: 300, rot: 6, both: true },
      { a: [380, 374], b: [380, 298], bend: 10, t: 'installs', tx: 392, ty: 344, rot: -4 },
    ],
    balloons: [{ x: 380, y: 150, n: 1 }, { x: 790, y: 44, n: 2 }, { x: 790, y: 318, n: 3 }],
    note: { x: 40, y: 360, t: 'the engine', a: [110, 352], b: [272, 286], bend: 26 },
    legend: ['Encryption engine in C++', 'Several encryption algorithms', 'Structured storage in SQLite'],
  },
};

const INK = '#171717', ORANGE = '#FF5A1F', PAPER = '#FFFFFF';

const rr = (x: number, y: number, w: number, h: number, r = 12) =>
  `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;

// a curved stroke from a to b, bowed sideways by `bend`
function curve(a: [number, number], b: [number, number], bend = 0) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const c: [number, number] = [mx - (dy / L) * bend, my + (dx / L) * bend];
  return { d: `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`, c };
}
// two short strokes for an arrowhead at `tip`, coming from `from`
function head(tip: [number, number], from: [number, number], len = 13) {
  const ang = Math.atan2(tip[1] - from[1], tip[0] - from[0]);
  const p = (s: number) => [tip[0] - len * Math.cos(ang + s), tip[1] - len * Math.sin(ang + s)];
  const [l, r] = [p(0.45), p(-0.45)];
  return `M${l[0]} ${l[1]} L${tip[0]} ${tip[1]} L${r[0]} ${r[1]}`;
}

type P = { d: string; k: 'ink' | 'fill' | 'hatch' | 'mark' | 'paper' };

function build(name: string, dw: Drawing) {
  const gen = rough.generator();
  let seed = [...name].reduce((s, c) => s + c.charCodeAt(0), 0);
  const o = (extra: Options = {}): Options => ({ seed: ++seed, roughness: 1.15, bowing: 1.2, strokeWidth: 1.7, stroke: INK, preserveVertices: false, ...extra });
  const out: P[] = [];
  const push = (shape: ReturnType<typeof gen.path>, k: P['k'], fillK: P['k'] = 'fill') =>
    gen.toPaths(shape).forEach((p) => out.push({ d: p.d, k: p.fill && p.fill !== 'none' ? 'paper' : p.stroke === INK ? k : fillK }));

  for (const b of dw.boxes) {
    const n = b.stack ?? 1;
    for (let k = n - 1; k >= 0; k--) {
      const x = b.x + k * 9, y = b.y - k * 9;
      push(gen.path(rr(x, y, b.w, b.h), o({ fill: PAPER, fillStyle: 'solid' })), 'ink');
    }
    if (b.hot) {
      push(gen.path(rr(b.x + 7, b.y + 7, b.w - 14, b.h - 14, 8), o({
        stroke: 'none', fill: ORANGE, fillStyle: 'hachure', hachureGap: 7, hachureAngle: -41, fillWeight: 1.4, roughness: 1.6,
      })), 'hatch', 'hatch');
      // a second, heavier outline: the box I traced over twice
      push(gen.path(rr(b.x - 3, b.y - 3, b.w + 6, b.h + 6, 14), o({ stroke: ORANGE, strokeWidth: 2.2, roughness: 1.6 })), 'mark', 'mark');
    }
  }
  const arrow = (a: [number, number], b: [number, number], bend: number, both?: boolean, k: P['k'] = 'ink', col = INK) => {
    const c = curve(a, b, bend);
    push(gen.path(c.d, o({ stroke: col, strokeWidth: 1.5, roughness: 0.9, bowing: 0.6 })), k, k);
    push(gen.path(head(b, c.c), o({ stroke: col, strokeWidth: 1.6, roughness: 0.6 })), k, k);
    if (both) push(gen.path(head(a, c.c), o({ stroke: col, strokeWidth: 1.6, roughness: 0.6 })), k, k);
  };
  dw.links.forEach((l) => arrow(l.a, l.b, l.bend ?? 0, l.both));
  if (dw.note) arrow(dw.note.a, dw.note.b, dw.note.bend ?? 0, false, 'mark', ORANGE);
  const balloons = dw.balloons.map((b) => gen.toPaths(gen.circle(b.x, b.y, 30, o({ stroke: ORANGE, strokeWidth: 1.6, fill: ORANGE, fillStyle: 'solid', roughness: 0.8 }))));
  return { paths: out, balloons };
}

export default function Schematic({ name }: { name: string }) {
  const dw = drawings[name];
  const art = useMemo(() => (dw ? build(name, dw) : null), [name, dw]);
  if (!dw || !art) return null;
  return (
    <svg className="sch" viewBox="0 0 820 470" role="img" aria-label={`Sketch of how ${name} works: ${dw.legend.join(', ')}`}>
      {art.paths.map((p, i) => (
        <path key={i} d={p.d} className={`sk-${p.k} ${p.k === 'paper' ? '' : 'sk-draw'}`} />
      ))}
      {dw.boxes.map((b) => (
        <g key={b.t} className="sk-label">
          <text className="sk-t" x={b.x + 18} y={b.y + 36}>{b.t}</text>
          {b.s && <text className="sk-s" x={b.x + 18} y={b.y + 62}>{b.s}</text>}
        </g>
      ))}
      {dw.links.map((l, i) => l.t && (
        <text key={i} className="sk-lt sk-label" x={l.tx} y={l.ty} transform={`rotate(${l.rot ?? 0} ${l.tx} ${l.ty})`}>{l.t}</text>
      ))}
      {dw.note && <text className="sk-note sk-label" x={dw.note.x} y={dw.note.y + 30} transform={`rotate(-3 ${dw.note.x} ${dw.note.y})`}>{dw.note.t}</text>}
      {dw.balloons.map((b, i) => (
        <g key={b.n} className="sk-balloon">
          {art.balloons[i].map((p, k) => <path key={k} d={p.d} className={p.fill && p.fill !== 'none' ? 'sk-bfill' : 'sk-bline'} />)}
          <text x={b.x} y={b.y + 8}>{b.n}</text>
        </g>
      ))}
    </svg>
  );
}
