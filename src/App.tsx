import { useEffect, useState } from 'react';
import Preloader from './components/Preloader';
import Frame from './components/Frame';
import Cover from './sections/Cover';
import Obsessions from './sections/Obsessions';
import Station from './sections/Station';
import Instruments from './sections/Instruments';
import Exposing from './sections/Exposing';
import LightCurve from './sections/LightCurve';
import Targets from './sections/Targets';
import Signal from './sections/Signal';
import { obsessions, photos, src, OBS_BG } from './content';
import { idlePrefetch } from './lib/preload';
import { jump, startScroll } from './lib/scroll';

const critical = [
  { url: OBS_BG, label: `plate 002 · sky field · ${photos.redFilament.by}` },
  { url: src(obsessions[0].photo, 900), label: `plate 002a · ${obsessions[0].name.toLowerCase()}` },
];

export default function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    startScroll();
    // dev-only: ?y=1234 or ?at=station&f=0.5 jumps there after load (for screenshots)
    if (import.meta.env.DEV) {
      const q = new URLSearchParams(location.search);
      const at = q.get('at'), f = Number(q.get('f') ?? 0);
      const y = at ? (document.getElementById(at)?.offsetTop ?? 0) + f * ((document.getElementById(at)?.offsetHeight ?? 0) - innerHeight) : Number(q.get('y') ?? 0);
      if (y) setTimeout(() => jump(y), 1600);
    }
    idlePrefetch([
      ...obsessions.slice(1).map((o) => src(o.photo, 900)),
      src(photos.witchHead, 2400),
      src(photos.veil, 1600),
    ]);
  }, [ready]);

  return (
    <>
      {loading && <Preloader criticalImages={critical} onHandoff={() => setReady(true)} onGone={() => setLoading(false)} />}
      <Frame visible={ready} />
      <main>
        <Cover ready={ready} />
        <Obsessions />
        <Station />
        <Instruments />
        <Exposing />
        <LightCurve />
        <Targets />
        <Signal />
      </main>
    </>
  );
}
