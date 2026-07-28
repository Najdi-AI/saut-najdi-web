import { ImageResponse } from "next/og";

export const alt = "Saut Najdi — صوت نجدي";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STOPS = ["#2EC4E6", "#5B6CE5", "#6F3FA4", "#E20C3A", "#EC1B3A"];

/** Default OG image: brand waveform + wordmark on the light canvas. */
export default function OgImage() {
  const bars = Array.from({ length: 36 }, (_, i) => {
    const t = i / 35;
    const h =
      40 + 140 * Math.abs(Math.sin(i * 0.55 + 1.2) * 0.6 + Math.sin(i * 1.7) * 0.4);
    const idx = Math.min(Math.floor(t * (STOPS.length - 1)), STOPS.length - 2);
    return { h, color: STOPS[idx] };
  });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F8FA",
          gap: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {bars.map((b, i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: b.h,
                borderRadius: 999,
                background: b.color,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 800, color: "#0D1326", letterSpacing: 10 }}>
            SAUT NAJDI
          </div>
          <div style={{ fontSize: 32, color: "#5B6CE5" }}>
            AI Voice. Human Care. Najdi by Heart.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
