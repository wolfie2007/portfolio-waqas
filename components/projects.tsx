import { projects } from '@/content/site';
import { Section } from './section';

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      title="Projects"
      intro="Things I’ve shipped, or am still shipping."
    >
      <div className="mt-10 border-t border-paper/[0.08]">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-[1fr_auto] items-baseline gap-6 border-b border-paper/[0.08] py-4 sm:py-5"
          >
            <div>
              <h3 className="text-[1.0625rem] leading-6 text-paper/80 transition-colors group-hover:text-paper">
                {project.name}
              </h3>
              <p className="mt-1 max-w-[52ch] text-sm leading-6 text-paper/45">
                {project.description}
              </p>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25 transition-colors group-hover:text-paper/50">
              {project.linkLabel} ↗
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
