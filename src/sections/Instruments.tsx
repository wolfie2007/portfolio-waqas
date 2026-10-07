import { useEffect, useRef } from 'react';
import Schematic, { drawings } from '../components/Schematic';
import { instruments, metrics } from '../content';
import { gsap, reducedMotion } from '../lib/scroll';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);
import './instruments.css';

export default function Instruments() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current || reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      gsap.from(q('.in-head > *'), { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      gsap.from(q('.in-metric'), { opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: q('.in-metrics')[0], start: 'top 85%' } });
      q('.in-item').forEach((item) => {
        const s = gsap.utils.selector(item);
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 72%' } });
        tl.from(s('.in-name .cv-ch > span'), { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.03 }, 0)
          .from(s('.in-copy > *'), { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.15)
          .from(s('.sk-paper'), { opacity: 0, duration: 0.4, stagger: 0.05 }, 0.1)
          .from(s('.sk-draw'), { drawSVG: 0, duration: 0.9, ease: 'power1.inOut', stagger: 0.025 }, 0.1)
          .from(s('.sk-label'), { opacity: 0, duration: 0.5, stagger: 0.04 }, 0.6)
          .from(s('.sk-balloon'), { scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(2.5)', stagger: 0.1 }, 1.1);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="instruments" ref={root} className="ground in" data-ground="white" aria-label="Plate 005 — instruments built">
      <header className="in-head">
        <h2 className="h-section">Things<br />I've built.</h2>
        <p className="lede">Three things I've made. I drew each one the way you'd draw a machine, so you can see how the parts fit together.</p>
      </header>

      <div className="in-metrics">
        {metrics.map((m) => (
          <div className="in-metric" key={m.k}><span className="display">{m.v}</span><span className="mono">{m.k}</span></div>
        ))}
      </div>

      <div className="in-list">
        {instruments.map((it, i) => (
          <article className={`in-item ${i % 2 ? 'is-flip' : ''} ${i === 0 ? 'is-lead' : ''}`} key={it.name} aria-labelledby={`in-${it.name}`}>
            <div className="in-copy">
              <p className="in-kind">{it.kind}</p>
              <h3 id={`in-${it.name}`} className="in-name display">
                <span className="sr-only">{it.name}</span>
                <span aria-hidden className="cv-word">{[...it.name].map((c, k) => <span key={k} className="cv-ch"><span>{c}</span></span>)}</span>
              </h3>
              <p className="in-line">{it.line}</p>
              <p className="in-body">{it.body}</p>
              <ul className="in-stack mono" aria-label="Stack">{it.stack.map((s) => <li key={s}>{s}</li>)}</ul>
              <dl className="in-specs">
                {it.specs.map((s) => <div key={s.k}><dt className="mono">{s.k}</dt><dd>{s.v}</dd></div>)}
              </dl>
              <a className="in-link" href={it.href} target="_blank" rel="noopener noreferrer">
                <span className="in-link-t">{it.hrefLabel}</span>
                <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden><path d="M3 11 11 3M4.5 3H11v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
              </a>
            </div>
            <figure className="in-sheet">
              <Schematic name={it.name} />
              <figcaption className="in-legend">
                {drawings[it.name].legend.map((l, k) => <span key={l}><b>{k + 1}</b>{l}</span>)}
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}
