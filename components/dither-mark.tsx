export function DitherMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width="11"
      height="11"
      shapeRendering="crispEdges"
      aria-hidden
      className={`shrink-0 text-paper transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
    >
      {/* Outer diamond tips (fade in last on hover) */}
      <rect
        x="6"
        y="0"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-25 transition-opacity duration-200 delay-[60ms] group-hover:opacity-75"
      />
      <rect
        x="0"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-25 transition-opacity duration-200 delay-[60ms] group-hover:opacity-75"
      />
      <rect
        x="12"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-25 transition-opacity duration-200 delay-[60ms] group-hover:opacity-75"
      />
      <rect
        x="6"
        y="12"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-25 transition-opacity duration-200 delay-[60ms] group-hover:opacity-75"
      />

      {/* Diagonal ring */}
      <rect
        x="3"
        y="3"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-55 transition-opacity duration-200 delay-[25ms] group-hover:opacity-95"
      />
      <rect
        x="9"
        y="3"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-55 transition-opacity duration-200 delay-[25ms] group-hover:opacity-95"
      />
      <rect
        x="3"
        y="9"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-55 transition-opacity duration-200 delay-[25ms] group-hover:opacity-95"
      />
      <rect
        x="9"
        y="9"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-55 transition-opacity duration-200 delay-[25ms] group-hover:opacity-95"
      />

      {/* Inner Bayer-staggered fill */}
      <rect
        x="6"
        y="3"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-15 transition-opacity duration-200 delay-[40ms] group-hover:opacity-70"
      />
      <rect
        x="3"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-15 transition-opacity duration-200 delay-[40ms] group-hover:opacity-70"
      />
      <rect
        x="9"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-15 transition-opacity duration-200 delay-[40ms] group-hover:opacity-70"
      />
      <rect
        x="6"
        y="9"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-15 transition-opacity duration-200 delay-[40ms] group-hover:opacity-70"
      />

      {/* Core pixel */}
      <rect
        x="6"
        y="6"
        width="2"
        height="2"
        fill="currentColor"
        className="opacity-90 transition-opacity duration-200 group-hover:opacity-100"
      />
    </svg>
  );
}
