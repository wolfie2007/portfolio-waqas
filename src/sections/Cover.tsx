import { useEffect, useRef, useState } from 'react';
import GlassButton from '../components/GlassButton';
import { exposing, instruments, intro, obsessions, person, targets } from '../content';
import { createSky, lensPoint, type SkyState } from '../lib/sky';
import { gsap, reducedMotion, scrollToId, ScrollTrigger } from '../lib/scroll';
import './cover.css';

/*
  Constellations are the menu. Each one is a part of the site, drawn as a
  small star pattern. Shapes are in unit coords (about −1..1); `at` is the
  centre on a wide screen, `tall` on a narrow one.
*/
type Con = {
  id: string; name: string; line: string;
  pts: [number, number][]; edges: [number, number][];
  at: [number, number]; tall: [number, number];
};
const CONS: Con[] = [
  { id: 'obsessions', name: 'The Rabbit Hole', line: `${obsessions.length} things I can't stop looking at`,
    pts: [[0, 0], [0.42, -0.22], [0.55, 0.3], [-0.05, 0.62], [-0.68, 0.22], [-0.6, -0.5], [0.12, -0.9], [0.95, -0.62]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]], at: [0.7, 0.18], tall: [0.72, 0.3] },
  { id: 'station', name: 'The Desk', line: 'Where I work, and what with',
    pts: [[-1, -0.25], [0, -0.32], [1, -0.22], [0.82, 0.55], [-0.85, 0.5], [0.08, -0.85]],
    edges: [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5]], at: [0.2, 0.43], tall: [0.24, 0.42] },
  { id: 'instruments', name: 'The Workbench', line: `${instruments.length} things I've built`,
    pts: [[-1, -0.15], [-0.35, -0.32], [0.35, -0.28], [1, -0.48], [0.55, 0.22], [0.02, 0.55], [-0.62, 0.38]],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [6, 1]], at: [0.87, 0.41], tall: [0.7, 0.52] },
  { id: 'exposing', name: 'The Lantern', line: `${exposing.length} things I'm learning right now`,
    pts: [[0, -1], [0.5, -0.2], [0, 0.7], [-0.5, -0.2], [0, -0.25], [0, 1.05]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 1], [2, 5]], at: [0.53, 0.44], tall: [0.36, 0.6] },
  { id: 'lightcurve', name: 'The Streak', line: 'A year of code, one star per day',
    pts: [[-1, 0.42], [-0.6, -0.08], [-0.2, 0.3], [0.2, -0.42], [0.6, 0.02], [1, -0.62]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]], at: [0.7, 0.62], tall: [0.66, 0.72] },
  { id: 'targets', name: 'The Far Shore', line: `${targets.length} places I want to end up`,
    pts: [[-1, 0.35], [-0.25, 0.12], [0.55, -0.18], [1, -0.65], [0.62, 0.42], [0.2, 0.62]],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]], at: [0.43, 0.64], tall: [0.3, 0.18] },
];
const LENS = 30;   // css px: how hard the cursor bends starlight

const Letters = ({ text }: { text: string }) => (
  <span className="cv-word" aria-hidden>
    {[...text].map((c, i) => <span key={i} className="cv-ch"><span>{c}</span></span>)}
  </span>
);

