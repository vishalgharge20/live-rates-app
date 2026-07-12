/**
 * MandalaBackground
 * ------------------------------------------------------
 * Renders a subtle, tiled mandala motif across the full
 * page background. Built as a single SVG <pattern> so the
 * browser only has to paint one small motif and repeat it
 * — cheap to render and crisp at any screen size.
 *
 * Kept at very low opacity + muted gold stroke so it reads
 * as texture/heritage rather than competing with the
 * foreground content.
 * ------------------------------------------------------
 */
export default function MandalaBackground() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="mandala-tile"
          width="160"
          height="160"
          patternUnits="userSpaceOnUse"
        >
          <g
            transform="translate(80,80)"
            fill="none"
            stroke="#d9a83c"
            strokeWidth="1"
          >
            {/* Outer ring of petals */}
            {Array.from({ length: 12 }).map((_, i) => (
              <ellipse
                key={`petal-${i}`}
                cx="0"
                cy="-52"
                rx="10"
                ry="24"
                transform={`rotate(${i * 30})`}
              />
            ))}
            {/* Concentric circles */}
            <circle r="60" />
            <circle r="44" />
            <circle r="28" />
            <circle r="12" />
            {/* Inner cross-hatch spokes */}
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={`spoke-${i}`}
                x1="0"
                y1="-12"
                x2="0"
                y2="-44"
                transform={`rotate(${i * 45})`}
              />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#mandala-tile)" />
    </svg>
  );
}
