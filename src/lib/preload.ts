/*
  Real preloading. The preloader's progress is the fraction of these
  critical assets that have actually arrived.
*/
export type Asset = { label: string; load: () => Promise<unknown> };

export function image(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (/^https?:/.test(url)) img.crossOrigin = 'anonymous'; // CORS so the preloader can read pixels; matches <img crossOrigin>
    img.decoding = 'async';
    img.onload = () => (img.decode ? img.decode().catch(() => {}).then(() => resolve(img)) : resolve(img));
    img.onerror = reject;
    img.src = url;
  });
}

export function font(spec: string, label: string): Asset {
  return { label, load: () => document.fonts.load(spec) };
}

export function run(
  assets: Asset[],
  onEach: (label: string, done: number, total: number, ok: boolean) => void,
) {
  let done = 0;
  return Promise.all(
    assets.map((a) =>
      a.load()
        .then(() => true, () => false)
        .then((ok) => {
          done += 1;
          onEach(a.label, done, assets.length, ok);
        }),
    ),
  );
}

/** Warm the browser cache for below-the-fold imagery once the page is idle. */
export function idlePrefetch(urls: string[]) {
  const go = () => urls.forEach((u, i) => setTimeout(() => image(u).catch(() => {}), i * 120));
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => void };
  if (w.requestIdleCallback) w.requestIdleCallback(go);
  else setTimeout(go, 1200);
}
