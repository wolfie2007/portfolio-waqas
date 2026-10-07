import { useEffect, useRef, useState } from 'react';
import { photos, src, targets } from '../content';
import { gsap, reducedMotion } from '../lib/scroll';
import './targets.css';

export default function Targets() {
  const root = useRef<HTMLElement>(null);
  const [hot, setHot] = useState<string | null>(null);

  useEffect(() => {
    if (!root.current || reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      gsap.from(q('.tg-head > *'), { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      gsap.fromTo(q('.tg-img'), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: q('.tg-sky')[0], start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo(q('.tg-ring circle'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', stagger: 0.15, scrollTrigger: { trigger: q('.tg-sky')[0], start: 'top 60%' } });
      gsap.from(q('.tg-lbl'), { opacity: 0, x: -10, duration: 0.8, stagger: 0.15, delay: 0.6, scrollTrigger: { trigger: q('.tg-sky')[0], start: 'top 60%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="targets" ref={root} className="ground tg" data-ground="ink" aria-label="Plate 008 — targets">
      <header className="tg-head">
        <h2 className="h-section">Zoom in far enough and<br />you end up looking out.</h2>
        <p className="lede">After the smallest scale comes the biggest one. These are the things I haven't reached yet.</p>
      </header>

      <div className="tg-sky">
        <img className="tg-img" crossOrigin="anonymous" src={src(photos.witchHead, 2400)} alt="Deep-sky photograph of the Witch Head Nebula region" loading="lazy" />
        <div className="tg-vignette" aria-hidden />
        {targets.map((t) => (
          <div key={t.id} className={`tg-t ${hot === t.id ? 'is-hot' : ''}`} style={{ left: `${t.x}%`, top: `${t.y}%`, ['--r' as string]: `${t.r}vmin` }}
            onMouseEnter={() => setHot(t.id)} onMouseLeave={() => setHot(null)}>
            <svg className="tg-ring" viewBox="0 0 100 100" aria-hidden><circle cx="50" cy="50" r="48" pathLength={1} /></svg>
            <div className="tg-lbl">
              <span className="tg-name">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
