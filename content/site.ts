export type Post = {
  slug: string;
  title: string;
  date: string;
};

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
  year: string;
  title: string;
  note: string;
  ai: boolean;
};

// Demo content. Replace with the real thing when it exists.
export const site = {
  name: 'Waqas Ameer',
  dateOfBirth: '2006-03-14',
  location: 'Islamabad, Pakistan',
  locationShort: 'Islamabad, PK',
  status:
    'Building an agent harness, running evals, and writing down what breaks.',
  bio:
    'Computer science student in Islamabad. I build small AI systems, break them on purpose, and write about what I learn.',
  email: 'waqasameer654@gmail.com',
  socials: [
    { label: 'X', href: 'https://x.com/wolfie2007' },
    { label: 'GitHub', href: 'https://github.com/wolfie2007' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/waqasameer/' },
  ],
} as const;

export const posts: Post[] = [
  {
    slug: 'the-eval-was-lying',
    title: 'The eval was lying to me',
    date: '2026-11-18',
  },
  {
    slug: 'a-harness-that-fails-loudly',
    title: 'A harness that fails loudly',
    date: '2026-11-06',
  },
  {
    slug: 'four-hundred-benchmark-runs',
    title: 'Four hundred benchmark runs later',
    date: '2026-10-22',
  },
  {
    slug: 'what-i-actually-use-an-agent-for',
    title: 'What I actually use an agent for',
    date: '2026-10-09',
  },
  {
    slug: 'shitposting-as-a-research-method',
    title: 'In defence of shitposting as a research method',
    date: '2026-09-27',
  },
  {
    slug: 'breaking-things-on-purpose',
    title: 'Breaking things on purpose',
    date: '2026-09-12',
  },
];

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
    name: 'SiteMind',
    description:
      'A support assistant that answers from a website and cites its sources.',
    href: 'https://sitemind.tech',
    linkLabel: 'sitemind.tech',
  },
  {
    name: 'CodeDuel',
    description:
      'Live 1v1 coding battles with problems written fresh by a model.',
    href: 'https://codeduel.live',
    linkLabel: 'codeduel.live',
  },
  {
    name: 'Encrypto',
    description: 'A C++ desktop app for encrypting files, built to learn the guts.',
    href: 'https://github.com/wolfie2007',
    linkLabel: 'GitHub',
  },
];

export const dreams: Dream[] = [
  {
    id: 1,
    year: '2028',
    title: 'Build something a million people rely on',
    note: 'A product, not a prototype. Something people would miss.',
    ai: true,
  },
  {
    id: 2,
    year: '2029',
    title: 'Work on frontier AI with people I respect',
    note: 'A lab, a research team, or a company doing the hard part.',
    ai: true,
  },
  {
    id: 3,
    year: '2031',
    title: 'Make AI that gives people their time back',
    note: 'Quietly useful. No prompt engineering required.',
    ai: true,
  },
  {
    id: 4,
    year: '2035',
    title: 'See the Earth from orbit',
    note: 'The one that has nothing to do with work.',
    ai: false,
  },
  {
    id: 5,
    year: 'Ongoing',
    title: 'Stay kind on the way up',
    note: 'The only one I can fail at every day.',
    ai: false,
  },
];
