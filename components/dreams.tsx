import type { Dream } from '@/content/site';
import { Section } from './section';

/**
 * Open, dithered notebook checkbox rendered with crisp pixel edges.
 * Illuminates its inner Bayer pattern on row hover to signal an active goal.
 */
function DitherCheckbox() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      shapeRendering="crispEdges"
      aria-hidden
      className="mt-[6px] shrink-0 text-paper transition-transform duration-200 ease-out group-hover:scale-105"
    >
      {/* Crisp 1px open square frame */}
      <rect
        x="0"
        y="0"
        width="12"
        height="1"
        fill="currentColor"
        className="opacity-35 transition-opacity duration-200 group-hover:opacity-85"
      />
      <rect
        x="0"
        y="11"
        width="12"
        height="1"
        fill="currentColor"
        className="opacity-35 transition-opacity duration-200 group-hover:opacity-85"
      />
      <rect
        x="0"
        y="1"
        width="1"
        height="10"
        fill="currentColor"
        className="opacity-35 transition-opacity duration-200 group-hover:opacity-85"
      />
      <rect
        x="11"
        y="1"
        width="1"
        height="10"
        fill="currentColor"
        className="opacity-35 transition-opacity duration-200 group-hover:opacity-85"
      />

      {/* Inner Bayer-staggered core (faint at rest, fills on hover) */}
      <rect
        x="4"
        y="4"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-15 transition-opacity duration-200 delay-[20ms] group-hover:opacity-75"
      />
      <rect
        x="6"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-15 transition-opacity duration-200 delay-[45ms] group-hover:opacity-75"
      />
      <rect
        x="6"
        y="4"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-0 transition-opacity duration-200 delay-[70ms] group-hover:opacity-35"
      />
      <rect
        x="4"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-0 transition-opacity duration-200 delay-[70ms] group-hover:opacity-35"
      />
    </svg>
  );
}

export function Dreams({ dreams }: { dreams: Dream[] }) {
  return (
    <Section
      id="dreams"
      title="Dreams"
      intro="Hoping and trying that these get fulfilled"
    >
      <ul className="mt-5 sm:mt-6 flex flex-col gap-1.5 sm:gap-2">
        {dreams.map((dream) => (
          <li
            key={dream.id}
            className="group flex items-start gap-3.5 py-1.5 sm:py-2"
          >
            <DitherCheckbox />
            <span className="text-[1.0625rem] leading-6 text-paper/80 transition-colors duration-200 group-hover:text-paper">
              {dream.title}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
