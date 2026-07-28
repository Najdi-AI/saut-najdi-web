/**
 * The animated brand waveform (guideline p10 pattern system).
 * Server-renderable and deterministic — no Math.random, so SSR and
 * hydration always agree. Decorative only (aria-hidden); animation is
 * disabled globally under prefers-reduced-motion (globals.css).
 */

const STOPS: [number, number, number][] = [
  [46, 196, 230], // cyan
  [91, 108, 229], // blue
  [111, 63, 164], // purple
  [226, 12, 58], // magenta
  [236, 27, 58], // red
];

function colorAt(t: number): string {
  const seg = Math.min(Math.floor(t * (STOPS.length - 1)), STOPS.length - 2);
  const local = t * (STOPS.length - 1) - seg;
  const [r1, g1, b1] = STOPS[seg];
  const [r2, g2, b2] = STOPS[seg + 1];
  const r = Math.round(r1 + (r2 - r1) * local);
  const g = Math.round(g1 + (g2 - g1) * local);
  const b = Math.round(b1 + (b2 - b1) * local);
  return `rgb(${r} ${g} ${b})`;
}

export function Waveform({
  bars = 48,
  className = "",
  animate = true,
  maxHeight = 96,
}: {
  bars?: number;
  className?: string;
  animate?: boolean;
  maxHeight?: number;
}) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-[3px] ${className}`}
      dir="ltr"
    >
      {Array.from({ length: bars }, (_, i) => {
        const t = i / (bars - 1);
        // Deterministic organic height: layered sines
        const h =
          0.35 +
          0.65 *
            Math.abs(
              Math.sin(i * 0.55 + 1.2) * 0.6 + Math.sin(i * 1.7) * 0.4,
            );
        return (
          <span
            key={i}
            className={`w-[5px] rounded-full ${animate ? "animate-wave-bar" : ""}`}
            style={{
              height: `${Math.round(h * maxHeight)}px`,
              backgroundColor: colorAt(t),
              animationDelay: `${((i % 12) * 0.13).toFixed(2)}s`,
              animationDuration: `${(1.3 + (i % 5) * 0.18).toFixed(2)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
