import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { motion, useScroll, useTransform, type MotionProps } from "framer-motion";
import { ArrowUpRight, Hand, Github, Linkedin, Mail, MapPin, ArrowUp, Instagram } from "lucide-react";


export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------- Reusable components ---------- */

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
};

function FadeIn({ children, delay = 0, duration = 0.7, x = 0, y = 30, as, className, style }: FadeInProps) {
  const Comp = motion.create(as ?? "div") as React.ComponentType<MotionProps & { className?: string; style?: React.CSSProperties; children?: ReactNode }>;
  return (
    <Comp
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Comp>
  );
}

function ContactButton() {
  return (
    <a
      href="mailto:waqasameer654@gmail.com"
      className="inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{
        background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
        boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
        outline: "2px solid #ffffff",
        outlineOffset: "-3px",
      }}
    >
      Contact Me
    </a>
  );
}

function ResumeButton() {
  return (
    <div className="resume-wrap">
      <div className="resume-peek-window" aria-hidden="true">
        <div className="resume-preview">
          <div className="rp-name" />
          <div className="rp-title" />
          <div className="rp-line rp-w90" />
          <div className="rp-line rp-w75" />
          <div className="rp-line rp-w95" />
          <div className="rp-line rp-w90" />
        </div>
      </div>
      <a
        href="/Waqas_Ameer_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        download
        className="resume-btn inline-flex items-center justify-center rounded-full text-white font-medium uppercase tracking-widest px-8 sm:px-10 md:px-12 text-xs sm:text-sm md:text-base"
        style={{
          background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
          boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
          outline: "2px solid #ffffff",
          outlineOffset: "-3px",
        }}
      >
        Download Resume
      </a>
    </div>
  );
}

function LiveProjectButton({ href, label = "Live Project" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors"
    >
      {label}
    </a>
  );
}

function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
  style,
}: {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0,0,0)");
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const withinX = Math.abs(dx) < rect.width / 2 + padding;
      const withinY = Math.abs(dy) < rect.height / 2 + padding;
      if (withinX && withinY) {
        setTransition(activeTransition);
        setTransform(`translate3d(${dx / strength}px, ${dy / strength}px, 0)`);
      } else {
        setTransition(inactiveTransition);
        setTransform("translate3d(0,0,0)");
      }
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} className={className} style={{ ...style, transform, transition, willChange: "transform" }}>
      {children}
    </div>
  );
}

function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const chars = Array.from(text);
  return (
    <p
      ref={ref}
      className="text-center font-medium leading-relaxed mx-auto"
      style={{ color: "#D7E2EA", maxWidth: 560, fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
    >
      {chars.map((c, i) => (
        <Char key={i} progress={scrollYProgress} range={[i / chars.length, (i + 1) / chars.length]}>
          {c}
        </Char>
      ))}
    </p>
  );
}

function Char({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{children === " " ? "\u00A0" : children}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">
        {children === " " ? "\u00A0" : children}
      </motion.span>
    </span>
  );
}

/* ---------- Hero ---------- */

function HeroSection() {
  return (
    <section className="h-screen flex flex-col relative" style={{ overflowX: "clip", background: "#06B6D4" }}>
      <FadeIn delay={0} y={-20}>
        <nav className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {["About", "Skills", "Projects", "Contact"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#0B1B4A" }}
            >
              {l}
            </a>
          ))}
        </nav>

      </FadeIn>

      <div className="mt-6 sm:mt-4 md:-mt-5 px-6 md:px-10">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[13.5vw] md:text-[14vw] lg:text-[15vw]" style={{ width: "fit-content", maxWidth: "100%" }}>
            Hi, i&apos;m waqas
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 relative">
        <FadeIn delay={0.35} y={20}>
          <p
            className="font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ color: "#0B1B4A", fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a full-stack engineer, building AI-powered SaaS products
          </p>

        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <Magnet padding={150} strength={3}>
          <img
            src="https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png"
            alt="Jack portrait"
            className="w-full h-auto select-none"
            draggable={false}
          />
        </Magnet>
      </FadeIn>
    </section>
  );
}