export default function Cover({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !root.current) return;
    const r = root.current;
    const stage = r.querySelector<HTMLElement>('.cv-stage')!;
    const canvas = r.querySelector<HTMLCanvasElement>('.cv-sky')!;
    const svg = r.querySelector<SVGSVGElement>('.cv-cons')!;
    const tag = r.querySelector<HTMLElement>('.cv-tag')!;
    const hits = [...r.querySelectorAll<HTMLButtonElement>('.cv-hit')];
    const ink = r.querySelector<HTMLElement>('.cv-ink')!;
    const reduce = reducedMotion();
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const sky = (() => { try { return createSky(canvas); } catch { return null; } })();
    if (!sky) r.classList.add('no-gl');

    // ---- constellation geometry (stage px) ----
    type Laid = { con: Con; base: [number, number][]; box: { l: number; t: number; r: number; b: number } };
    let laid: Laid[] = [];
    let vw = 0, vh = 0;
    const groups = CONS.map((c) => ({
      path: svg.querySelector<SVGPathElement>(`[data-id="${c.id}"] .cn-line`)!,
      ghost: svg.querySelector<SVGPathElement>(`[data-id="${c.id}"] .cn-ghost`)!,
      stars: [...svg.querySelectorAll<SVGCircleElement>(`[data-id="${c.id}"] .cn-star`)],
    }));
    const measure = () => {
      vw = stage.clientWidth; vh = stage.clientHeight;
      svg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
      const wide = vw / vh > 1.05;
      const unit = Math.min(92, Math.max(44, (wide ? vw / 1440 : vw / 600) * 68));
      laid = CONS.map((con, i) => {
        const [cx, cy] = wide ? con.at : con.tall;
        const base = con.pts.map(([x, y]) => [cx * vw + x * unit, cy * vh + y * unit] as [number, number]);
        const xs = base.map((p) => p[0]), ys = base.map((p) => p[1]);
        const box = { l: Math.min(...xs), t: Math.min(...ys), r: Math.max(...xs), b: Math.max(...ys) };
        const pad = 26, h = hits[i];
        h.style.transform = `translate(${box.l - pad}px, ${box.t - pad}px)`;
        h.style.width = `${box.r - box.l + pad * 2}px`; h.style.height = `${box.b - box.t + pad * 2}px`;
        return { con, base, box };
      });
      sky?.resize();
      lastSig = [NaN, NaN, NaN, NaN, NaN];
      placeTag();
    };

    // ---- live state ----
    const S: SkyState = { mouse: [0, 0], cursor: [-9999, -9999], lens: 0, travel: 0, streak: 0, band: 1, intro: reduce ? 1 : 0 };
    const mouseT: [number, number] = [0, 0];
    const cursorT: [number, number] = [-9999, -9999];
    let lastSig = [NaN, NaN, NaN, NaN, NaN];
    let lensT = 0, warpU = 0, warpS = 0, lastTravel = 0;
    let current: string | null = null, by: 'user' | 'auto' | null = null;
    let lastUser = performance.now(), nextAuto = 0, autoI = 0;

    const placeTag = () => {
      const L = laid.find((l) => l.con.id === current);
      if (!L) return;
      const right = L.box.r + 300 < vw - 90;
      const x = right ? L.box.r + 28 : L.box.l - 28;
      const y = (L.box.t + L.box.b) / 2;
      tag.style.transform = `translate(${x}px, ${y}px) translate(${right ? '0' : '-100%'}, -50%)`;
      tag.classList.toggle('is-left', !right);
    };
    const show = (id: string | null, who: 'user' | 'auto' | null) => {
      if (who === 'user') lastUser = performance.now();
      if (id === current) { by = id ? who : null; return; }
      current = id; by = id ? who : null;
      setActive(id);
      r.querySelectorAll('.cn').forEach((g) => g.classList.toggle('is-on', g.getAttribute('data-id') === id));
      placeTag();
    };

    // ---- input ----
    const onMove = (e: PointerEvent) => {
      const b = stage.getBoundingClientRect();
      const x = e.clientX - b.left, y = e.clientY - b.top;
      mouseT[0] = (x / b.width) * 2 - 1; mouseT[1] = (y / b.height) * 2 - 1;
      if (cursorT[0] < -9000) { S.cursor[0] = x; S.cursor[1] = y; }
      cursorT[0] = x; cursorT[1] = y; lensT = LENS;
      lastUser = performance.now();
      if (by === 'auto') show(null, null);
    };
    const onLeave = () => { lensT = 0; mouseT[0] = mouseT[1] = 0; };
    if (fine && !reduce) {
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerleave', onLeave);
    }
    const offs = hits.map((h, i) => {
      const id = CONS[i].id;
      const on = () => show(id, 'user');
      const off = () => { if (current === id) show(null, null); };
      const go = () => scrollToId(id);
      h.addEventListener('pointerenter', on); h.addEventListener('pointerleave', off);
      h.addEventListener('focus', on); h.addEventListener('blur', off);
      h.addEventListener('click', go);
      return () => { h.removeEventListener('pointerenter', on); h.removeEventListener('pointerleave', off);
        h.removeEventListener('focus', on); h.removeEventListener('blur', off); h.removeEventListener('click', go); };
    });

    // ---- scroll: the warp ----
    const st = ScrollTrigger.create({
      trigger: r, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { warpU = self.progress; },
    });
    const fadeTl = gsap.timeline({ paused: true })
      .to(r.querySelectorAll('.cv-fade'), { opacity: 0, y: -26, duration: 0.12, stagger: 0.012, ease: 'power1.in' }, 0.02)
      .to({}, { duration: 0.86 });

    // ---- the loop ----
    const t0 = performance.now();
    let raf = 0, visible = true;
    const frame = (now: number) => {
      raf = 0;
      const t = (now - t0) / 1000;
      if (!reduce) S.intro = Math.min(1, t / 2.6);

      // easing toward targets
      S.mouse[0] += (mouseT[0] - S.mouse[0]) * 0.05; S.mouse[1] += (mouseT[1] - S.mouse[1]) * 0.05;
      S.cursor[0] += (cursorT[0] - S.cursor[0]) * 0.22; S.cursor[1] += (cursorT[1] - S.cursor[1]) * 0.22;
      S.lens += (lensT * (1 - warpS) - S.lens) * 0.08;

      // warp, smoothed so the streaks have momentum
      warpS += (warpU - warpS) * 0.12;
      const w = reduce ? 0 : warpS;
      const dive = 0.95 * Math.pow(w, 1.7);
      const vel = Math.abs(dive - lastTravel); lastTravel = dive;   // only the dive streaks, never the idle drift
      S.travel = t * 0.0035 + dive;
      S.streak += (Math.min(0.2, vel * 7 + 0.05 * Math.sin(Math.PI * Math.min(1, w * 1.15))) - S.streak) * 0.2;
      S.band = 1 - Math.min(1, Math.max(0, (w - 0.08) / 0.4));
      fadeTl.progress(w);
      ink.style.opacity = String(Math.min(1, Math.max(0, (w - 0.8) / 0.18)));

      sky?.draw(S, t);

      // constellations ride the same parallax and lens as the far stars
      const px = S.mouse[0] * 5, py = S.mouse[1] * 5;
      const sig = [px, py, S.cursor[0], S.cursor[1], S.lens];
      const moved = sig.some((v, k) => !(Math.abs(v - lastSig[k]) <= 0.05));
      if (moved) lastSig = sig;
      if (moved) laid.forEach((L, i) => {
        const g = groups[i];
        const pts = L.base.map(([x, y]) => lensPoint(x + px, y + py, S.cursor[0], S.cursor[1], S.lens));
        pts.forEach((p, k) => { g.stars[k].setAttribute('cx', p[0].toFixed(1)); g.stars[k].setAttribute('cy', p[1].toFixed(1)); });
        const d = L.con.edges.map(([a, b]) => `M${pts[a][0].toFixed(1)} ${pts[a][1].toFixed(1)}L${pts[b][0].toFixed(1)} ${pts[b][1].toFixed(1)}`).join('');
        g.path.setAttribute('d', d); g.ghost.setAttribute('d', d);
      });

      // when nobody's exploring, the sky shows its constellations one by one
      if (S.intro >= 1 && w < 0.02 && now - lastUser > 4500 && now > nextAuto && by !== 'user') {
        show(CONS[autoI++ % CONS.length].id, 'auto');
        nextAuto = now + 3400;
      }

      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(stage);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVis);

    measure(); start();
    const onResize = () => { measure(); start(); };
    window.addEventListener('resize', onResize);

    // entrance for the type
    const q = gsap.utils.selector(r);
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    if (reduce) gsap.set(q('.cv-in'), { opacity: 1 });
    else intro
      .fromTo(q('.cv-ch > span'), { yPercent: 105 }, { yPercent: 0, duration: 1.4, stagger: 0.035 }, 0.5)
      .fromTo(q('.cv-in'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 1.0);

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); st.kill(); fadeTl.kill(); intro.kill(); sky?.destroy();
      offs.forEach((f) => f());
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [ready]);

  const on = CONS.find((c) => c.id === active);

  return (
    <section id="archive" ref={root} className={`cover ${ready ? 'is-ready' : ''}`} data-ground="ink" aria-label="Introduction">
      <div className="cv-stage">
        <canvas className="cv-sky" aria-hidden />

        <svg className="cv-cons cv-fade" aria-hidden>
          {CONS.map((c) => (
            <g key={c.id} className="cn" data-id={c.id}>
              <path className="cn-ghost" />
              <path className="cn-line" pathLength={1} />
              {c.pts.map((_, k) => <circle key={k} className="cn-star" r={k === 0 ? 2.4 : 1.7} />)}
            </g>
          ))}
        </svg>

        <nav className="cv-hits cv-fade" aria-label="Constellations">
          {CONS.map((c) => (
            <button key={c.id} className="cv-hit" aria-label={`${c.name}: ${c.line}`} />
          ))}
        </nav>

        <div className={`cv-tag cv-fade ${on ? 'is-on' : ''}`} aria-hidden>
          {on && <><b className="display">{on.name}</b><span>{on.line}</span></>}
        </div>

        <h1 className="cv-name display">
          <span className="sr-only">{person.name}</span>
          <span className="cv-first cv-fade"><Letters text={person.first} /></span>
          <span className="cv-last cv-fade"><Letters text={person.last} /></span>
        </h1>

        <div className="cv-low cv-fade">
          <p className="cv-intro lede cv-in">{intro}</p>
          <div className="cv-actions cv-in">
            <GlassButton href={person.resume}>
              Résumé
              <span className="cv-doc" aria-hidden>
                <svg viewBox="0 0 16 16" width="16" height="16"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </GlassButton>
            <span className="cv-hint">Hover the stars, or scroll to fly in</span>
          </div>
        </div>

        <div className="cv-ink" aria-hidden />
      </div>
    </section>
  );
}
