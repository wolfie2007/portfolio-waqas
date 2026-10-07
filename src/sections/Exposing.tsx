import { useEffect, useRef } from 'react';
import { exposing, photos, src } from '../content';
import { gsap, reducedMotion } from '../lib/scroll';
import './exposing.css';

const STRIP = src(photos.veil, 1800, '&h=900');

export default function Exposing() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const q = gsap.utils.selector(root.current);
    if (reducedMotion()) { q('.ex-row').forEach((r) => (r as HTMLElement).style.setProperty('--p', (r as HTMLElement).dataset.p!)); return; }
    const ctx = gsap.context(() => {
      gsap.from(q('.ex-head > *'), { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      q('.ex-row').forEach((row) => {
        const el = row as HTMLElement, p = Number(el.dataset.p);
        const num = el.querySelector('.ex-pct')!;
        const o = { v: 0 };
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 82%' } })
          .from(el.querySelectorAll('.ex-meta > *'), { opacity: 0, y: 16, duration: 0.8, ease: 'expo.out', stagger: 0.05 }, 0)
          .to(o, { v: p, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.style.setProperty('--p', String(o.v)); num.textContent = String(Math.round(o.v)).padStart(2, '0'); } }, 0.15);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="exposing" ref={root} className="ground ex" data-ground="ink" aria-label="Plate 006 — now exposing">
      <header className="ex-head">
        <h2 className="h-section">Long exposures,<br />still open.</h2>
        <p className="lede">Faint things take a long time to show up on a photo. These are the things I'm still learning, with a rough guess at how far in I am.</p>
      </header>

      <ol className="ex-list">
        {exposing.map((e, i) => (
          <li key={e.name} className="ex-row" data-p={e.pct} style={{ ['--p' as string]: 0, ['--y' as string]: `${15 + i * 22}%` }}>
            <div className="ex-meta">
              <h3 className="ex-name display">{e.name}</h3>
              <p className="ex-note">{e.note}</p>
            </div>
            <div className="ex-strip" aria-label={`${e.pct}% exposed`} role="img">
              <div className="ex-raw" style={{ backgroundImage: `url(${STRIP})` }} />
              <div className="ex-dev" style={{ backgroundImage: `url(${STRIP})` }} />
              <div className="ex-shutter"><span className="mono"><b className="ex-pct">00</b>%</span></div>
              <div className="ex-scale" aria-hidden />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