/* ---------- Marquee ---------- */

type Skill = { name: string; sub: string; slug: string; color: string; bullets: string[] };

const SKILLS: Skill[] = [
  { name: "TypeScript", sub: "Type-safe application code", slug: "typescript", color: "#3178C6", bullets: [
    "Wrote CodeDuel end-to-end in TS — shared types between client & server",
    "Modeled Encrypto's cipher configs as discriminated unions for safe UI switching",
    "Typed SiteMindAI's shared DTOs across the monorepo's apps and services",
  ]},
  { name: "React", sub: "Reusable interface systems", slug: "react", color: "#61DAFB", bullets: [
    "Built CodeDuel's realtime battle arena and live scoreboard UI",
    "Composed MediTrack's dashboard from small, reusable hook-driven components",
    "Built SiteMindAI's dashboard and widget-preview UI",
  ]},
  { name: "Next.js", sub: "Full-stack product engineering", slug: "nextdotjs", color: "#FFFFFF", bullets: [
    "Shipped CodeDuel with SSR pages and API routes in one codebase",
    "Deployed image-optimized landing pages on the edge",
    "Builds SiteMindAI's dashboard, landing page and auth flows",
  ]},
  { name: "Node.js", sub: "Server-side JavaScript runtime", slug: "nodedotjs", color: "#5FA04E", bullets: [
    "Powered CodeDuel's matchmaking and code-execution backend",
    "Built MediTrack's REST API for patient & prescription records",
    "Runs SiteMindAI's Express API, crawler and AI services",
  ]},
  { name: "Express", sub: "REST API foundations", slug: "express", color: "#FFFFFF", bullets: [
    "Structured MediTrack's routes, middleware and auth guards",
    "Exposed CodeDuel's duel lifecycle endpoints (create / join / submit)",
    "Built SiteMindAI's REST API for crawl jobs, chat and auth",
  ]},
  { name: "Socket.IO", sub: "Real-time communication", slug: "socketdotio", color: "#FFFFFF", bullets: [
    "Ran CodeDuel's live duels — code sync, timers and results in real time",
    "Broadcast opponent typing & submission events to rooms",
    "Handled reconnection so mid-duel drops don't kill the match",
  ]},
  { name: "MongoDB", sub: "Flexible document data", slug: "mongodb", color: "#47A248", bullets: [
    "Stored CodeDuel users, duels and problem sets as documents",
    "Modeled MediTrack patients + nested visits without rigid schemas",
    "Indexed frequent lookups to keep queries snappy",
  ]},
  { name: "Tailwind CSS", sub: "Scalable design system", slug: "tailwindcss", color: "#06B6D4", bullets: [
    "Styled this portfolio and MediTrack entirely with utility classes",
    "Built a shared token setup for consistent spacing & color",
    "Styled SiteMindAI's dashboard and marketing site with shadcn/ui",
  ]},
  { name: "Framer Motion", sub: "Motion & micro-interactions", slug: "framer", color: "#0055FF", bullets: [
    "Choreographed the hero, marquee and card animations on this site",
    "Added page transitions and hover micro-interactions to CodeDuel",
    "Animated SiteMindAI's dashboard transitions and widget preview",
  ]},
  { name: "React Native", sub: "Cross-platform mobile apps", slug: "react", color: "#61DAFB", bullets: [
    "Prototyped a mobile companion for MediTrack (iOS + Android)",
    "Reused core hooks and API layer from the web app",
    "Integrated native navigation and local notifications",
  ]},
  { name: "Docker", sub: "Containerized deployments", slug: "docker", color: "#2496ED", bullets: [
    "Containerized CodeDuel's code-runner in isolated sandboxes",
    "Ran MediTrack's API + Mongo locally with docker-compose",
    "Built slim multi-stage images for production deploys",
  ]},
  { name: "Linux", sub: "Server & tooling environment", slug: "linux", color: "#FCC624", bullets: [
    "Daily driver — every project developed and deployed from Linux",
    "Managed VPS boxes running CodeDuel + MediTrack backends",
    "Wrote bash scripts to automate builds and log rotation",
  ]},
  { name: "Git", sub: "Version-controlled workflow", slug: "git", color: "#F05032", bullets: [
    "Feature-branch workflow with rebases across every project",
    "Wrote atomic commits so history reads like a changelog",
    "Recovered work with reflog more than once — pays off",
  ]},
  { name: "GitHub", sub: "Source hosting & CI", slug: "github", color: "#FFFFFF", bullets: [
    "Hosts CodeDuel, Encrypto and MediTrack — public repos & issues",
    "Wired GitHub Actions for lint + build on every PR",
    "Managed releases and tags for versioned deploys",
  ]},
  { name: "Vercel", sub: "Edge deployment platform", slug: "vercel", color: "#FFFFFF", bullets: [
    "Deployed this portfolio and Next.js projects to the edge",
    "Preview URLs on every PR made design review painless",
    "Configured custom domains and env vars per environment",
  ]},
  { name: "C++", sub: "Systems & performance code", slug: "cplusplus", color: "#00599C", bullets: [
    "Solved DSA problems that later became CodeDuel's problem set",
    "Built university projects focused on memory and performance",
    "Comfortable with STL, pointers and OOP fundamentals",
  ]},
  { name: "Java", sub: "OOP & desktop applications", slug: "openjdk", color: "#FFFFFF", bullets: [
    "Built MediTrack's original desktop prototype in Java + Swing",
    "Applied OOP patterns for clean patient/record modeling",
    "Bridged the app to SQLite for local persistence",
  ]},
  { name: "SQLite", sub: "Embedded relational storage", slug: "sqlite", color: "#003B57", bullets: [
    "Backed MediTrack's desktop version with a local SQLite DB",
    "Designed normalized tables for patients, visits and meds",
    "Wrote parameterized queries to keep inputs safe",
  ]},
  { name: "PostgreSQL", sub: "Relational data & pgvector search", slug: "postgresql", color: "#4169E1", bullets: [
    "Stores SiteMindAI's crawled knowledge chunks with pgvector for similarity search",
    "Backs multi-tenant business, user and subscription data",
    "Used Prisma migrations to keep schema changes reviewable",
  ]},
  { name: "Prisma", sub: "Type-safe database access", slug: "prisma", color: "#2D3748", bullets: [
    "Modeled SiteMindAI's schema across businesses, sites and knowledge chunks",
    "Generated fully typed queries shared across the API",
    "Kept migrations deterministic across dev and production",
  ]},
  { name: "Redis", sub: "Queues & caching", slug: "redis", color: "#FF4438", bullets: [
    "Backs BullMQ job queues for SiteMindAI's website crawl workers",
    "Caches hot lookups to keep the assistant's responses fast",
    "Decouples long-running crawl jobs from the request/response cycle",
  ]},
  { name: "Gemini API", sub: "LLM chat & embeddings", slug: "googlegemini", color: "#8E75B2", bullets: [
    "Powers SiteMindAI's RAG pipeline — chat completions grounded in retrieved chunks",
    "Generates embeddings for crawled site content during ingestion",
    "Wrapped behind a provider abstraction so models can be swapped without touching callers",
  ]},
  { name: "Playwright", sub: "Automated site crawling", slug: "playwright", color: "#2EAD33", bullets: [
    "Crawls JS-rendered websites for SiteMindAI's ingestion pipeline",
    "Paired with Cheerio for fast static-HTML extraction where a full browser isn't needed",
    "Handles pagination and dynamic content that simple HTTP fetches would miss",
  ]},
];

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const num = String((index % SKILLS.length) + 1).padStart(3, "0");
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative shrink-0 cursor-pointer"
      style={{ width: 420, height: 270, perspective: 1200 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: "#121212",
            border: "1px solid rgba(215, 226, 234, 0.08)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(215,226,234,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(215,226,234,0.04) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              right: -40,
              top: -30,
              width: 220,
              height: 220,
              background: `radial-gradient(circle at 30% 30%, ${skill.color}, ${skill.color}99 55%, ${skill.color}22 100%)`,
              filter: "saturate(1.1)",
            }}
          >
            <img
              src={`https://cdn.simpleicons.org/${skill.slug}/ffffff`}
              alt=""
              loading="lazy"
               onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${skill.slug}.svg`;
  }}
              style={{ width: 78, height: 78, opacity: 0.95 }}
            />
          </div>
          <div
            className="absolute top-5 left-5 uppercase tracking-[0.18em]"
            style={{ color: "#D7E2EA", opacity: 0.55, fontSize: 11 }}
          >
            {num} / Capability
          </div>
          <div
            className="absolute left-5"
            style={{ top: 46, width: 60, height: 1, background: "rgba(215,226,234,0.25)" }}
          />
          <div className="absolute left-5 right-5" style={{ bottom: 56 }}>
            <div
              className="hero-heading font-black uppercase tracking-tight"
              style={{ fontSize: 44, lineHeight: 1 }}
            >
              {skill.name}
            </div>
            <div
              className="mt-2 font-light"
              style={{ color: "#D7E2EA", opacity: 0.7, fontSize: 13 }}
            >
              {skill.sub}
            </div>
          </div>
          <div
            className="absolute flex items-center gap-2"
            style={{ right: 18, bottom: 18 }}
          >
            <span
              className="uppercase tracking-[0.18em]"
              style={{ color: "#D7E2EA", opacity: 0.55, fontSize: 10 }}
            >
              Tap
            </span>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 42,
                height: 42,
                border: "1px solid rgba(215,226,234,0.3)",
                color: "#D7E2EA",
              }}
            >
              <Hand size={18} strokeWidth={1.75} />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden p-6 flex flex-col"
          style={{
            background: `linear-gradient(140deg, ${skill.color}22 0%, #121212 55%, #0d0d0d 100%)`,
            border: `1px solid ${skill.color}55`,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="rounded-full flex items-center justify-center shrink-0"
              style={{
                width: 40,
                height: 40,
                background: `${skill.color}33`,
                border: `1px solid ${skill.color}66`,
              }}
            >
              <img
                src={`https://cdn.simpleicons.org/${skill.slug}/ffffff`}
                alt=""
                loading="lazy"
                 onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = `https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${skill.slug}.svg`;
  }}
                style={{ width: 20, height: 20 }}
              />
            </div>
            <div
              className="hero-heading font-black uppercase tracking-tight"
              style={{ fontSize: 26, lineHeight: 1 }}
            >
              {skill.name}
            </div>
          </div>
          <ul className="flex flex-col gap-2.5 flex-1">
            {skill.bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-2.5 font-light"
                style={{ color: "#D7E2EA", opacity: 0.9, fontSize: 13, lineHeight: 1.45 }}
              >
                <span style={{ color: skill.color, marginTop: 6, width: 5, height: 5, borderRadius: 999, background: skill.color, flexShrink: 0, display: "inline-block" }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div
            className="uppercase tracking-[0.18em] mt-3"
            style={{ color: "#D7E2EA", opacity: 0.45, fontSize: 10 }}
          >
            Tap to flip back
          </div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ skills, reverse, startIndex }: { skills: Skill[]; reverse: boolean; startIndex: number }) {
  const doubled = [...skills, ...skills];
  return (
    <div
      className="flex gap-3 marquee-track"
      style={{
        animation: `${reverse ? "marquee-reverse" : "marquee-forward"} 60s linear infinite`,
        width: "max-content",
      }}
    >
      {doubled.map((s, i) => (
        <SkillCard key={i} skill={s} index={startIndex + (i % skills.length)} />
      ))}
    </div>
  );
}

