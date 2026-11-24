import type { ReactNode } from 'react';

export function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-8 py-8 sm:py-12"
    >
      <div>
        <h2 className="text-[1.85rem] font-medium leading-[1.08] tracking-[-0.045em] text-paper sm:text-[2.1rem]">
          {title}
        </h2>
        {intro ? (
          <p className="mt-2.5 max-w-[54ch] text-[0.9375rem] leading-6 text-paper/45">
            {intro}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
