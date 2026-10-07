import { useRef, useState, type ReactNode, type CSSProperties } from 'react';
import './plate.css';

type Sky = { ra: number; dec: number; fov: number }; // degrees; fov = horizontal field of view

type Props = {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  id?: string;
  sky?: Sky;              // enables the RA/Dec cursor readout
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  children?: ReactNode;   // overlays, positioned in % of the plate
};

function ra(deg: number) {
  const h = ((deg % 360) + 360) % 360 / 15;
  const hh = Math.floor(h), mm = Math.floor((h - hh) * 60), ss = ((h - hh) * 60 - mm) * 60;
  return `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m ${ss.toFixed(1).padStart(4, '0')}s`;
}
function dec(deg: number) {
  const s = deg < 0 ? '−' : '+', a = Math.abs(deg), d = Math.floor(a), m = Math.floor((a - d) * 60);
  return `${s}${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}′`;
}

export default function Plate({ src, srcSet, sizes, alt, id, sky, className = '', style, eager, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [read, setRead] = useState<{ x: number; y: number; t: string } | null>(null);

  const onMove = (e: React.PointerEvent) => {
    if (!sky || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
    const scale = sky.fov / r.width;
    const dRa = (0.5 - u) * r.width * scale / Math.cos((sky.dec * Math.PI) / 180);
    const dDec = (0.5 - v) * r.height * scale;
    setRead({ x: u * 100, y: v * 100, t: `RA ${ra(sky.ra + dRa)}  DEC ${dec(sky.dec + dDec)}` });
  };

  return (
    <div
      ref={ref}
      id={id}
      className={`plate ${className}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={() => setRead(null)}
    >
      <div className="plate-glass">
        <img className="plate-img" crossOrigin={/^https?:/.test(src) ? 'anonymous' : undefined} src={src} srcSet={srcSet} sizes={sizes} alt={alt}
          loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
      </div>
      <span className="plate-crop" aria-hidden><i /><i /><i /><i /></span>
      <div className="plate-over">{children}</div>
      {read && (
        <div className="plate-read" style={{ left: `${read.x}%`, top: `${read.y}%` }} aria-hidden>
          <span className="mono">{read.t}</span>
        </div>
      )}
    </div>
  );
}
