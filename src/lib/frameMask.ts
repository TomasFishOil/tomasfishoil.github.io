// this is all LLM generated slop, consider replacing later
import sharp from "sharp";

const SOLID_ALPHA = 32; // alpha >= this counts as part of the ring
const cache = new Map<string, Promise<string | undefined>>();

export function frameMask(svg: string, naturalWidth: number, targetWidth = 560) {
  const key = `${targetWidth}:${naturalWidth}:${svg}`;
  let hit = cache.get(key);
  if (!hit) {
    hit = build(svg, naturalWidth, targetWidth);
    cache.set(key, hit);
  }
  return hit;
}

async function build(svg: string, naturalWidth: number, targetWidth: number) {
  // SVG is rasterised at 72dpi × (density/72), pick the density that lands on targetWidth
  const density = Math.max(1, (72 * targetWidth) / naturalWidth);
  const { data, info } = await sharp(Buffer.from(svg), { density })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const solid = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) solid[i] = data[i * channels + 3] >= SOLID_ALPHA ? 1 : 0;

  const centre = (h >> 1) * w + (w >> 1);
  for (const radius of [0, 1, 2, 3]) {
    const barrier = radius ? dilate(solid, w, h, radius) : solid;
    const outside = fillFromEdges(barrier, w, h);
    if (outside[centre]) continue; // leaked into the middle — thicken the ring and retry

    const rgba = Buffer.alloc(w * h * 4); // RGB stays 0, alpha = keep/cut
    for (let i = 0; i < w * h; i++) rgba[i * 4 + 3] = outside[i] ? 0 : 255;
    const png = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  }
  return undefined;
}

/** 4-connected flood fill over non-barrier pixels, seeded from every edge pixel. */
function fillFromEdges(barrier: Uint8Array, w: number, h: number) {
  const outside = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;
  const push = (i: number) => {
    if (!barrier[i] && !outside[i]) {
      outside[i] = 1;
      queue[tail++] = i;
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (head < tail) {
    const i = queue[head++];
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }
  return outside;
}

/** Square dilation by r pixels (separable max filter). */
function dilate(src: Uint8Array, w: number, h: number, r: number) {
  const tmp = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r) && !v; k++) v = src[y * w + k];
      tmp[y * w + x] = v;
    }
  }
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let v = 0;
      for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r) && !v; k++) v = tmp[k * w + x];
      out[y * w + x] = v;
    }
  }
  return out;
}
