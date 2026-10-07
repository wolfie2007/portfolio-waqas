/*
  Everything the site says lives here, written in Waqas's own voice.
  Rule for edits: plain words, first person, say the specific thing.
*/

export type Photo = { raw: string; by: string; handle: string; id: string; w?: number; h?: number };

// Unsplash-licensed photographs by independent photographers (credited in the colophon).
export const photos = {
  andromeda: { raw: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7', by: 'Guillermo Ferla', handle: 'gferla', id: 'Oze6U2m1oYU', w: 5412, h: 3594 },
  witchHead: { raw: 'https://images.unsplash.com/photo-1739389716979-d62f1d6fe559', by: 'Scott Lord', handle: 'darkcatimages', id: 'P3MsdSRWprA' },
  remnant: { raw: 'https://images.unsplash.com/photo-1728160641449-e64ea3e7f7ab', by: 'Scott Lord', handle: 'darkcatimages', id: 'sk6cihbV0KA' },
  veil: { raw: 'https://images.unsplash.com/photo-1764699782691-1b1b7cf1d851', by: 'Scott Lord', handle: 'darkcatimages', id: 'KLFP4HwaXyk' },
  sho: { raw: 'https://images.unsplash.com/photo-1773833499488-bc7fe1c146f8', by: 'Arnaud Girault', handle: 'arnaudastro', id: 'BGOMkThbjwg' },
  redFilament: { raw: 'https://images.unsplash.com/photo-1760376448199-5924d569919e', by: 'Arnaud Girault', handle: 'arnaudastro', id: 'Ws7wVyhrxTU' },
  rocket: { raw: 'https://images.unsplash.com/photo-1700508317396-e343a69ac72f', by: 'Nader Saremi', handle: 'nssaremi', id: 'o6VKrOogZpw' },
  dish: { raw: 'https://images.unsplash.com/photo-1481697943534-ea55b5ce970b', by: 'Galen Crout', handle: 'galen_crout', id: 'ZYecenZy7o4' },
  scope: { raw: 'https://images.unsplash.com/photo-1580063665860-af92a61c2810', by: 'K8', handle: '_k8_', id: '5tuU44e_2e0' },
  ghost: { raw: 'https://images.unsplash.com/photo-1677509118271-238fb1162828', by: 'Robin Li', handle: 'fallout766', id: 'e_-X3nxaZrE' },
  jet: { raw: 'https://images.unsplash.com/photo-1637942554107-f554ed75c979', by: 'Abed Ismail', handle: 'abedismail', id: 'x6nQ28A-mLw' },
  engine: { raw: 'https://images.unsplash.com/photo-1552656967-7a0991a13906', by: 'Markus Spiske', handle: 'markusspiske', id: '6rF_Du5cn1Y' },
} satisfies Record<string, Photo>;

/** Unsplash CDN sizing (imgix params). */
export function src(p: Photo, w: number, extra = '') {
  return `${p.raw}?w=${w}&q=72&auto=format&fit=crop${extra}`;
}

export const person = {
  name: 'Waqas Ameer',
  first: 'Waqas',
  last: 'Ameer',
  email: 'waqasameer654@gmail.com',
  github: 'https://github.com/wolfie2007',
  githubUser: 'wolfie2007',
  linkedin: 'https://linkedin.com/in/waqasameer',
  resume: '/Waqas_Ameer.pdf',
  lat: 33.6844,
  lon: 73.0479,
  coords: '33.6844° N 73.0479° E',
};

export const intro =
  "I'm 19, in my second year of computer science in Islamabad, and I build things. Mostly with AI. This is where I keep everything I'm into: what I've made, what I'm learning, and where I want to end up.";

/* ------------------------------------------------------------------ */
/* Index — the archive runs from large to small, then jumps back out.  */
/* ------------------------------------------------------------------ */
export const plates = [
  { id: 'archive', no: '001', exp: '22', label: 'Archive' },
  { id: 'obsessions', no: '002', exp: '18', label: 'Obsessions' },
  { id: 'station', no: '003', exp: '7', label: 'Station' },
  { id: 'instruments', no: '004', exp: '−2', label: 'Built' },
  { id: 'exposing', no: '005', exp: '−6', label: 'Learning' },
  { id: 'lightcurve', no: '006', exp: '−9', label: 'Activity' },
  { id: 'targets', no: '007', exp: '26', label: 'Targets' },
  { id: 'signal', no: '008', exp: '∞', label: 'Contact' },
] as const;

export type PlateId = (typeof plates)[number]['id'];

/* ------------------------------------------------------------------ */
/* Obsessions, plotted as a star chart. Lower magnitude = brighter
   = more obsessed (that's how astronomers count).                      */
/* ------------------------------------------------------------------ */
export type Obsession = {
  cat: string; name: string; mag: number; x: number; y: number;
  photo: Photo; note: string; draft?: boolean;
};

export const obsessions: Obsession[] = [
  { cat: 'WA-014', name: 'AI', mag: 0.0, x: 640, y: 170, photo: photos.sho,
    note: "I use it every day, I build with it, and I keep reading about how it works underneath. The part I think about most is where it goes next, and what it'll change about the way people live." },
  { cat: 'WA-015', name: 'Space', mag: 0.2, x: 300, y: 215, photo: photos.remnant,
    note: "Earth is a pin in a fountain of sand. When I think about how big it all is out there, my problems get very small. It keeps me humble, and it keeps me curious." },
  { cat: 'WA-016', name: 'Building things', mag: 0.7, x: 505, y: 400, photo: photos.dish,
    note: "If I learn something, I want to make something with it. Most of my ideas turn into a rough web app before I've even decided if they're good." },
  { cat: 'WA-017', name: 'Startup ideas', mag: 1.2, x: 175, y: 445, photo: photos.rocket,
    note: "I'm always testing some idea. Can it work? Who would use it? Most of them die in a notes app. One of them became SiteMind." },
  { cat: 'WA-018', name: 'Tech YouTube', mag: 1.6, x: 820, y: 320, photo: photos.scope,
    note: "Linus Tech Tips, Mark Rober, MKBHD. I'll click one video and look up an hour later, six videos deep. A lot of what I know started like that." },
  { cat: 'WA-019', name: 'PC games', mag: 2.1, x: 385, y: 540, photo: photos.ghost,
    note: "Shooters, mostly. I've played every Call of Duty, first-person and third-person, plus more action games than I can count. If it's fast and loud, I've probably finished it." },
  { cat: 'WA-020', name: 'Fighter jets', mag: 2.3, x: 905, y: 135, photo: photos.jet,
    note: "Anything with an afterburner. How they turn, how they climb, how loud they are. If one flies over, I'm looking up." },
  { cat: 'WA-021', name: 'Cars', mag: 2.7, x: 735, y: 515, photo: photos.engine,
    note: "I just like cars. How they look, how they sound, and all the engineering packed under the hood." },
];

/* ------------------------------------------------------------------ */
/* Station                                                              */
/* ------------------------------------------------------------------ */
export const station = [
  { k: 'Based in', v: 'Islamabad, Pakistan' },
  { k: 'Studying', v: 'BS Computer Science at Air University, second year' },
  { k: 'Age', v: '19' },
  { k: 'Building', v: 'SiteMind, my startup' },
  { k: 'Off the clock', v: 'Call of Duty, cars, fighter jets, too much tech YouTube' },
];

/* ------------------------------------------------------------------ */
/* Me                                                                   */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Built                                                                */
/* ------------------------------------------------------------------ */
export type Instrument = {
  plate: string; name: string; kind: string; line: string; body: string;
  stack: string[]; specs: { k: string; v: string }[]; href: string; hrefLabel: string;
};

export const instruments: Instrument[] = [
  {
    plate: 'WA-027', name: 'SiteMind', kind: 'My startup',
    line: 'Your website, turned into a support assistant that cites its sources.',
    body: "SiteMind reads a company's website and answers their customers' questions using only what's on it, with the source attached to every answer. If it doesn't know, it hands the chat to a human instead of making something up. You connect a domain, check the answers, paste one line of code, and it's live. One customer went from about 400 support tickets a week to under 90.",
    stack: ['Next.js', 'TypeScript', 'Express', 'PostgreSQL + pgvector', 'Redis', 'Gemini', 'Cloudflare Workers'],
    specs: [{ k: 'Role', v: 'Founder' }, { k: 'Setup time', v: '~2 minutes' }, { k: 'Status', v: 'Live' }],
    href: 'https://sitemind.tech', hrefLabel: 'sitemind.tech',
  },
  {
    plate: 'WA-028', name: 'CodeDuel', kind: 'Live 1v1 coding battles',
    line: 'Same problem, same clock. The first correct answer wins.',
    body: "LeetCode and Codeforces have a problem: the questions don't change, so people memorise the answers. I wanted something you can't memorise. CodeDuel puts two people in a live room and uses AI to write a fresh problem for every match. Code gets judged in a sandbox, and whoever gets it right first wins.",
    stack: ['TypeScript', 'Next.js', 'Socket.IO', 'Docker', 'Judge0', 'Gemini'],
    specs: [{ k: 'Matches played', v: '1,000+' }, { k: 'Questions', v: 'New every match' }, { k: 'Status', v: 'Live' }],
    href: 'https://codeduel.live', hrefLabel: 'codeduel.live',
  },
  {
    plate: 'WA-029', name: 'Encrypto', kind: 'Desktop encryption app',
    line: 'Files in, ciphertext out.',
    body: "I built this out of curiosity. I wanted to know how encryption really works, and what it takes to ship an actual desktop app instead of a script. It's written in C++, keeps its data in SQLite, supports more than one encryption algorithm, and installs on Linux with a single script.",
    stack: ['C++', 'SQLite', 'Bash', 'Linux'],
    specs: [{ k: 'Platform', v: 'Linux' }, { k: 'Storage', v: 'SQLite' }, { k: 'Install', v: 'One script' }],
    href: 'https://github.com/wolfie2007', hrefLabel: 'github.com/wolfie2007',
  },
];

export const metrics = [
  { v: '1K+', k: 'matches played on CodeDuel' },
  { v: '400→90', k: "weekly support tickets for one SiteMind customer" },
  { v: '488', k: 'GitHub contributions in the last year' },
];

export const toolkit = [
  ['Languages', 'TypeScript, JavaScript, C++, Java'],
  ['Frontend', 'React, Next.js, Tailwind CSS'],
  ['Backend', 'Node.js, Express, Socket.IO, PostgreSQL, MongoDB'],
  ['AI', 'LLM APIs, embeddings, RAG pipelines'],
  ['Tools', 'Docker, Git, Linux, Vercel, Cloudflare'],
] as const;

/* ------------------------------------------------------------------ */
/* Learning. Percentages are rough guesses, and that's fine.           */
/* ------------------------------------------------------------------ */
export const exposing = [
  { name: 'How LLMs work inside', pct: 55, note: 'Tokens, attention, training. How predicting the next word turns into something this capable.' },
  { name: 'Neural networks & deep learning', pct: 45, note: 'Building small networks myself until the maths stops feeling like magic.' },
  { name: 'Machine learning basics', pct: 65, note: 'The stuff under everything else: data, loss, gradients, why models overfit.' },
  { name: 'How AI labs ship models', pct: 30, note: 'How OpenAI, Google and Anthropic train, test and serve models to millions of people.' },
];

/* ------------------------------------------------------------------ */
/* Targets (ambitions)                                                  */
/* ------------------------------------------------------------------ */
export const targets = [
  { id: 'T-01', name: 'Found a startup with a million users', x: 24, y: 30, r: 11 },
  { id: 'T-02', name: 'Work at Anthropic, OpenAI or Google DeepMind', x: 64, y: 22, r: 12 },
  { id: 'T-03', name: 'Build AI that makes life easier for people', x: 47, y: 55, r: 8 },
  { id: 'T-04', name: 'Go to space', x: 78, y: 66, r: 9 },
  { id: 'T-05', name: 'Stay kind the whole way up', x: 22, y: 72, r: 6 },
];

/** Sky field behind the star chart (also preloaded). */
export const OBS_BG = src(photos.redFilament, 2000, '&sat=-45&con=10'); // tone baked in by the CDN, not a CSS filter

