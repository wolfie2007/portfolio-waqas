import { useEffect, useMemo, useRef, useState } from 'react';
import { person } from '../content';
import { gsap, reducedMotion } from '../lib/scroll';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import './lightcurve.css';

gsap.registerPlugin(DrawSVGPlugin);

type Day = { date: string; count: number };
type Data = { days: Day[]; total: number };

// one star per day, laid out like GitHub's grid: weeks across, weekdays down
const CELL = 18, LEFT = 34, TOP = 30, ROWS = 7;
const CURVE_H = 64, GAP = 40;

const fmtDay = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });

function analyse(days: Day[]) {
  const offset = new Date(days[0].date + 'T00:00:00').getDay();
  const cells = days.map((d, i) => ({ ...d, i, col: Math.floor((i + offset) / 7), row: (i + offset) % 7 }));
  const cols = cells[cells.length - 1].col + 1;
  const max = Math.max(1, ...days.map((d) => d.count));
  const sorted = days.map((d) => d.count).filter(Boolean).sort((a, b) => b - a);
  const bright = sorted[Math.max(0, Math.floor(sorted.length * 0.06) - 1)] ?? max; // top ~6% of active days glow orange

  let run = 0, best = 0, bestEnd = -1, active = 0, peak = cells[0];
  cells.forEach((c, i) => {
    if (c.count > 0) { active++; run++; if (run > best) { best = run; bestEnd = i; } } else run = 0;
    if (c.count > peak.count) peak = c;
  });
  const streak = best > 1 ? cells.slice(bestEnd - best + 1, bestEnd + 1) : [];

  // weekly totals for the light curve under the map
  const weeks = Array.from({ length: cols }, (_, k) => cells.filter((c) => c.col === k).reduce((s, c) => s + c.count, 0));
  const months: { col: number; t: string }[] = [];
  cells.forEach((c) => { if (c.date.endsWith('-01')) months.push({ col: c.col, t: new Date(c.date + 'T00:00:00').toLocaleString('en', { month: 'short' }) }); });
  return { cells, cols, max, bright, active, best, streak, peak, weeks, months };
}

