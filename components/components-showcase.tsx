import Link from 'next/link';
import type { ReactNode } from 'react';
import { components } from '@/content/site';
import { Section } from './section';
import { Magnetic } from './previews/magnetic';
import { Segmented } from './previews/segmented';
import { SpringSwitch } from './previews/spring-switch';

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

export function ComponentsShowcase() {
  return (
    <Section
      id="components"
      index="02"
      title="Components"
      intro="Open-source pieces I made, tuned, and use here. Small interactions with too much thought in them."
    >
      <div className="mt-10 border-t border-paper/[0.08]">
        {components.map((component) => {
          const preview = previews[component.slug as keyof typeof previews];

          return (
            <div
              key={component.slug}
              className="grid gap-6 border-b border-paper/[0.08] py-7 sm:py-10 sm:grid-cols-[1fr_19rem] sm:items-center sm:gap-10"
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-paper/25">
                    {component.index}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium text-paper/85">
                    {component.name}
                  </h3>
                </div>
                <p className="mt-2 max-w-[32ch] text-sm leading-6 text-paper/45">
                  {component.description}
                </p>
                <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/25">
                  {component.meta}
                </p>
              </div>

              <Stage hint={preview.hint} label={`${component.name} preview`}>
                {preview.node}
              </Stage>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-6">
        <Link
          href="/components"
          prefetch={false}
          className="group font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40 transition-colors hover:text-paper"
        >
          Browse the index{' '}
          <span
            aria-hidden
            className="inline-block transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper/20">
          Open source
        </span>
      </div>
    </Section>
  );
}
