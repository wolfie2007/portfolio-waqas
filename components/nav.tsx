'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/content/site';

const NAV_ITEMS = [
  { label: 'Writing', href: '#writing' },
  { label: 'Work', href: '#work' },
  { label: 'Dreams', href: '#dreams' },
];

export function Nav() {
  const [isVisible, setIsVisible] = useState(true);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      // Only engage frosted background once actually past the hero (e.g. 250px)
      setIsPastHero(currentY > 220);

      // On mobile: hide when scrolling down (>50px), show when scrolling up
      if (currentY > prevY && currentY > 50) {
        setIsVisible(false);
      } else if (currentY < prevY || currentY <= 50) {
        setIsVisible(true);
      }

      prevY = currentY;

      // Scroll-spy: determine active section reliably, including at page bottom
      const atBottom =
        window.innerHeight + currentY >=
        document.documentElement.scrollHeight - 40;

      if (atBottom) {
        setActiveSection('dreams');
        return;
      }

      const threshold = window.innerHeight * 0.4;
      let current = '';
      for (const item of NAV_ITEMS) {
        const el = document.querySelector(item.href);
        if (el && el.getBoundingClientRect().top <= threshold) {
          current = item.href.slice(1);
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full sm:translate-y-0'
      } ${
        isPastHero
          ? 'bg-ink/80 backdrop-blur-md border-b border-paper/[0.08]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="relative mx-auto flex w-full max-w-[46rem] items-center justify-between px-5 sm:px-8 py-3.5 sm:py-5">
        {/* Brand */}
        <a
          href="#"
          onClick={scrollToTop}
          className="pointer-events-auto text-[14px] sm:text-[15px] font-medium tracking-tight text-paper transition-colors hover:text-paper/80"
        >
          {site.name}
        </a>

        {/* Section Links */}
        <nav
          aria-label="Sections"
          className="pointer-events-auto flex items-center gap-5 sm:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={scrollTo(item.href)}
                className={`relative text-[13px] sm:text-[14px] tracking-tight transition-all duration-150 py-1 ${
                  isActive
                    ? 'text-paper font-medium'
                    : 'text-paper/55 hover:text-paper hover:-translate-y-px'
                }`}
              >
                <span>{item.label}</span>

                {/* Active hairline underline */}
                {isActive && (
                  <motion.span
                    layoutId="navActiveLine"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 480, damping: 32 }
                    }
                    className="absolute -bottom-0.5 inset-x-0 h-[1.5px] bg-paper shadow-[0_0_8px_rgba(232,230,226,0.3)]"
                  />
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