function MarqueeSection() {
  const half = Math.ceil(SKILLS.length / 2);
  return (
    <section
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 marquee-section"
    >
      <MarqueeRow skills={SKILLS.slice(0, half)} reverse={false} startIndex={0} />
      <MarqueeRow skills={SKILLS.slice(half)} reverse={true} startIndex={half} />
    </section>
  );
}

/* ---------- About ---------- */

function AboutSection() {
  return (
    <section id="about" className="min-h-screen relative flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="" className="w-full" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="" className="w-full" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="" className="w-full" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="" className="w-full" />
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 relative z-10">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
            About me
          </h2>
        </FadeIn>
        <AnimatedText text="I'm a Computer Science student and founder of SiteMindAI, a RAG-powered SaaS that turns any website into a grounded AI assistant. I build full-stack products with modern JavaScript, real-time systems, scalable backends and AI integrations, turning ideas into production-ready software, and I love working with teams that want to build things that actually get used." />
      </div>
      <div className="mt-16 sm:mt-20 md:mt-24 relative z-10">
        <ResumeButton />
      </div>
    </section>
  );
}


/* ---------- Services ---------- */

const SERVICES = [
  { n: "01", name: "Full-Stack Web Apps", d: "End-to-end web applications built with React, Next.js, and Node.js — from schema and API to a polished, responsive frontend." },
  { n: "02", name: "Real-Time Systems", d: "Low-latency multiplayer and collaborative features powered by Socket.IO — synchronized sessions, live rooms, and reliable event flows." },
  { n: "03", name: "API Integration", p: "", d: "REST APIs, third-party services, and platforms like Judge0 and Gemini wired in with clean contracts, retries, and sensible fallbacks." },
  { n: "04", name: "Frontend Engineering", d: "Type-safe React and Next.js interfaces with Tailwind CSS and Framer Motion — fast, accessible, and pixel-precise across devices." },
  { n: "05", name: "Deployment & DevOps", d: "Dockerized services deployed to Vercel and Linux VPS with Git-based workflows, so releases are repeatable and shipping is boring." },
];

