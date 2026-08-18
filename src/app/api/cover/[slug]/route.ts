import { createHash } from "node:crypto";
import sharp from "sharp";
import { getPost } from "@/lib/allPosts";

/**
 * Per-post cover art, generated on demand in the house style.
 *
 * Dashboard-published posts cannot ship a file in public/ (the bundle is
 * sealed at build time), so their covers are drawn here instead: the same
 * night-ground + spectrum-gradient language as the hand-made covers, with
 * the waveform bars and card geometry SEEDED FROM THE SLUG's hash — every
 * post gets its own stable artwork, and the same slug always renders the
 * same image, which is what makes the aggressive immutable caching safe.
 *
 * Only real posts get a cover: an unknown slug 404s, so this cannot be used
 * to make the server rasterise arbitrary strings.
 */
export const dynamic = "force-dynamic";

const W = 1200;
const H = 630;

function svgFor(slug: string): string {
  const seed = createHash("sha256").update(slug).digest();
  const pick = (i: number, min: number, max: number) =>
    min + (seed[i % seed.length] / 255) * (max - min);

  // Waveform card: 11 bars, heights seeded, centred column
  const barCount = 11;
  const cardX = pick(0, 560, 660);
  const cardY = pick(1, 180, 240);
  const cardW = 460;
  const cardH = 220;
  let bars = "";
  for (let i = 0; i < barCount; i++) {
    const h = pick(2 + i, 36, 148);
    const x = cardX + 58 + i * 32;
    const y = cardY + (cardH - h) / 2;
    bars += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="14" height="${h.toFixed(0)}" rx="7"/>`;
  }

  // Headline card: position + line widths seeded
  const hx = pick(14, 110, 170);
  const hy = pick(15, 100, 150);
  const lines = [pick(16, 160, 240), pick(17, 260, 330), pick(18, 220, 310), pick(19, 240, 320)];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#5FD8F2"/><stop offset="28%" stop-color="#8B99F5"/><stop offset="52%" stop-color="#B98CE0"/><stop offset="78%" stop-color="#FF5C7A"/><stop offset="100%" stop-color="#FF6B7F"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#8B99F5" stop-opacity="0.20"/><stop offset="100%" stop-color="#8B99F5" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#0F1730"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g opacity="0.95">
    <rect x="${hx.toFixed(0)}" y="${hy.toFixed(0)}" width="400" height="190" rx="32" fill="none" stroke="url(#g)" stroke-width="6"/>
    <rect x="${hx.toFixed(0)}" y="${hy.toFixed(0)}" width="400" height="190" rx="32" fill="#8B99F5" opacity="0.05"/>
  </g>
  <rect x="${(hx + 42).toFixed(0)}" y="${(hy + 46).toFixed(0)}" width="${lines[0].toFixed(0)}" height="14" rx="7" fill="url(#g)" opacity="0.9"/>
  <rect x="${(hx + 42).toFixed(0)}" y="${(hy + 82).toFixed(0)}" width="${lines[1].toFixed(0)}" height="10" rx="5" fill="url(#g)" opacity="0.45"/>
  <rect x="${(hx + 42).toFixed(0)}" y="${(hy + 106).toFixed(0)}" width="${lines[2].toFixed(0)}" height="10" rx="5" fill="url(#g)" opacity="0.45"/>
  <rect x="${(hx + 42).toFixed(0)}" y="${(hy + 130).toFixed(0)}" width="${lines[3].toFixed(0)}" height="10" rx="5" fill="url(#g)" opacity="0.45"/>
  <g opacity="0.95">
    <rect x="${cardX.toFixed(0)}" y="${cardY.toFixed(0)}" width="${cardW}" height="${cardH}" rx="36" fill="none" stroke="url(#g)" stroke-width="6"/>
    <rect x="${cardX.toFixed(0)}" y="${cardY.toFixed(0)}" width="${cardW}" height="${cardH}" rx="36" fill="#8B99F5" opacity="0.05"/>
  </g>
  <g fill="url(#g)">${bars}</g>
</svg>`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response("Not Found", { status: 404 });
  // Hidden posts still get their cover (the page is gone; a cached og:image
  // elsewhere should not break) — so check existence loosely via getPost OR
  // the slug having been real is fine; getPost covers the common case.
  const post = await getPost(slug);
  if (!post) return new Response("Not Found", { status: 404 });

  const png = await sharp(Buffer.from(svgFor(slug))).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      // Deterministic by construction — same slug, same pixels, forever.
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
