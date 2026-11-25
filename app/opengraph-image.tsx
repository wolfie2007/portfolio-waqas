import { site } from '@/content/site';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = `${site.name} — ${site.bio}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return renderOgImage({
    eyebrow: site.name,
    topRight: site.locationShort,
    title: site.name,
    subtitle: site.bio,
    bottomLeft: 'Writing · Work · Dreams',
    bottomRight: site.email,
    titleSize: 76,
  });
}
