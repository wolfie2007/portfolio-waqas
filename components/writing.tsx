import Link from 'next/link';
import { posts } from '@/content/site';
import { DitherMark } from './dither-mark';
import { Section } from './section';

export function Writing() {
  return (
    <Section
      id="writing"
      title="Writing"
      intro="I sometimes write about my experiences. Here are a few:"
    >
      <div className="mt-5 sm:mt-6 flex flex-col gap-1">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            prefetch={false}
            className="group flex items-center justify-between gap-4 py-1.5 sm:py-2 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <DitherMark />
              <span className="relative inline-block w-fit text-[1.0625rem] leading-6 text-paper/85 transition-colors group-hover:text-paper">
                {post.title}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 h-px w-0 bg-paper/70 transition-all duration-300 ease-out group-hover:w-full"
                />
              </span>
            </div>
            <span
              aria-hidden
              className="shrink-0 text-[15px] text-paper/55 transition-all duration-200 group-hover:translate-x-1 group-hover:text-paper"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
