import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { components } from '@/content/site';
import { Magnetic } from '@/components/previews/magnetic';
import { Segmented } from '@/components/previews/segmented';
import { SpringSwitch } from '@/components/previews/spring-switch';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Components',
};

function Stage({
  hint,
  label,
  children,
}: {
  hint: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="relative flex min-h-36 w-full items-center justify-center border border-paper/[0.08] bg-paper/[0.015] px-6 py-10 sm:w-[19rem]"
    >
      <span className="absolute right-3 top-3 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/20">
        {hint}
      </span>
      {children}
    </div>
  );
}

const previews = {
  magnetic: {
    hint: 'move cursor',
    node: <Magnetic />,
  },
  'spring-switch': {
    hint: 'click',
    node: <SpringSwitch />,
  },
  segmented: {
    hint: 'select',
    node: <Segmented />,
  },
} as const;

export default function ComponentsIndex() {
  return (
    <div className="page-enter flex min-h-[100svh] flex-col">
      <div className="mx-auto w-full max-w-[46rem] flex-1 px-5 sm:px-8">
        <div className="py-4 sm:py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40 transition-colors hover:text-paper"
          >
            <span>←</span>
            <span>Back</span>
          </Link>
        </div>

        <section className="pt-4 pb-12 sm:pt-6 sm:pb-16">
          <h1 className="text-[1.85rem] sm:text-[2.25rem] font-medium leading-[1.08] tracking-[-0.045em] text-paper">
            Components
          </h1>
          <p className="mt-2.5 max-w-[54ch] text-[0.9375rem] leading-6 text-paper/45">
            Open-source UI pieces. Small interactions with too much thought in them.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            {components.map((component) => {
              const preview = previews[component.slug as keyof typeof previews];

              return (
                <div
                  key={component.slug}
                  className="grid gap-6 py-4 sm:grid-cols-[1fr_19rem] sm:items-center sm:gap-10"
                >
                  <div>
                    <h2 className="text-[1.0625rem] font-medium text-paper/85">
                      {component.name}
                    </h2>
                    <p className="mt-1.5 max-w-[52ch] text-sm leading-6 text-paper/45">
                      {component.description}
                    </p>
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/25">
                      {component.meta}
                    </p>
                  </div>

                  {preview ? (
                    <Stage hint={preview.hint} label={component.name}>
                      {preview.node}
                    </Stage>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