function ServicesSection() {
  return (
    <section
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: "#FFFFFF", color: "#0C0C0C" }}
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ color: "#0C0C0C", fontSize: "clamp(3rem, 12vw, 160px)", lineHeight: 1 }}
      >
        Services
      </h2>
      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.1}>
            <div
              className="flex items-start gap-6 sm:gap-10 py-8 sm:py-10 md:py-12"
              style={{ borderTop: "1px solid rgba(12,12,12,0.15)", borderBottom: i === SERVICES.length - 1 ? "1px solid rgba(12,12,12,0.15)" : undefined }}
            >
              <div className="font-black shrink-0" style={{ color: "#0C0C0C", fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 1 }}>
                {s.n}
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
                <div className="font-medium uppercase" style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)", lineHeight: 1.1 }}>
                  {s.name}
                </div>
                <p className="font-light leading-relaxed max-w-2xl" style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", opacity: 0.6 }}>
                  {s.d}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */

type Project = {
  n: string;
  category: string;
  name: string;
  href: string;
  linkLabel?: string;
  col1a: string;
  col1b: string;
  col2: string;
};

const PROJECTS: Project[] = [
  {
    n: "01",
    category: "Full-Stack · Real-Time",
    name: "CodeDuel",
    href: "https://codeduel.live",
    linkLabel: "Live Project",
    col1a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    col1b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    n: "02",
    category: "Desktop · Systems",
    name: "Encrypto",
    href: "https://github.com/wolfie2007/ENCRYPTO",
    linkLabel: "View on GitHub",
    col1a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    col1b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    n: "03",
    category: "Team · JavaFX",
    name: "MediTrack",
    href: "https://github.com/wolfie2007/MediTrack",
    linkLabel: "View on GitHub",
    col1a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    col1b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

function ProjectCard({ p, i, total, progress }: { p: Project; i: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const targetScale = 1 - (total - 1 - i) * 0.04;
  const range = [i / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <motion.div
      style={{ scale }}
      className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 w-full"
    >
      <div className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px]" style={{ background: "#0C0C0C" }}>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-2 sm:px-4 pb-4 sm:pb-6">
          <div className="font-black" style={{ color: "#D7E2EA", fontSize: "clamp(3rem, 10vw, 140px)", lineHeight: 1 }}>
            {p.n}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="uppercase tracking-widest text-xs sm:text-sm" style={{ color: "#D7E2EA", opacity: 0.6 }}>
              {p.category}
            </div>
            <div className="font-medium uppercase truncate" style={{ color: "#D7E2EA", fontSize: "clamp(1rem, 2.2vw, 2rem)" }}>
              {p.name}
            </div>
          </div>
          <LiveProjectButton href={p.href} label={p.linkLabel} />
        </div>
        <div className="grid grid-cols-[2fr_3fr] gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <img src={p.col1a} alt="" className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] w-full object-cover" style={{ height: "clamp(130px, 16vw, 230px)" }} />
            <img src={p.col1b} alt="" className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] w-full object-cover" style={{ height: "clamp(160px, 22vw, 340px)" }} />
          </div>
          <img src={p.col2} alt="" className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] w-full h-full object-cover" />
        </div>
      </div>
    </motion.div>
  );
}


