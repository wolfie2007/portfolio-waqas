import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { motion, useScroll, useTransform, type MotionProps } from "framer-motion";

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

function LiveProjectButton() {
  return (
    <button className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors">
      Live Project
    </button>
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
    <section className="h-screen flex flex-col relative" style={{ overflowX: "clip" }}>
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

      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5 px-6 md:px-10">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]">
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

const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

function MarqueeRow({ images, reverse, offset }: { images: string[]; reverse: boolean; offset: number }) {
  const tripled = [...images, ...images, ...images];
  const x = reverse ? -(offset - 200) : offset - 200;
  return (
    <div className="flex gap-3" style={{ transform: `translateX(${x}px)`, willChange: "transform" }}>
      {tripled.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className="rounded-2xl object-cover shrink-0"
          style={{ width: 420, height: 270 }}
        />
      ))}
    </div>
  );
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section
      ref={ref}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3"
      style={{ background: "#0C0C0C" }}
    >
      <MarqueeRow images={MARQUEE_IMAGES.slice(0, 11)} reverse={false} offset={offset} />
      <MarqueeRow images={MARQUEE_IMAGES.slice(11)} reverse={true} offset={offset} />
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
        <ContactButton />
      </div>
    </section>
  );
}

/* ---------- Services ---------- */

const SERVICES = [
  { n: "01", name: "3D Modeling", d: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations." },
  { n: "02", name: "Rendering", d: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life." },
  { n: "03", name: "Motion Design", d: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences." },
  { n: "04", name: "Branding", d: "Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence." },
  { n: "05", name: "Web Design", d: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience." },
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
  col1a: string;
  col1b: string;
  col2: string;
};

const PROJECTS: Project[] = [
  {
    n: "01",
    category: "Client",
    name: "Nextlevel Studio",
    col1a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    col1b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    n: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    col1a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    col1b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
  },
  {
    n: "03",
    category: "Client",
    name: "Solaris Digital",
    col1a: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    col1b: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    col2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

function ProjectCard({ p, i, total, progress }: { p: Project; i: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const targetScale = 1 - (total - 1 - i) * 0.03;
  const range = [i / total, 1];
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <div className="sticky top-24 md:top-32" style={{ top: `${i * 28 + 96}px` }}>
      <motion.div
        style={{ scale }}
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6"
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
            <LiveProjectButton />
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
    </div>
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
      style={{ background: "#0C0C0C" }}
    >
      <h2
        className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Project
      </h2>
      <div>
        {PROJECTS.map((p, i) => (
          <div key={p.n} className="h-[85vh]">
            <ProjectCard p={p} i={i} total={PROJECTS.length} progress={scrollYProgress} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Page ---------- */

function Index() {
  return (
    <main style={{ background: "#0C0C0C", overflowX: "clip", fontFamily: "'Kanit', sans-serif" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </main>
  );
}
