import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { motion, useScroll, useTransform, type MotionProps } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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
              style={{ color: "#D7E2EA" }}
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
            style={{ color: "#D7E2EA", fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a full-stack developer building real-time, production-ready web apps
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
    "Strict mode across every project to catch bugs at compile time",
  ]},
  { name: "React", sub: "Reusable interface systems", slug: "react", color: "#61DAFB", bullets: [
    "Built CodeDuel's realtime battle arena and live scoreboard UI",
    "Composed MediTrack's dashboard from small, reusable hook-driven components",
    "Managed cipher input/output state in Encrypto with controlled components",
  ]},
  { name: "Next.js", sub: "Full-stack product engineering", slug: "nextdotjs", color: "#FFFFFF", bullets: [
    "Shipped CodeDuel with SSR pages and API routes in one codebase",
    "Used server actions for MediTrack record mutations",
    "Deployed image-optimized landing pages on the edge",
  ]},
  { name: "Node.js", sub: "Server-side JavaScript runtime", slug: "nodedotjs", color: "#5FA04E", bullets: [
    "Powered CodeDuel's matchmaking and code-execution backend",
    "Built MediTrack's REST API for patient & prescription records",
    "Wrote CLI scripts to seed test data across projects",
  ]},
  { name: "Express", sub: "REST API foundations", slug: "express", color: "#FFFFFF", bullets: [
    "Structured MediTrack's routes, middleware and auth guards",
    "Exposed CodeDuel's duel lifecycle endpoints (create / join / submit)",
    "Wrote reusable error-handling and validation middleware",
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
    "Rapidly prototyped responsive layouts without leaving JSX",
  ]},
  { name: "Framer Motion", sub: "Motion & micro-interactions", slug: "framer", color: "#0055FF", bullets: [
    "Choreographed the hero, marquee and card animations on this site",
    "Added page transitions and hover micro-interactions to CodeDuel",
    "Used layout animations for smooth list reordering",
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
            className="absolute rounded-full flex items-center justify-center"
            style={{
              right: 18,
              bottom: 18,
              width: 42,
              height: 42,
              border: "1px solid rgba(215,226,234,0.3)",
              color: "#D7E2EA",
            }}
          >
            <ArrowUpRight size={20} strokeWidth={1.75} />
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
        <AnimatedText text="I'm a Computer Science student at Air University with hands-on experience building full-stack and real-time web apps using modern JavaScript. I've shipped production projects with real-time communication, API integrations, and scalable backends — and I love working with teams that want to build things that actually get used." />
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
            className="sticky flex items-start justify-center px-2"
            style={{ top: `${i * 36 + 80}px`, marginBottom: "18vh" }}
          >
            <ProjectCard p={p} i={i} total={PROJECTS.length} progress={scrollYProgress} />
          </div>
        ))}
        <div className="h-[60vh]" />
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

function Index() {
  return (
    <main style={{ overflowX: "clip", fontFamily: "'Kanit', sans-serif" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}

