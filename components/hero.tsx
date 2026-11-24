'use client';

import { site } from '@/content/site';
import { DitherBackground } from './dither-background';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      {/* 'i' dot: clearly positioned with crisp separation */}
      <circle cx="5" cy="4.5" r="2.2" />
      {/* 'i' stem */}
      <rect x="2.8" y="8.8" width="4.4" height="12.2" rx="0.5" />
      {/* 'n' shape */}
      <path d="M10.2 8.8h4.2v1.8h.06c.6-1.15 2.1-2.2 4.2-2.2 4.4 0 5.3 2.9 5.3 6.7v5.9h-4.4v-5.2c0-1.25-.03-2.85-1.75-2.85-1.75 0-2 1.35-2 2.75v5.3h-4.4V8.8z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2.5" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

const BADGES = [
  {
    name: 'GitHub',
    handle: 'github/wolfie2007',
    href: 'https://github.com/wolfie2007',
    icon: GitHubIcon,
    iconSize: 'h-5 w-5',
    isExternal: true,
  },
  {
    name: 'X',
    handle: '@wolfie2007',
    href: 'https://x.com/wolfie2007',
    icon: XIcon,
    iconSize: 'h-4 w-4',
    isExternal: true,
  },
  {
    name: 'LinkedIn',
    handle: 'in/waqas-ameer',
    href: 'https://www.linkedin.com/in/waqas-ameer-024258374/',
    icon: LinkedInIcon,
    iconSize: 'h-4.5 w-4.5',
    isExternal: true,
  },
  {
    name: 'Email',
    handle: site.email,
    href: `mailto:${site.email}`,
    icon: MailIcon,
    iconSize: 'h-5 w-5',
    isExternal: false,
  },
];

export function Hero() {
  return (
    <header className="relative isolate flex min-h-[72svh] sm:min-h-[78svh] flex-col justify-center overflow-hidden pb-10 pt-16 sm:pb-14 sm:pt-24">
      <DitherBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-[46rem] flex-col px-5 sm:px-8">
        <div className="page-enter">
          <h1 className="text-[clamp(2.85rem,9vw,6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-paper">
            {site.name}
          </h1>

          <p className="mt-5 max-w-[44ch] text-[1.0625rem] leading-7 text-paper/85 sm:text-lg">
            {site.status}
          </p>
          <p className="mt-2.5 max-w-[50ch] text-[0.9375rem] leading-7 text-paper/50">
            {site.bio}
          </p>

          {/* Monochrome Dithered Badges with Interactive Spring & Tooltip */}
          <nav
            aria-label="Connect & Socials"
            className="mt-7 flex flex-wrap items-center gap-3.5 sm:gap-4"
          >
            {BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.name} className="relative group flex flex-col items-center">
                  <a
                    href={badge.href}
                    target={badge.isExternal ? '_blank' : undefined}
                    rel={badge.isExternal ? 'noreferrer' : undefined}
                    title={badge.name}
                    aria-label={badge.name}
                    className="relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border border-paper/[0.14] bg-ink/75 text-paper/70 backdrop-blur-md transition-all duration-300 ease-out hover:border-paper/50 hover:bg-paper/[0.10] hover:text-paper hover:shadow-[0_0_24px_rgba(232,230,226,0.18),inset_0_1px_1px_rgba(255,255,255,0.25)] active:scale-95"
                  >
                    {/* Real Bayer 4x4 Dither Pattern Overlay */}
                    <svg
                      className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-55"
                      aria-hidden
                    >
                      <defs>
                        <pattern
                          id={`bayer-dither-${badge.name}`}
                          width="4"
                          height="4"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect x="0" y="0" width="1" height="1" fill="currentColor" />
                          <rect x="2" y="2" width="1" height="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill={`url(#bayer-dither-${badge.name})`}
                        className="text-paper"
                      />
                    </svg>

                    {/* Monochrome Icon with Spring Lift on Hover */}
                    <Icon
                      className={`${badge.iconSize} transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:text-paper`}
                    />
                  </a>

                  {/* Creative Floating Monospace Tag Tooltip */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-8 z-30 whitespace-nowrap rounded-full border border-paper/[0.14] bg-ink/95 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-paper/85 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 ease-out translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    {badge.handle}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
