<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Site Agent Rules — waqas-ameer personal site

> Read this entire file before touching any file in this repo.
> These are hard decisions. Do not relitigate them. Do not "improve" them without explicit instruction.

---

## 1. What this site is

A **writing-first personal site** for Waqas Ameer — a CS student in Islamabad building small AI systems, running evals, and writing about what breaks. It is NOT a portfolio landing page and NOT a typical developer homepage.

Sections (fixed, in order):
1. **Hero** — name, computed age, location, current status, bio, socials
2. **Writing** (`#writing`) — plain list of blog posts, most recent first
3. **Components** (`#components`) — 2–3 live interactive previews of open-source UI pieces
4. **Projects** (`#projects`) — text list, one-line descriptions, external links
5. **Dreams** (`#dreams`) — numbered life goals rendered as an interactive SVG graph

---

## 2. Stack (locked)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 App Router | Server Components by default; `'use client'` only where needed |
| Language | TypeScript (strict) | `noEmit`, `strict: true`, `allowJs: false` |
| Styling | Tailwind CSS v4 | `@import 'tailwindcss'` in globals.css — no config file |
| Animation | Framer Motion | Springs only for components; page-enter via CSS animation |
| Data viz | d3-scale + d3-shape | Dreams section SVG graph only |
| Fonts | OpenRunde (local, OFL) + IBM Plex Mono (Google) | Variables: `--font-open-runde`, `--font-plex-mono` / `--font-sans`, `--font-mono` |
| Hero BG | WebGL2 fragment shader | `dither-background.tsx` — do NOT replace with CSS/canvas2d/three.js |

Do not add new dependencies without explicit instruction.
Do not swap Tailwind for CSS modules, styled-components, or anything else.
Do not add a linter (no ESLint, no oxlint) unless explicitly asked.

---

## 3. Design tokens (non-negotiable)

```css
--color-ink:   #0a0a0a   /* near-black background, NOT pure #000 */
--color-paper: #e8e6e2   /* off-white text */
```

All opacity values on `paper` are intentional hairlines:
- `paper/[0.08]` — borders, dividers
- `paper/45–50` — body text, secondary
- `paper/80–85` — primary text (not quite full)
- `paper` (100%) — headings on hover/active only

**No accent color.** No gradients except the WebGL shader and the bottom fade-out in `dither-background.tsx`. No shadows.

Typography scale:
- Hero h1: `clamp(2.85rem, 9vw, 6rem)`, weight 500, tracking `-0.055em`, leading `0.94`
- Section h2: `2rem` / `2.25rem sm`, weight 500, tracking `-0.045em`
- Body: `1.0625rem`, leading `7` (28px)
- Small body: `0.9375rem`, leading `7`
- Mono labels: `9px`–`10px`, uppercase, tracking `0.12em`–`0.18em`

Content column: `max-w-[46rem]`, `px-6 sm:px-8`, centered.

---

## 4. Layout rules

- **Single centered column**, plain vertical scroll. No sidebars, no sticky nav.
- **No top-level navigation bar.** The hero navbar is just name + location, decorative.
- Sections separated by `border-t border-paper/[0.08]`, `py-20 sm:py-28`.
- Section header pattern: mono index label (`01`, `02`…) → h2 → optional intro paragraph.
- List items: `border-b border-paper/[0.08]`, `py-4 sm:py-5`, baseline-aligned.
- Mobile first. Test at 390px. No horizontal overflow.

---

## 5. Motion rules

- Page enter: CSS `page-enter` keyframe (opacity 0→1, translateY 10px→0, 700ms, cubic-bezier(0.22,1,0.36,1)), applied to `.page-enter` div wrapping `<main>`.
- Interactive springs: `stiffness: 280–500`, `damping: 20–32`, `mass: 0.6–0.8`. Never `duration`-based for spring components.
- Scroll animations: `whileInView`, `viewport={{ once: true, margin: '-15%' }}`.
- **Always** check `useReducedMotion()` and pass `{ duration: 0 }` when reduced.
- `suppressHydrationWarning` on any element whose value differs between server and client (e.g. `<Age />`).
- Do NOT add scroll-triggered parallax, stagger reveals on every element, or looping background animations beyond the WebGL shader.

---

## 6. File & component conventions

