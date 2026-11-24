import { site } from '@/content/site';
import { TowerClock } from './tower-clock';

export function Footer() {
  return (
    <footer className="relative w-full bg-ink">
      <div className="footer-plate relative aspect-[823/1029] w-full overflow-hidden [--clock-left:50.08%] [--clock-top:41.83%] [--clock-w:14.2%] md:aspect-[1600/686] md:[--clock-left:39.59%] md:[--clock-top:41.84%] md:[--clock-w:5%]">
        {/* melts the section above into the sky — no seam, no hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[34%]"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.97) 10%, rgba(10,10,10,0.86) 22%, rgba(10,10,10,0.62) 42%, rgba(10,10,10,0.3) 65%, rgba(10,10,10,0) 100%)',
          }}
        />

        <TowerClock />

        {/* phones: the copy sits in the water at the foot of the plate, so the
            picture still ends the page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] md:hidden"
          style={{
            backgroundImage:
              'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.94) 30%, rgba(10,10,10,0.66) 60%, rgba(10,10,10,0) 100%)',
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-5 px-6 pb-9 pt-16 text-left md:inset-x-auto md:bottom-auto md:right-[4.5%] md:top-[21%] md:w-[36%] md:items-end md:gap-6 md:px-0 md:pb-0 md:pt-0 md:text-right"
          style={{
            textShadow:
              '0 1px 2px rgba(10,10,10,0.8), 0 3px 22px rgba(10,10,10,0.85)',
          }}
        >
          <a
            href={`mailto:${site.email}`}
            className="inline-block border-b border-paper/35 pb-1.5 text-[1.3rem] leading-[1.2] tracking-[-0.03em] text-paper transition-colors hover:border-paper/70 md:text-[clamp(17px,1.55vw,30px)] md:leading-[1.15]"
          >
            {site.email}
          </a>

          <nav
            aria-label="Elsewhere"
            className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[0.9375rem] text-paper/75 md:gap-x-[clamp(16px,1.3vw,26px)] md:text-[clamp(13px,0.85vw,16px)]"
          >
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-baseline gap-1 transition-colors hover:text-paper"
              >
                <span className="border-b border-transparent pb-0.5 group-hover:border-paper/40">
                  {social.label}
                </span>
                <span
                  aria-hidden
                  className="text-[0.8em] text-paper/40 transition-colors group-hover:text-paper/70"
                >
                  ↗
                </span>
              </a>
            ))}
          </nav>

          <p className="text-[0.875rem] leading-snug text-paper/80 md:text-[clamp(13px,0.95vw,17px)]">
            Now you know what time it is.
          </p>

          <p className="-mt-2 text-[0.72rem] tracking-[0.01em] text-paper/55 md:mt-0 md:text-[clamp(11px,0.72vw,13px)]">
            © 2026 {site.name} · {site.locationShort}
          </p>
        </div>
      </div>
    </footer>
  );
}
