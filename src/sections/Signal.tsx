import { useEffect, useRef, useState } from 'react';
import ResumeButton from '../components/ResumeButton';
import { person, photos } from '../content';
import { gsap, reducedMotion, scrollToId } from '../lib/scroll';
import './signal.css';

const credits = [...new Map(Object.values(photos).map((p) => [p.handle, p])).values()];

export default function Signal() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!root.current || reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } });
      tl.from(q('.sg-big .cv-ch > span'), { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.04 }, 0)
        .from(q('.sg-wave path'), { strokeDashoffset: 1, duration: 2, ease: 'power2.inOut' }, 0.1)
        .from(q('.sg-in'), { opacity: 0, y: 20, duration: 1, ease: 'expo.out', stagger: 0.08 }, 0.3);
    }, root);
    return () => ctx.revert();
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(person.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
  };

  return (
    <section id="signal" ref={root} className="ground sg" data-ground="orange" aria-label="Plate 009 — signal">

      <h2 className="sg-big display">
        <span className="sr-only">Transmit.</span>
        <span className="cv-word" aria-hidden>{[...'Transmit.'].map((c, i) => <span key={i} className="cv-ch"><span>{c}</span></span>)}</span>
      </h2>

      <svg className="sg-wave" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden>
        <path pathLength={1} strokeDasharray="1" d={Array.from({ length: 121 }, (_, i) => {
          const x = i * 10, a = 30 * Math.exp(-Math.pow((i - 60) / 26, 2));
          return `${i ? 'L' : 'M'}${x} ${40 + Math.sin(i * 0.9) * a}`;
        }).join(' ')} />
      </svg>

      <div className="sg-grid">
        <div className="sg-main sg-in">
          <a className="sg-mail" href={`mailto:${person.email}`}>{person.email}</a>
          <div className="sg-actions">
            <button className="sg-copy mono" onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
            <ResumeButton label="Download résumé" />
          </div>
        </div>
        <ul className="sg-links sg-in">
          <li><a href={person.github} target="_blank" rel="noopener noreferrer"><span className="sg-l">GitHub / {person.githubUser}</span><i aria-hidden>↗</i></a></li>
          <li><a href={person.linkedin} target="_blank" rel="noopener noreferrer"><span className="sg-l">LinkedIn / waqasameer</span><i aria-hidden>↗</i></a></li>
          <li><a href="https://sitemind.tech" target="_blank" rel="noopener noreferrer"><span className="sg-l">SiteMind</span><i aria-hidden>↗</i></a></li>
          <li><a href="https://codeduel.live" target="_blank" rel="noopener noreferrer"><span className="sg-l">CodeDuel</span><i aria-hidden>↗</i></a></li>
        </ul>
      </div>

      <footer className="sg-foot">
        <div className="sg-col sg-in">
          <p>Set in Funnel Display, Funnel Sans and Martian Mono. Built with React, GSAP and d3-geo. Photographs by independent photographers, used under the Unsplash licence:</p>
          <p className="sg-credits">
            {credits.map((c, i) => (
              <span key={c.handle}><a className="link-u" href={`https://unsplash.com/@${c.handle}`} target="_blank" rel="noopener noreferrer">{c.by}</a>{i < credits.length - 1 ? ', ' : '.'}</span>
            ))}
          </p>
        </div>
        <div className="sg-end mono sg-in">
          <span className="reg"><i /></span>
          <span>End of archive · {person.coords} · {new Date().getFullYear()}</span>
          <button className="link-u" onClick={() => scrollToId('archive')}>Back to 10<sup>22</sup> m ↑</button>
        </div>
      </footer>
    </section>
  );
}