```
app/
  layout.tsx          — metadata, fonts, globals.css import
  page.tsx            — home; composes all section components
  globals.css         — @import tailwindcss, @theme, @layer base
  writing/[slug]/
    page.tsx          — post page (generateStaticParams from posts[])
  components/
    page.tsx          — component index
components/
  hero.tsx            — header with DitherBackground
  writing.tsx         — writing section (server)
  components-showcase.tsx — component section (server shell, client previews)
  projects.tsx        — projects section (server)
  dreams.tsx          — dreams section ('use client' — interactive SVG)
  footer.tsx          — email + copyright
  section.tsx         — shared Section wrapper
  age.tsx             — 'use client', suppressHydrationWarning
  dither-background.tsx — 'use client', WebGL2 shader
  previews/
    magnetic.tsx
    spring-switch.tsx
    segmented.tsx
content/
  site.ts             — single source of truth for all site data
lib/
  age.ts              — getAge(dateOfBirth, now?) pure function
  format-date.ts      — Intl.DateTimeFormat, UTC, 'en-GB'
```

**All site data** (name, bio, posts list, projects, components metadata, dreams) lives in `content/site.ts`. Do not hardcode strings in components.

Path alias `@/` resolves to repo root (see `tsconfig.json`).

---

## 7. `content/site.ts` — owner info

```ts
site.name        = 'Waqas Ameer'
site.dateOfBirth = '2006-03-14'      // used by Age component for computed age
site.location    = 'Islamabad, Pakistan'
site.locationShort = 'Islamabad, PK'
site.email       = 'waqasameer654@gmail.com'
site.socials     = [X, GitHub, LinkedIn]  // see file for hrefs
```

Posts, components, projects, and dreams are typed arrays — add items there, never inline.

---

## 8. BANNED — do not add under any circumstances

- Centered hero "badge pill" with emoji + status text
- Glow orbs / glow gradients
- Glassmorphism (`backdrop-blur` on decorative elements)
- Bento grid layouts
- Particle / star field backgrounds
- Feature cards with icons
- "Built with X" badge rows
- Gradient text
- Box shadows on content cards
- Any template-looking pattern
- Lottie animations
- Heavy third-party UI libraries (shadcn, radix standalone, headlessui, etc.)
- `<img>` for anything decorative — use CSS/SVG
- Horizontal scrolling carousels
- Weird pseudo-telemetry tags, fake analytics labels, corporate metric headers (`// EVALS`, `EXPERIMENT //`), or unrequested charts

---

## 9. Running locally

```bash
# Start dev server (node directly — npm script may not be in PATH)
node node_modules/next/dist/bin/next dev

# Type check
node_modules/.bin/tsc --noEmit

# Build
node node_modules/next/dist/bin/next build
```

> **Windows note:** If `node_modules` was built on Linux (e.g. WSL), run `npm install` on Windows first to get `lightningcss.win32-x64-msvc.node` and `@next/swc-win32-x64-msvc`. This happened once — keep it in mind.

Dev server runs on **http://localhost:3000** (also available on LAN at the Network URL printed on startup).

---

## 10. Writing voice (copy & blog posts)

All text on this site — post bodies, section intros, hero bio, project descriptions — follows these rules. No exceptions.

- **First-person, conversational.** Write like you're telling someone what actually happened, not presenting findings.
- **Preserve natural rhythm.** Sentence fragments are fine. So is starting with "And" or "But". Don't restructure sentences to make them "correct".
- **Everyday vocabulary.** If a simpler word exists, use it. Never reach for a word to sound smarter.
- **Occasional imperfection is authentic.** Don't over-polish. A slightly rough edge is better than something that reads like it was edited by committee.

**Never write:**
- LLM clichés: "dive into", "delve", "it's worth noting", "at the end of the day", "game-changer", "leverage", "navigate"
- Predictable transitions: "Furthermore,", "In conclusion,", "To summarize,", "With that said,"
- Generic conclusions with a motivational takeaway
- Corporate/startup language: "robust", "scalable", "ecosystem", "journey", "impactful", "craft" (as a verb)
- Unnecessary explanation of what you're about to say before saying it

**Aim for:** authenticity over polish, specific over general, one honest sentence over three vague ones.

---

## 11. What still needs doing (as of 2026-11-24)

- [ ] **Blog post content** — `app/writing/[slug]/page.tsx` currently shows a placeholder. Wire up real MDX or write post bodies. Posts defined in `content/site.ts` → `posts[]`.
- [ ] **Git commit** — changes from this session (fixed Dreams `draw` const, added routes) haven't been committed yet. Run `git add -A && git commit -m "..."`.
- [ ] **Deployment** — not yet deployed. Likely Vercel (zero config for Next.js).
- [ ] **OG image** — no `opengraph-image` file yet.
- [ ] **favicon** — `app/icon.svg` exists; verify it looks good at 16/32px.
