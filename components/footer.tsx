import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="border-t border-paper/[0.08] py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:${site.email}`}
          className="w-fit font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40 transition-colors hover:text-paper"
        >
          {site.email}
        </a>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/25">
          © 2026 {site.name}
        </p>
      </div>
    </footer>
  );
}
