import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import './glass.css';

/*
  Liquid glass, done the physical way.
  A displacement map is computed for the button's exact shape: flat in the
  middle, and in the rim it bends what's behind toward the centre along the
  surface normal, the way a thick glass edge refracts. An SVG filter applies
  it to the backdrop (Chromium supports url() filters in backdrop-filter).
  Elsewhere it falls back to a clean blur. The highlight follows the cursor
  like light catching the glass.
*/
const BEZEL = 12;     // px of curved rim
const STRENGTH = 30;  // max refraction, px

function displacementMap(w: number, h: number, radius: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  const hx = w / 2, hy = h / 2, r = Math.min(radius, hx, hy);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // signed distance to the rounded rectangle, and its outward normal
      const px = x + 0.5 - hx, py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r), qy = Math.abs(py) - (hy - r);
      let nx: number, ny: number, d: number;
      if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy); nx = qx / l; ny = qy / l; d = l - r; }
      else if (qx > qy) { nx = 1; ny = 0; d = qx - r; } else { nx = 0; ny = 1; d = qy - r; }
      nx *= Math.sign(px) || 1; ny *= Math.sign(py) || 1;
      const t = Math.min(1, Math.max(0, -d / BEZEL));           // 0 at the edge, 1 where the glass goes flat
      // slope of a squircle-profile surface: steep at the edge, zero inside
      const m = Math.pow(1 - t, 3);
      const i = (y * w + x) * 4;
      img.data[i] = Math.round(128 - 127 * m * nx);
      img.data[i + 1] = Math.round(128 - 127 * m * ny);
      img.data[i + 2] = 128; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

const refracts = () => {
  const nav = navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } };
  return !!nav.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand));
};

export default function GlassButton({ href, children, newTab = true }: { href: string; children: ReactNode; newTab?: boolean }) {
  const el = useRef<HTMLAnchorElement>(null);
  const fid = `lg${useId().replace(/[^a-z0-9]/gi, '')}`;
  const [map, setMap] = useState<{ url: string; w: number; h: number } | null>(null);
  const [on] = useState(refracts);

  useEffect(() => {
    if (!on || !el.current) return;
    const node = el.current;
    const build = () => {
      const w = Math.round(node.offsetWidth), h = Math.round(node.offsetHeight);
      if (!w || !h) return;
      const radius = parseFloat(getComputedStyle(node).borderTopLeftRadius) || 14;
      setMap((m) => (m && m.w === w && m.h === h ? m : { url: displacementMap(w, h, radius), w, h }));
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(node);
    return () => ro.disconnect();
  }, [on]);

  const move = (e: React.PointerEvent) => {
    const b = el.current!.getBoundingClientRect();
    el.current!.style.setProperty('--mx', `${((e.clientX - b.left) / b.width) * 100}%`);
    el.current!.style.setProperty('--my', `${((e.clientY - b.top) / b.height) * 100}%`);
  };

  return (
    <a ref={el} href={href} className={`lg ${on && map ? 'is-refract' : ''}`}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onPointerMove={move}
      style={on && map ? { ['--lg-filter' as string]: `url(#${fid})` } : undefined}>
      {on && map && (
        <svg className="lg-defs" width="0" height="0" aria-hidden>
          <filter id={fid} x="0" y="0" width={map.w} height={map.h} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} preserveAspectRatio="none" result="map" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="soft" />
            <feDisplacementMap in="soft" in2="map" scale={STRENGTH} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      )}
      <span className="lg-glass" aria-hidden />
      <span className="lg-shine" aria-hidden />
      <span className="lg-body">{children}</span>
    </a>
  );
}