function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section
      id="projects"
      ref={ref}
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <h2
        className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Project
      </h2>
      <div className="relative">
        {PROJECTS.map((p, i) => (
          <div
            key={p.n}
            className="sticky flex items-start justify-center px-2 h-[90vh]"
            style={{ top: `${i * 36 + 80}px` }}
          >
            <ProjectCard p={p} i={i} total={PROJECTS.length} progress={scrollYProgress} />
          </div>
        ))}
      </div>

    </section>
  );
}

/* ---------- Footer ---------- */

function useLahoreTime() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      try {
        setTime(
          new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Karachi",
          }).format(new Date()),
        );
      } catch {
        setTime("");
      }
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function SocialIconButton({
  href,
  label,
  brand,
  icon: Icon,
  iconSrc,
}: {
  href: string;
  label: string;
  brand: string;
  icon?: ElementType;
  iconSrc?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center justify-center rounded-2xl transition-all duration-300"
      style={{
        width: 64,
        height: 64,
        border: `1px solid ${hover ? brand : "rgba(215,226,234,0.18)"}`,
        background: hover ? `${brand}1A` : "rgba(255,255,255,0.02)",
        color: hover ? brand : "#D7E2EA",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          style={{ width: 28, height: 28, filter: hover ? "none" : "grayscale(1) opacity(0.75)" }}
        />
      ) : Icon ? (
        <Icon size={28} strokeWidth={1.6} />
      ) : null}
    </a>
  );
}

