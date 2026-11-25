import { posts, site } from '@/content/site';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = 'Writing';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = posts.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? posts[index] : undefined;

  const paddedIndex =
    index >= 0 ? String(index + 1).padStart(2, '0') : '01';

  return renderOgImage({
    eyebrow: 'Writing',
    topRight: `${paddedIndex} · Note`,
    title: post?.title ?? site.name,
    subtitle: post?.summary ?? site.bio,
    bottomLeft: site.name,
    bottomRight: site.locationShort,
  });
}
