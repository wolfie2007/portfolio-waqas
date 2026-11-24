import Link from 'next/link';
import { projects } from '@/content/site';
import { DitherMark } from './dither-mark';
import { Section } from './section';

export function Work() {
  return (
    <Section
      id="work"
      title="Work"
      intro="I worked on these things, side projects mostly."
    >
      <div className="mt-5 sm:mt-6 flex flex-col gap-3">
        {projects.map((project) => {
          const isInternal = project.href.startsWith('/');
          const LinkComponent = isInternal ? Link : 'a';
          const linkProps = isInternal
            ? { href: project.href }
            : { href: project.href, target: '_blank', rel: 'noreferrer' };

          return (
            <LinkComponent
              key={project.name}
              {...linkProps}
              className="group flex items-center justify-between gap-6 py-1.5 sm:py-2 transition-colors"
            >
              <div className="flex items-baseline gap-3.5 max-w-[48ch]">
                <DitherMark className="translate-y-[1px]" />
                <div>
                  <h3 className="relative inline-block w-fit text-[1.0625rem] font-medium leading-6 text-paper/85 transition-colors group-hover:text-paper">
                    {project.name}
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 h-px w-0 bg-paper/70 transition-all duration-300 ease-out group-hover:w-full"
                    />
                  </h3>
                  <p className="mt-0.5 text-sm leading-6 text-paper/50">
                    {project.description}
                  </p>
                </div>
              </div>
              <span
                aria-hidden
                className="shrink-0 text-[16px] text-paper/55 transition-all duration-200 group-hover:translate-x-1 group-hover:text-paper"
              >
                →
              </span>
            </LinkComponent>
          );
        })}
      </div>
    </Section>
  );
}
