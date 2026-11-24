import { site } from '@/content/site';
import { Age } from './age';
import { DitherBackground } from './dither-background';

export function Hero() {
  return (
    <header className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <DitherBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[46rem] flex-1 flex-col px-6 sm:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-paper/[0.08] py-5 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">
          <span>{site.name}</span>
          <span>{site.locationShort}</span>
        </div>

        <div className="mt-auto pb-[12vh] pt-28 sm:pb-[14vh]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
            <span>
              Age <Age dateOfBirth={site.dateOfBirth} />
            </span>
            <span aria-hidden className="h-3 w-px bg-paper/20" />
            <span>{site.location}</span>
          </div>

          <h1 className="mt-6 text-[clamp(2.85rem,9vw,6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-paper">
            {site.name}
          </h1>

          <p className="mt-8 max-w-[42ch] text-[1.0625rem] leading-7 text-paper/80 sm:text-lg">
            {site.status}
          </p>
          <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-7 text-paper/50">
            {site.bio}
          </p>

          <nav
            aria-label="Elsewhere"
            className="mt-9 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45"
          >
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-paper"
              >
                <span>{social.label}</span>
                <span
                  aria-hidden
                  className="text-paper/25 transition-colors group-hover:text-paper/60"
                >
                  ↗
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
