import Link from 'next/link';
import { posts } from '@/content/site';
import { formatDate } from '@/lib/format-date';
import { Section } from './section';

export function Writing() {
  return (
    <Section
      id="writing"
      index="01"
      title="Writing"
      intro="Notes on harnesses, evals, benchmarks, and the occasional bad idea."
    >
      <div className="mt-10 border-t border-paper/[0.08]">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            prefetch={false}
            className="group flex items-baseline justify-between gap-6 border-b border-paper/[0.08] py-4 sm:py-5"
          >
            <span className="text-[1.0625rem] leading-6 text-paper/80 transition-colors group-hover:text-paper">
              {post.title}
            </span>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/30 transition-colors group-hover:text-paper/50">
              {formatDate(post.date)}
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
