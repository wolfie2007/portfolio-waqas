import { useEffect, useRef, useState } from 'react';
import { plates, type PlateId } from '../content';
import { scrollToId } from '../lib/scroll';
import './frame.css';

const Exp = ({ e }: { e: string }) =>
  e === '∞' ? <>∞</> : <>10<sup>{e}</sup></>;

const STEP = 34; // px between plates on the rail

/*
  The scale rail. A ruler on the right edge with one mark per plate, read
  like the scale bar on a microscope. An orange cursor slides along it as
  you scroll; hovering opens the labels. On phones it folds into one button.
*/
export default function Frame({ visible }: { visible: boolean }) {
  const [active, setActive] = useState<PlateId>('archive');
  const [ground, setGround] = useState('paper');
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const cursor = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    // section bounds are cached; scroll only does arithmetic
    let secs: { id: string; top: number; h: number; ground: string }[] = [];
    let grounds: { top: number; bottom: number; g: string }[] = [];
    const measure = () => {
      secs = plates.map((p) => {
        const el = document.getElementById(p.id);
        return { id: p.id, top: el ? el.offsetTop : 0, h: el ? el.offsetHeight : 1, ground: el?.dataset.ground ?? 'paper' };
      });
      grounds = [...document.querySelectorAll<HTMLElement>('main > [data-ground]')].map((el) => ({
        top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight, g: el.dataset.ground!,
      }));
    };

    let last = '';
    // cheap arithmetic only, so it runs straight from the scroll event
    const tick = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let i = 0;
      while (i < secs.length - 1 && mid >= secs[i + 1].top) i++;
      const s = secs[i];
      const p = Math.min(1, Math.max(0, (mid - s.top) / s.h));
      if (cursor.current) cursor.current.style.transform = `translateY(${(i + p) * STEP}px)`;
      if (s.id !== last) { last = s.id; setActive(s.id as PlateId); }
      const g = grounds.find((x) => mid >= x.top && mid < x.bottom)?.g;
      if (g) setGround((prev) => (prev === g ? prev : g));
    };
    const onScroll = tick;
    const onResize = () => { measure(); tick(); };
    measure(); tick();
    // layout settles after fonts/images; re-measure a couple of times
    const t1 = setTimeout(onResize, 800), t2 = setTimeout(onResize, 3000);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { ro.disconnect(); clearTimeout(t1); clearTimeout(t2); window.removeEventListener('scroll', onScroll); };
  }, []);

  // briefly name each plate as you arrive at it
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 1600);
    return () => clearTimeout(t);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  const current = plates.find((p) => p.id === active)!;
  const go = (id: string) => { setOpen(false); scrollToId(id); };

  return (
    <div className={`frame ${visible ? 'is-on' : ''} ${open ? 'is-open' : ''}`} data-ground={ground} aria-hidden={!visible}>
      <nav className={`rail ${flash ? 'is-flash' : ''}`} aria-label="Sections" style={{ ['--step' as string]: `${STEP}px`, ['--n' as string]: plates.length }}>
        <ol>
          {plates.map((p) => (
            <li key={p.id} className={p.id === active ? 'is-active' : ''}>
              <a href={`#${p.id}`} aria-current={p.id === active ? 'true' : undefined}
                onClick={(e) => { e.preventDefault(); go(p.id); }}>
                <span className="rl-lbl">{p.label}</span>
                <span className="rl-exp"><Exp e={p.exp} /></span>
                <i className="rl-tick" />
              </a>
            </li>
          ))}
        </ol>
        <span className="rl-cursor" ref={cursor} aria-hidden />
      </nav>

      <button className="rail-m" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="rm-exp"><Exp e={current.exp} /></span>
        <span className="rm-lbl">{open ? 'Close' : current.label}</span>
      </button>

      <div className="frame-sheet" data-ground="ink" hidden={!open}>
        <ol>
          {plates.map((p) => (
            <li key={p.id}>
              <a href={`#${p.id}`} className={p.id === active ? 'is-active' : ''} onClick={(e) => { e.preventDefault(); go(p.id); }}>
                <span className="fs-exp"><Exp e={p.exp} /></span>
                <span className="display">{p.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
