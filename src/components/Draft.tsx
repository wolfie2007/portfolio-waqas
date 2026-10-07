/* Visible only in `npm run dev`: flags copy Claude drafted and Waqas should confirm. */
export default function Draft({ on }: { on?: boolean }) {
  if (!on || !import.meta.env.DEV) return null;
  return <span className="draft-dot" title="Draft copy, replace in src/content.ts">DRAFT</span>;
}
