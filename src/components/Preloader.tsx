import { useEffect } from 'react';
import { font, image, run, type Asset } from '../lib/preload';
import { gsap, reducedMotion } from '../lib/scroll';

const MIN_MS = 1400;  // long enough to read, short enough to never feel like waiting
const MAX_MS = 8000;  // a slow network never holds the site hostage


type Props = { onHandoff: () => void; onGone: () => void; criticalImages: { url: string; label: string }[] };

let started = false; // StrictMode runs effects twice; the preloader must run once

/*
  The preloader markup and styles are inline in index.html, so it paints
  before this bundle even arrives. This component only reports real progress
  (fonts + the first images) and plays the exit: the orange dot opens into a
  hole and the archive appears through it.
*/
export default function Preloader({ onHandoff, onGone, criticalImages }: Props) {
  useEffect(() => {
    const el = document.getElementById('pl');
    if (!el || started) { if (!el) { onHandoff(); onGone(); } return; }
    started = true;
    // dev-only: screenshot jumps (?at= / ?y=) skip straight to the site
    if (import.meta.env.DEV && /[?&](at|y|nopl)=/.test(location.search)) {
      el.remove(); document.body.classList.remove('is-loading'); onHandoff(); onGone(); return;
    }
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const arc = el.querySelector<SVGCircleElement>('.arc')!;
    const num = el.querySelector('.pct b')!;
    const t0 = performance.now();
    let real = 0, shown = 0, last = t0, raf = 0, dog = 0, done = false;

    document.fonts.load('700 40px "Funnel Display Variable"').then(() => el.classList.add('fonts'), () => el.classList.add('fonts'));

    const assets: Asset[] = [
      font('700 100px "Funnel Display Variable"', 'display'),
      font('400 16px "Funnel Sans Variable"', 'sans'),
      font('500 12px "Martian Mono Variable"', 'mono'),
      ...criticalImages.map((c) => ({ label: c.label, load: () => image(c.url) })),
    ];
    run(assets, (_l, n, total) => { real = n / total; });

    const reduce = reducedMotion();

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf); clearTimeout(dog);
      arc.style.strokeDashoffset = '0';
      num.textContent = '100';
      const R = Math.hypot(innerWidth, innerHeight) / 2 + 40;
      const tl = gsap.timeline({
        onComplete: () => { el.remove(); document.body.classList.remove('is-loading'); onGone(); },
      });
      if (reduce) {
        tl.add(onHandoff).to(el, { opacity: 0, duration: 0.4 });
        return;
      }
      tl.to(el.querySelectorAll('.txt'), { opacity: 0, y: 10, duration: 0.35, ease: 'power2.in' }, 0.15)
        .to(el.querySelector('.dot'), { attr: { r: 30 }, duration: 0.45, ease: 'power3.in' }, 0.1)
        .add(onHandoff, 0.45)
        .to(el, { '--hole': `${R}px`, duration: 1.1, ease: 'expo.inOut' }, 0.4);
    };

    const loop = () => {
      cancelAnimationFrame(raf); clearTimeout(dog);
      const now = performance.now(), el2 = now - t0;
      const goal = reduce ? real : Math.min(real, el2 / MIN_MS);
      const dt = Math.min(100, now - last); last = now;
      shown += (goal - shown) * (1 - Math.exp(-dt / 140)); // frame-rate independent ease
      if (goal >= 1 && shown > 0.99) shown = 1;
      arc.style.strokeDashoffset = String(1 - shown);
      num.textContent = String(Math.floor(shown * 100));
      if (shown >= 1 || el2 > MAX_MS) { finish(); return; }
      raf = requestAnimationFrame(loop);
      dog = window.setTimeout(loop, 250); // rAF pauses in background tabs
    };
    loop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
