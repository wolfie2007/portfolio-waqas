import { site } from '@/content/site';
import { OG_SIZE, renderOgImage } from '@/lib/og';

export const alt = `Components — ${site.name}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default async function Image() {
  return renderOgImage({
    eyebrow: 'Components',
    topRight: '03 Pieces',
    title: 'Components',
    subtitle:
      'Open-source UI pieces. Small interactions with too much thought in them.',
    bottomLeft: 'Magnetic · Spring switch · Segmented',
    bottomRight: site.name,
    titleSize: 72,
  });
}
