import { useEffect, useMemo, useRef, useState } from 'react';
import Plate from '../components/Plate';
import Draft from '../components/Draft';
import { obsessions, src } from '../content';
import { gsap, reducedMotion } from '../lib/scroll';
import { OBS_BG } from '../content';
import './obsessions.css';

const W = 1000, H = 620;
const radius = (mag: number) => 2.5 + (4.2 - mag) * 2.3;

// deterministic faint field stars
function field(n: number) {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => ({ x: r() * W, y: r() * H, r: 0.4 + r() * r() * 1.6, o: 0.2 + r() * 0.55 }));
}

// order of the "constellation" that joins the obsessions
const LINKS = [3, 1, 0, 6, 4, 7, 2, 5, 2];

export default function Obsessions() {
  const root = useRef<HTMLElement>(null);
  const [sel, setSel] = useState(0);
  const stars = useMemo(() => field(170), []);
  const o = obsessions[sel];

  useEffect(() => {
    if (!root.current || reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: q('.ob-chart')[0], start: 'top 75%' } });
      tl.from(q('.ob-field circle'), { opacity: 0, duration: 1.2, stagger: { each: 0.004, from: 'random' } }, 0)
        .from(q('.ob-grid path'), { opacity: 0, duration: 1 }, 0)
        .fromTo(q('.ob-links path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, 0.3)
        .from(q('.ob-star'), { scale: 0, transformOrigin: 'center', duration: 0.9, ease: 'back.out(2)', stagger: 0.07 }, 0.4)
        .from(q('.ob-lbl'), { opacity: 0, duration: 0.6, stagger: 0.07 }, 0.8);
      gsap.from(q('.ob-head > *'), { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: q('.ob-head')[0], start: 'top 80%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  // swap the plate with a short developer's flash
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!card.current || reducedMotion()) return;
    gsap.fromTo(card.current.querySelectorAll('.ob-swap'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 });
  }, [sel]);

  return (
    <section id="obsessions" ref={root} className="ground ob" data-ground="ink" aria-label="Plate 002 — obsessions">
      <img className="ob-bg" crossOrigin="anonymous" src={OBS_BG} alt="" aria-hidden loading="lazy" />

      <header className="ob-head">
        <h2 className="h-section">Things I can't stop<br />looking at.</h2>
        <p className="lede">I plotted them like stars. Astronomers count brightness backwards, so a smaller number means a brighter star. The <b>brightest</b> ones here are what I think about <b>most</b>. Click one to see more.</p>
      </header>

      <div className="ob-body">
        <div className="ob-chart">
          <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Star chart of obsessions">
            <g className="ob-grid" aria-hidden>
              {Array.from({ length: 11 }, (_, i) => {
                const x = i * 100, top = 500 + (x - 500) * 0.06;
                return <path key={`v${i}`} d={`M${x} ${H} L${top} 0`} />;
              })}
              {Array.from({ length: 7 }, (_, i) => {
                const y = 10 + i * 100;
                return <path key={`h${i}`} d={`M0 ${y} Q500 ${y + 26} ${W} ${y}`} />;
              })}
              {['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h'].map((t, i) => (
                <text key={t} x={i * 100 + 6} y={H - 8}>{t}</text>
              ))}
              {['+60°', '+45°', '+30°', '+15°', '0°', '−15°'].map((t, i) => (
                <text key={t} x={6} y={i * 100 + 26}>{t}</text>
              ))}
            </g>
            <g className="ob-field" aria-hidden>
              {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />)}
            </g>
            <g className="ob-links" aria-hidden>
              <path pathLength={1} strokeDasharray="1" d={LINKS.map((k, i) => `${i ? 'L' : 'M'}${obsessions[k].x} ${obsessions[k].y}`).join(' ')} />
            </g>
            {obsessions.map((ob, i) => {
              const r = radius(ob.mag), active = i === sel;
              return (
                <g key={ob.cat} className={`ob-star ${active ? 'is-active' : ''}`} transform={`translate(${ob.x} ${ob.y})`}
                  role="button" tabIndex={0} aria-pressed={active} aria-label={`${ob.name}, magnitude ${ob.mag}`}
                  onClick={() => setSel(i)} onMouseEnter={() => setSel(i)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSel(i))}>
                  <circle className="ob-hit" r={Math.max(22, r + 14)} />
                  <circle className="ob-glow" r={r * 3.2} />
                  <circle className="ob-core" r={r} />
                  <circle className="ob-ring" r={r + 9} />
                  <path className="ob-tick" d={`M${-r - 18} 0h8M${r + 10} 0h8M0 ${-r - 18}v8M0 ${r + 10}v8`} />
                </g>
              );
            })}
            {obsessions.map((ob, i) => (
              <text key={`l${ob.cat}`} className={`ob-lbl ${i === sel ? 'is-active' : ''}`} x={ob.x + radius(ob.mag) + 14} y={ob.y - radius(ob.mag) + 4} aria-hidden>
                {ob.name}
              </text>
            ))}
          </svg>

          <div className="ob-legend mono" aria-hidden>
            <span>Magnitude</span>
            {[0, 1, 2, 3, 4].map((m) => <i key={m} style={{ width: radius(m) * 2, height: radius(m) * 2 }} />)}
            <span>obsessed → curious</span>
          </div>
        </div>

        <div className="ob-card" ref={card} aria-live="polite">
          <Plate key={o.cat} className="ob-plate ob-swap" src={src(o.photo, 900)} alt={o.name} />
          <h3 className="ob-name display ob-swap">{o.name}<Draft on={o.draft} /></h3>
          <p className="ob-note ob-swap">{o.note}</p>
        </div>
      </div>

      <ol className="ob-cat mono" aria-label="Catalogue">
        {obsessions.map((ob, i) => (
          <li key={ob.cat}>
            <button className={i === sel ? 'is-active' : ''} onClick={() => setSel(i)}>
              <span>{ob.cat}</span><span>{ob.name}</span><span>m {ob.mag.toFixed(1)}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
