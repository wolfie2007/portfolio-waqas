import type { Metadata } from 'next';
import Link from 'next/link';
import { components } from '@/content/site';

export const metadata: Metadata = {
  title: 'Components',
};

export default function ComponentsIndex() {
  return (
    <div className="page-enter mx-auto w-full max-w-[46rem] px-6 sm:px-8">
      <div className="border-b border-paper/[0.08] py-5">
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40 transition-colors hover:text-paper"
        >
          ← Back
        </Link>
      </div>

      <section className="py-16 sm:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/30">
          Index
        </p>
        <h1 className="mt-4 text-[2rem] font-medium leading-[1.08] tracking-[-0.045em] text-paper sm:text-[2.25rem]">
          Components
        </h1>
        <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-7 text-paper/45">
          Open-source UI pieces. Small interactions with too much thought in them.
        </p>

        <div className="mt-10 border-t border-paper/[0.08]">
          {components.map((component) => (
            <div
              key={component.slug}
              className="border-b border-paper/[0.08] py-5"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.12em] text-paper/25">
                  {component.index}
                </span>
                <h2 className="text-[1.0625rem] font-medium text-paper/85">
                  {component.name}
                </h2>
              </div>
              <p className="mt-1.5 max-w-[52ch] text-sm leading-6 text-paper/45">
                {component.description}
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/25">
                {component.meta}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