function Footer() {
  const time = useLahoreTime();
  const year = new Date().getFullYear();

  const socials = [
    { label: "GitHub", href: "https://github.com/wolfie2007", icon: Github, brand: "#8957e5" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/waqas-ameer-024258374", icon: Linkedin, brand: "#0A66C2" },
    { label: "Email", href: "mailto:waqasameer654@gmail.com", icon: Mail, brand: "#EA4335" },
    { label: "Instagram", href: "https://instagram.com/waqas_2007", icon: Instagram, brand: "#E1306C" },
    { label: "WhatsApp", href: "https://wa.me/923409192329", iconSrc: "https://cdn.simpleicons.org/whatsapp/ffffff", brand: "#25D366" },
  ];

  const nav = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Resume", href: "/Waqas_Ameer_Resume.pdf" },
  ];

  return (
    <footer
      className="relative overflow-hidden pt-20 sm:pt-28 md:pt-36 pb-8 px-5 sm:px-8 md:px-12 lg:px-16"
      style={{
        background:
          "radial-gradient(120% 90% at 100% 0%, rgba(182,0,168,0.22) 0%, transparent 55%), radial-gradient(90% 80% at 0% 100%, rgba(6,182,212,0.18) 0%, transparent 55%), #0A0413",
        borderTop: "1px solid rgba(215,226,234,0.1)",
      }}
    >
      {/* asymmetric decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(242,231,245,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(242,231,245,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-[1400px] mx-auto relative">
        {/* CTA row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-end mb-16 sm:mb-24">
          <div>
            <div
              className="uppercase tracking-[0.32em] font-light mb-4"
              style={{ color: "#D7E2EA", opacity: 0.55, fontSize: 12 }}
            >
              [ Let&apos;s make something ]
            </div>
            
              href="mailto:waqasameer654@gmail.com"
              className="group inline-flex items-baseline gap-3 sm:gap-6 flex-wrap"
              style={{ color: "#F2E7F5" }}
            >
              <span
                className="font-black uppercase leading-[0.85] tracking-tight"
                style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
              >
                Say
              </span>
              <span
                className="italic font-light leading-[0.85]"
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(2.5rem, 9vw, 8rem)",
                  background: "linear-gradient(93deg, #F5C518 0%, #B600A8 60%, #06B6D4 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                hello
              </span>
              <span
                className="font-black uppercase leading-[0.85] tracking-tight transition-transform duration-300 group-hover:translate-x-2 inline-flex items-center gap-2"
                style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)" }}
              >
                &rarr;
              </span>
            </a>
            <div
              className="mt-6 font-light max-w-lg"
              style={{ color: "#D7E2EA", opacity: 0.7, fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)" }}
            >
              Freelance projects, full-time roles, collaborations, or just to nerd out about
              distributed systems &mdash; my inbox is open.
            </div>
          </div>

          {/* status card */}
          <div
            className="rounded-2xl p-6 min-w-[260px]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(215,226,234,0.14)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: "#22c55e" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#22c55e" }} />
              </span>
              <span className="uppercase tracking-[0.24em] font-medium" style={{ color: "#22c55e", fontSize: 11 }}>
                Available for work
              </span>
            </div>
            <div className="flex items-center gap-2 mb-1" style={{ color: "#F2E7F5" }}>
              <MapPin size={14} style={{ opacity: 0.7 }} />
              <span className="text-sm font-light">Islamabad, Pakistan</span>
            </div>
            <div className="text-sm font-light mb-1" style={{ color: "#D7E2EA", opacity: 0.7 }}>
              Local time <span style={{ color: "#F5C518" }}>{time || "--:--"}</span> &middot; PKT
            </div>
            <div className="text-sm font-light" style={{ color: "#D7E2EA", opacity: 0.7 }}>
              Open to remote work &middot; worldwide
            </div>
          </div>
        </div>

        {/* link columns */}
        <div className="flex flex-wrap gap-16 sm:gap-24 mb-16 sm:mb-24">
          <div>
            <div className="uppercase tracking-[0.28em] font-medium mb-4" style={{ color: "#D7E2EA", opacity: 0.55, fontSize: 11 }}>
              Elsewhere
            </div>
            <div className="flex gap-4">
              {socials.map((s) => (
                <SocialIconButton key={s.label} href={s.href} label={s.label} brand={s.brand} icon={s.icon} iconSrc={s.iconSrc} />
              ))}
            </div>
          </div>

          <div>
            <div className="uppercase tracking-[0.28em] font-medium mb-4" style={{ color: "#D7E2EA", opacity: 0.55, fontSize: 11 }}>
              Sitemap
            </div>
            <ul className="flex flex-col gap-3">
              {nav.map((n) => (
                <li key={n.label}>
                  
                    href={n.href}
                    className="font-medium hover:underline decoration-[#B600A8] underline-offset-4"
                    style={{ color: "#F2E7F5", fontSize: 15 }}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* GIANT wordmark */}
        <div className="relative -mx-2 mb-10">
          <div
            className="font-black uppercase leading-[0.8] tracking-tight text-center select-none"
            style={{
              fontSize: "clamp(4rem, 22vw, 22rem)",
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(242,231,245,0.5)",
            }}
          >
            WAQAS.
          </div>
        </div>

        {/* bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(215,226,234,0.1)" }}
        >
          <div className="uppercase tracking-[0.24em] font-light" style={{ color: "#D7E2EA", opacity: 0.55, fontSize: 11 }}>
            &copy; {year} Waqas Ameer
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 uppercase tracking-[0.24em] font-medium"
            style={{ color: "#F5C518", fontSize: 11 }}
          >
            <span>Back to top</span>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:-translate-y-1"
              style={{ border: "1px solid #F5C518" }}
            >
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */

function Index() {
  return (
    <main style={{ overflowX: "clip", fontFamily: "'Kanit', sans-serif" }}>
      <HeroSection />
      <div className="hero-fade">
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight"
          style={{
            fontSize: "clamp(3rem, 12vw, 160px)",
            position: "absolute",
            bottom: "8%",
            left: 0,
            right: 0,
          }}
        >
          Tech Stack
        </h2>
      </div>
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}


