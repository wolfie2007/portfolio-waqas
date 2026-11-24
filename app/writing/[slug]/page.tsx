import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/content/site';
import { formatDate } from '@/lib/format-date';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title };
}

export default async function WritingPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

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

      <article className="py-16 sm:py-24">
        <header className="mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/30">
            {formatDate(post.date)}
          </p>
          <h1 className="mt-4 text-[2rem] font-medium leading-[1.08] tracking-[-0.045em] text-paper sm:text-[2.5rem]">
            {post.title}
          </h1>
        </header>

        <div className="prose-writing">
          <p className="text-paper/50 text-[0.9375rem] leading-7">
            This post isn&apos;t written yet. Check back soon.
          </p>
        </div>
      </article>
    </div>
  );
}
