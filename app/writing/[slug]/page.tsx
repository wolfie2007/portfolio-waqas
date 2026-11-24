import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/content/site';
import { Footer } from '@/components/footer';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function WritingPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="page-enter flex min-h-[100svh] flex-col">
      <div className="mx-auto w-full max-w-[46rem] flex-1 px-5 sm:px-8">
        {/* Top Bar with Back Link */}
        <div className="py-4 sm:py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/40 transition-colors hover:text-paper"
          >
            <span>←</span>
            <span>Back</span>
          </Link>
        </div>

        {/* Main Post Article - no dead space */}
        <article className="pt-4 pb-10 sm:pt-6 sm:pb-14">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-[1.85rem] sm:text-[2.5rem] font-medium leading-[1.12] tracking-[-0.04em] text-paper">
              {post.title}
            </h1>
          </header>

          <div className="prose-writing">{post.content()}</div>
        </article>
      </div>

      {/* Full-width Shared Footer */}
      <Footer />
    </div>
  );
}
