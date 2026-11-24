import type { ReactNode } from 'react';

export function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 border-t border-paper/[0.08] py-20 sm:py-28"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/30">
          {index}
        </p>
        <h2 className="mt-4 text-[2rem] font-medium leading-[1.08] tracking-[-0.045em] text-paper sm:text-[2.25rem]">
          {title}
        </h2>
        {intro ? (
          <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-7 text-paper/45">
            {intro}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
