import { useEffect, useMemo, useRef } from 'react';
import { geoGraticule10, geoOrthographic, geoPath, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import { person, station } from '../content';
import { ScrollTrigger, gsap, reducedMotion } from '../lib/scroll';
import './station.css';

const S = 600; // svg units
// land outlines load lazily (own chunk) when the section approaches
let LAND: GeoJSON.FeatureCollection | GeoJSON.Feature | null = null;
const loadLand = () => import('world-atlas/land-110m.json').then((m) => {
  const t = (m.default ?? m) as unknown as Topology;
  LAND = feature(t, t.objects.land as GeometryCollection);
});
const GRAT = geoGraticule10();
const HOME: [number, number] = [person.lon, person.lat];

// ISS orbital plane, inclination 51.6°, as a great circle
function orbit(node: number): GeoJSON.LineString {
  const i = (51.6 * Math.PI) / 180, pts: [number, number][] = [];
  for (let k = 0; k <= 180; k++) {
    const t = (k / 180) * 2 * Math.PI;
    const lat = Math.asin(Math.sin(i) * Math.sin(t));
    const lon = Math.atan2(Math.cos(i) * Math.sin(t), Math.cos(t));
    pts.push([((lon * 180) / Math.PI) + node, (lat * 180) / Math.PI]);
  }
  return { type: 'LineString', coordinates: pts };
}

export default function Station() {
  const root = useRef<HTMLElement>(null);
  const g = useRef<{ land: SVGPathElement | null; grat: SVGPathElement | null; orb: SVGPathElement | null; mark: SVGGElement | null }>({ land: null, grat: null, orb: null, mark: null });
  const proj = useMemo(() => geoOrthographic().scale(S / 2 - 6).translate([S / 2, S / 2]).clipAngle(90).precision(0.6), []);
  const ORB = useMemo(() => orbit(20), []);

  useEffect(() => {
    const path = geoPath(proj);
    const draw = (p: number) => {
      const lon = -HOME[0] + (1 - p) * 150, lat = -HOME[1] * (0.35 + 0.65 * p);
      proj.rotate([lon, lat]);
      const r = g.current;
      if (LAND) r.land?.setAttribute('d', path(LAND) ?? '');
      r.grat?.setAttribute('d', path(GRAT) ?? '');
      r.orb?.setAttribute('d', path(ORB) ?? '');
      const xy = proj(HOME);
      const vis = geoDistance(HOME, [-lon, -lat]) < Math.PI / 2;
      if (r.mark && xy) { r.mark.setAttribute('transform', `translate(${xy[0]} ${xy[1]})`); r.mark.style.opacity = vis ? '1' : '0'; }
    };
    let p = reducedMotion() ? 1 : 0;
    draw(p);
    loadLand().then(() => draw(p)).catch(() => {});
    if (reducedMotion()) return;
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top 85%', end: 'center 45%', scrub: 0.8,
      onUpdate: (s) => draw((p = gsap.parseEase('power2.out')(s.progress))),
    });
    return () => st.kill();
  }, [proj, ORB]);

  useEffect(() => {
    if (!root.current || reducedMotion()) return;
    const q = gsap.utils.selector(root.current);
    const ctx = gsap.context(() => {
      gsap.from(q('.st-head > *'), { opacity: 0, y: 30, duration: 1.1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: root.current, start: 'top 70%' } });
      gsap.from(q('.st-log > div'), { opacity: 0, x: -16, duration: 0.8, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: q('.st-log')[0], start: 'top 85%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="station" ref={root} className="ground st" data-ground="orange" aria-label="Plate 003 — station">
      <div className="st-grid">
        <div className="st-text">
          <header className="st-head">
            <h2 className="h-section">Observing<br />from 33.68° N.</h2>
            <p className="lede">Everything here starts from Islamabad. It's where I study, build things, and spend too many nights watching videos about stuff millions of light-years away.</p>
          </header>
          <dl className="st-log">
            {station.map((r) => (
              <div key={r.k}><dt className="mono">{r.k}</dt><dd>{r.v}</dd></div>
            ))}
          </dl>
        </div>

        <figure className="st-globe" aria-label={`Orthographic map of Earth centred on Islamabad, ${person.coords}`}>
          <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-hidden>
            <circle className="st-sphere" cx={S / 2} cy={S / 2} r={S / 2 - 6} />
            <path className="st-grat" ref={(el) => { g.current.grat = el; }} />
            <path className="st-land" ref={(el) => { g.current.land = el; }} />
            <path className="st-orb" ref={(el) => { g.current.orb = el; }} />
            <g className="st-mark" ref={(el) => { g.current.mark = el; }}>
              <circle r="14" /><circle r="3.5" className="st-dot" />
              <path d="M-26 0h-12M26 0h12M0 -26v-12M0 26v12" />
              <path className="st-lead" d="M10 -10 L70 -70 H190" />
              <text x="76" y="-80">Station 01 · Islamabad</text>
              <text x="76" y="-56" className="st-sm">{person.coords}</text>
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}