export default function LightCurve() {
  const root = useRef<HTMLElement>(null);
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState(false);
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const started = useRef(false);

  // only point the telescope once the section is near
  useEffect(() => {
    const el = root.current!;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      fetch(`https://github-contributions-api.jogruber.de/v4/${person.githubUser}?y=last`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((j: { total: Record<string, number>; contributions: Day[] }) => {
          const days = j.contributions.filter((d) => d.date <= new Date().toISOString().slice(0, 10)).slice(-365);
          setData({ days, total: j.total.lastYear ?? days.reduce((a, d) => a + d.count, 0) });
        })
        .catch(() => setErr(true));
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const v = useMemo(() => (data ? analyse(data.days) : null), [data]);
  const W = v ? LEFT + v.cols * CELL + 6 : 1000;
  const mapH = TOP + ROWS * CELL;
  const H = mapH + GAP + CURVE_H + 22;
  const cx = (col: number) => LEFT + col * CELL + CELL / 2;
  const cy = (row: number) => TOP + row * CELL + CELL / 2;
  const rad = (c: number) => (c === 0 ? 1.1 : 2.1 + 5.4 * Math.sqrt(c / (v?.max ?? 1)));

  const curve = useMemo(() => {
    if (!v) return null;
    const m = Math.max(1, ...v.weeks), base = mapH + GAP + CURVE_H;
    const pts = v.weeks.map((w, k) => [cx(k), base - (w / m) * CURVE_H] as const);
    // smooth through the weekly points (Catmull-Rom → cubic)
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let k = 0; k < pts.length - 1; k++) {
      const p0 = pts[k - 1] ?? pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] ?? p2;
      const cl = (y: number) => Math.min(base, y); // never dip below zero
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${cl(p1[1] + (p2[1] - p0[1]) / 6)} ${p2[0] - (p3[0] - p1[0]) / 6} ${cl(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
    }
    return { line: d, area: `${d} L${pts[pts.length - 1][0]} ${base} L${pts[0][0]} ${base} Z`, base };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);

  useEffect(() => {
    if (!v || !root.current || reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const tl = gsap.timeline({ scrollTrigger: { trigger: q('.lc-map')[0], start: 'top 80%' } });
    tl.from(q('.lc-star'), { opacity: 0, scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(2)', stagger: { each: 0.0025, from: 'start' } }, 0)
      .from(q('.lc-area'), { opacity: 0, duration: 1 }, 0.4)
      .from(q('.lc-line'), { drawSVG: 0, duration: 1.8, ease: 'power2.inOut' }, 0.3)
      .from(q('.lc-streak'), { drawSVG: '50% 50%', duration: 0.9, ease: 'power2.inOut' }, 1.1)
      .from(q('.lc-band, .lc-streak-t'), { opacity: 0, duration: 0.8 }, 1.3)
      .from(q('.lc-stat'), { opacity: 0, y: 16, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.2);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [v]);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!v) return;
    const svg = e.currentTarget, r = svg.getBoundingClientRect(), k = W / r.width;
    const x = (e.clientX - r.left) * k, y = (e.clientY - r.top) * k;
    const col = Math.floor((x - LEFT) / CELL);
    const row = y < mapH ? Math.floor((y - TOP) / CELL) : -1;
    let cell = row >= 0 ? v.cells.find((c) => c.col === col && c.row === row) : undefined;
    // over the light curve: snap to the busiest day of that week
    if (!cell && y >= mapH) cell = v.cells.filter((c) => c.col === col).sort((a, b) => b.count - a.count)[0];
    setHover(cell ? { i: cell.i, x: cx(cell.col) / W, y: cy(cell.row) / H } : null);
  };

  const h = hover && v ? v.cells[hover.i] : null;

  return (
    <section id="lightcurve" ref={root} className="ground lc" data-ground="paper" aria-label="GitHub activity">
      <header className="lc-head">
        <h2 className="h-section">At 10<sup className="lc-sup">−9</sup> m, it's all<br />switches flipping.</h2>
        <p className="lede">Here's how often mine flip. Every star is one day of the last year on GitHub, private repos included. The bigger the star, the more I pushed that day, and the orange ones were my biggest days.</p>
      </header>

      {v && data && (
        <div className="lc-stats">
          <div className="lc-stat lc-total"><b className="display">{data.total}</b><span>contributions in the last year</span></div>
          <div className="lc-stat"><b className="display">{v.active}</b><span>days I shipped something</span></div>
          <div className="lc-stat"><b className="display">{v.best}</b><span>days, longest streak</span></div>
          <div className="lc-stat"><b className="display">{v.peak.count}</b><span>on my busiest day, {fmtDay(v.peak.date).replace(/, \d{4}$/, '')}</span></div>
        </div>
      )}

      <figure className="lc-fig">
        {!v && (
          <div className="lc-wait">
            {err ? <>Couldn't reach GitHub just now. <a className="link-u" href={person.github}>See it there ↗</a></> : 'Pointing the telescope at GitHub…'}
          </div>
        )}
        {v && curve && (
          <div className="lc-map">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" onPointerMove={onMove} onPointerLeave={() => setHover(null)}
              aria-label={`GitHub contributions over the past year: ${data!.total} total across ${v.active} active days. Longest streak ${v.best} days.`}>
              <g className="lc-axes" aria-hidden>
                {v.months.map((m) => <text key={m.col} x={LEFT + m.col * CELL + 2} y={TOP - 12}>{m.t}</text>)}
                {['Mon', 'Wed', 'Fri'].map((t, k) => <text key={t} x={0} y={cy(1 + k * 2) + 4}>{t}</text>)}
                <path className="lc-base" d={`M${LEFT} ${curve.base} H${W - 6}`} />
              </g>

              <path className="lc-area" d={curve.area} />
              <path className="lc-line" d={curve.line} />

              {v.streak.length > 1 && (() => {
                const a = LEFT + v.streak[0].col * CELL + 3, b = LEFT + (v.streak[v.streak.length - 1].col + 1) * CELL - 3, y = mapH + 8;
                return (
                  <g className="lc-streak-g" aria-hidden>
                    <rect className="lc-band" x={a - 2} y={TOP - 2} width={b - a + 4} height={ROWS * CELL + 4} rx={6} />
                    <path className="lc-streak" d={`M${a} ${y - 5} V${y} H${b} V${y - 5}`} />
                    <text className="lc-streak-t" x={(a + b) / 2} y={y + 15} textAnchor="middle">{v.best} days in a row</text>
                  </g>
                );
              })()}

              <g>
                {v.cells.map((c) => {
                  const r = rad(c.count), hot = c.count >= v.bright && c.count > 0;
                  return (
                    <g key={c.date} className={`lc-star ${c.count ? '' : 'is-zero'} ${hot ? 'is-hot' : ''} ${h?.i === c.i ? 'is-on' : ''}`}>
                      {hot && <path className="lc-spike" d={`M${cx(c.col) - r * 2.2} ${cy(c.row)} H${cx(c.col) + r * 2.2} M${cx(c.col)} ${cy(c.row) - r * 2.2} V${cy(c.row) + r * 2.2}`} />}
                      <circle cx={cx(c.col)} cy={cy(c.row)} r={r} />
                    </g>
                  );
                })}
              </g>
              {h && <circle className="lc-ring" cx={cx(h.col)} cy={cy(h.row)} r={rad(h.count) + 5} />}
            </svg>
            {h && hover && (
              <div className="lc-tip" style={{ left: `${hover.x * 100}%`, top: `${hover.y * 100}%` }}>
                <b>{h.count === 0 ? 'Nothing' : `${h.count} contribution${h.count === 1 ? '' : 's'}`}</b>
                <span>{fmtDay(h.date)}</span>
              </div>
            )}
          </div>
        )}
      </figure>
    </section>
  );
}
