export type { Post } from './posts';
export { posts } from './posts';

export type Component = {
  slug: string;
  name: string;
  index: string;
  description: string;
  meta: string;
};

export type Project = {
  name: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type Dream = {
  id: number;
  title: string;
};

// Demo content. Replace with the real thing when it exists.
export const site = {
  name: 'Waqas Ameer',
  dateOfBirth: '2007-03-14',
  location: 'Islamabad, Pakistan',
  locationShort: 'Islamabad, PK',
  status:
    'Currently learning and building things — working on a conversational AI system right now.',
  bio:
    'Computer scientist in Islamabad. I build and test different things: harnesses, apps, web components, AI systems.',
  email: 'waqasameer654@gmail.com',
  socials: [
    { label: 'GitHub', href: 'https://github.com/wolfie2007' },
    { label: 'X', href: 'https://x.com/wolfie2007' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/waqas-ameer-024258374/' },
  ],
} as const;


export const components: Component[] = [
  {
    slug: 'magnetic',
    name: 'Magnetic',
    index: '01',
    description: 'A link that leans toward the cursor, then springs back.',
    meta: 'Pointer · spring',
  },
  {
    slug: 'spring-switch',
    name: 'Spring switch',
    index: '02',
    description: 'A toggle with a little physical weight to it.',
    meta: 'Click · spring',
  },
  {
    slug: 'segmented',
    name: 'Segmented',
    index: '03',
    description: 'A tab control with a spring-loaded indicator.',
    meta: 'Select · layout',
  },
];

export const projects: Project[] = [
  {
    name: 'Mindy',
    description:
      'An open-source animated SVG mascot with 8 moods, cursor tracking, and a small studio to tune it.',
    href: 'https://mindymascot.vercel.app',
    linkLabel: 'mindymascot.vercel.app',
  },
  {
    name: 'SiteMind',
    description:
      'A support assistant that answers from a website and cites its sources.',
    href: 'https://sitemind.tech',
    linkLabel: 'sitemind.tech',
  },
  {
    name: 'UI Components',
    description:
      'A collection of open-source micro-interactions and tactile controls with spring physics.',
    href: '/components',
    linkLabel: 'Components',
  },
];

export const dreams: Dream[] = [
  {
    id: 1,
    title: 'Contribute to something a billion people rely on.',
  },
  {
    id: 2,
    title: 'Work on frontier AI with people I get inspired from in my career.',
  },
  {
    id: 3,
    title: 'At least travel across 10+ countries.',
  },
  {
    id: 4,
    title: 'Buy a BMW M5 F90 Competition.',
  },
  {
    id: 5,
    title: "Build something extremely useful that becomes part of people's daily life.",
  },
];
