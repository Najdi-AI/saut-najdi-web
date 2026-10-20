// Builds the homepage voice clips: the hero's short exchange (HeroVisual) and the clinic call (SampleConversation),
// spoken by Saut Najdi's own agent voice (Raed, the platform's engine voice) with two other Cartesia voices for the
// caller and for «أحمد», the clinic's human employee. Adapted from the booth video's tooling
// (booth-video-ghe-2026/scripts: voice-lines.mjs for the Cartesia request, voice-post.mjs for trimming, levelling and
// the peak limiter, wav.mjs for WAV files and BS.1770 loudness). No dependencies beyond Node and an ffmpeg binary.
//
//   CARTESIA_API_KEY="$(gcloud secrets versions access latest --secret=cartesia-api-key --project=najdiai)" \
//     node scripts/make-home-voice.mjs                 synthesise (or reuse cached takes), mix, encode, write public/audio
//   CARTESIA_API_KEY=... node scripts/make-home-voice.mjs --list-voices    Cartesia's Arabic voices: id, gender, name
//   node scripts/make-home-voice.mjs --offline         rebuild from cached takes only (no key, no network)
//
// Options: --cache <dir> (default <os tmp>/saut-najdi-home-voice) holds the raw takes, so a re-run only pays for lines
// whose text or voice changed; --fresh ignores it. FFMPEG=<path> picks the encoder (it needs AAC and the loudnorm
// filter); by default the script uses Remotion's bundled ffmpeg from the booth video repo next to this one.
//
// The key is read from the environment only. It is never printed, logged or written anywhere; a failed request prints
// its HTTP status and nothing else. Exit codes: 0 done, 1 failed, 2 no key (and a take was not cached).
//
// Outputs, all in public/audio: <clip>.m4a (AAC-LC mono 48 kHz, about -16 LUFS integrated, true peak <= -1 dBTP,
// faststart) and <clip>.json (start and end of each spoken turn in ms, plus the escalation chime for the clinic call).
// The components fetch the JSON at runtime, on the first press, so re-running this script keeps the bubbles in sync
// with the audio without a code change.

import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public/audio');

// Saut Najdi's platform voice settings (najdiai packages/tts-providers; same as the booth video). Public identifiers.
const CARTESIA = {
  base: 'https://api.cartesia.ai',
  model: 'sonic-3.6-2026-08-27',
  version: '2026-08-14',
};

// Voice ids are public identifiers, not secrets. The caller is a man on purpose: both scripts answer him with «أبشر»
// and «يناسبك», which in Najdi speech address a man (a woman would hear «أبشري»), and the bubbles are not changed.
export const VOICES = {
  agent: {id: 'f9f9f472-6247-4403-9abe-616f7c407c63', name: 'Raed'}, // the product's engine voice
  caller: {id: 'e3087ad8-7018-4154-9a87-11577f916cd4', name: 'Omar'},
  ahmed: {id: 'db873303-3a70-4d9d-867a-0d70a6377195', name: 'Tariq'},
};

// The bubbles show digits; the voices must say the words. [as written on screen, as spoken].
const SPOKEN_FORMS = [['4:30', 'أربع ونص']];
// Typography a voice should pause on rather than read: the dash becomes a comma, the trailing ellipsis a full stop.
const PAUSES = [[/\s*—\s*/g, '، '], [/…/g, '.']];
// What a voice would read out wrong if it reached a transcript: any digit or a clock colon.
const UNSPOKEN = /[0-9٠-٩۰-۹:]/u;

// Each clip, turn by turn. `text` is the bubble exactly as the component renders it (checked against `source`, so a
// copy edit there fails here instead of leaving a clip that no longer matches its bubble). `gapMs` is the silence
// between the previous sound's end and this one's start.
export const CLIPS = [
  {
    name: 'home-hero',
    source: 'src/components/HeroVisual.tsx',
    parts: [
      {who: 'agent', text: 'هلا! كيف أقدر أساعدك؟'},
      {who: 'caller', text: 'أبغى أحجز موعد بكرة', gapMs: 450},
      {who: 'agent', text: 'أبشر! بكرة عندنا الساعة 4:30 العصر، يناسبك؟', gapMs: 320},
    ],
  },
  {
    name: 'clinic-call',
    source: 'src/components/SampleConversation.tsx',
    parts: [
      {who: 'caller', text: 'السلام عليكم، أبغى أحجز موعد أسنان بكرة.'},
      {who: 'agent', text: 'هلا وغلا! أبشر. بكرة عندنا فاضي الساعة 4:30 العصر — يناسبك؟', gapMs: 320},
      {who: 'caller', text: 'يناسبني. بس عندي سؤال عن ألم بعد حشوة سويتها عندكم…', gapMs: 450},
      {chime: true, gapMs: 350},
      {who: 'ahmed', text: 'معك أحمد من العيادة، قريت ملخص كلامك — خلني أطمنك على موضوع الحشوة…', gapMs: 250},
    ],
  },
];

const RATE = 48000;
const TARGET_LUFS = -16; // integrated, per clip
const MAX_TRUE_PEAK = -1; // dBTP, measured on the encoded file
const START_CEILING_DBFS = -1.5; // sample-peak ceiling before encoding; AAC can overshoot it a little
const TURN = {leadMs: 30, tailMs: 120}; // silence kept around each spoken turn
const CLIP = {leadMs: 150, tailMs: 300}; // silence at the start and end of each clip
const CHIME_UNDER_VOICE_LU = 9;
const BITRATE = '64k';
const SPEECH_DBFS = -50; // speech starts and ends where it is louder than this, at the target level

const ms = (x) => Math.round((x * RATE) / 1000);
const toMs = (samples) => Math.round((samples / RATE) * 1000);
const dbToGain = (db) => 10 ** (db / 20);

// ---------------------------------------------------------------------------------------------------- text

export function spokenForm(text) {
  let out = text;
  for (const [written, spoken] of SPOKEN_FORMS) out = out.replaceAll(written, spoken);
  for (const [re, to] of PAUSES) out = out.replace(re, to);
  out = out.trim();
  const bad = UNSPOKEN.exec(out);
  if (bad) throw new Error(`«${out}» still has «${bad[0]}», which a voice reads out wrong; add it to SPOKEN_FORMS`);
  return out;
}

export function checkAgainstSource(clip) {
  const src = readFileSync(path.join(ROOT, clip.source), 'utf8');
  const missing = clip.parts.filter((p) => !p.chime && !src.includes(p.text)).map((p) => p.text);
  if (missing.length) {
    throw new Error(`${clip.source} no longer shows: ${missing.map((t) => `«${t}»`).join(', ')} (update CLIPS to match the bubbles)`);
  }
}

// ---------------------------------------------------------------------------------------------------- audio maths
// From booth-video-ghe-2026/scripts/wav.mjs and voice-post.mjs. Samples are on the 16-bit scale throughout.

const K_WEIGHTING = [
  [1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585], // high shelf
  [1, -2, 1, -1.99004745483398, 0.99007225036621], // RLB high-pass
];
// Integrated loudness, ITU-R BS.1770-4 (mono, 48 kHz): K-weighting, 400 ms blocks every 100 ms, absolute and
// relative gates.
export function loudness(samples) {
  const n = samples.length, power = new Float64Array(n), z = K_WEIGHTING.map(() => [0, 0, 0, 0]);
  for (let i = 0; i < n; i++) {
    let x = samples[i] / 32768;
    for (let s = 0; s < K_WEIGHTING.length; s++) {
      const [b0, b1, b2, a1, a2] = K_WEIGHTING[s], st = z[s];
      const y = b0 * x + b1 * st[0] + b2 * st[1] - a1 * st[2] - a2 * st[3];
      st[1] = st[0]; st[0] = x; st[3] = st[2]; st[2] = y;
      x = y;
    }
    power[i] = x * x;
  }
  const block = 0.4 * RATE, step = 0.1 * RATE, cum = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) cum[i + 1] = cum[i] + power[i];
  const lufs = (v) => -0.691 + 10 * Math.log10(v);
  const mean = (vs) => vs.reduce((a, b) => a + b, 0) / vs.length;
  const blocks = [];
  for (let j = 0; j + block <= n; j += step) blocks.push((cum[j + block] - cum[j]) / block);
  const loud = blocks.filter((v) => lufs(v) > -70);
  if (!loud.length) return -Infinity;
  const relative = lufs(mean(loud)) - 10;
  return lufs(mean(loud.filter((v) => lufs(v) > relative)));
}

// A clip's loudness inside silence, so the blocks over its first and last moments count (one gating block of pad).
function loudnessInSilence(samples) {
  const pad = ms(400), padded = new Float64Array(samples.length + 2 * pad);
  padded.set(samples, pad);
  return loudness(padded);
}

// Where the sound starts and stops, by short-time energy over a 5 ms window (see wav.mjs).
function audibleBounds(samples, dbfs) {
  const w = ms(5), floor = (32767 / 32768) ** 2 * 10 ** (dbfs / 10) * w;
  const p = Float64Array.from(samples, (s) => (s / 32768) ** 2);
  let start = 0, end = 0, sum = 0;
  for (let i = 0; i < p.length; i++) {
    sum += p[i] - (i >= w ? p[i - w] : 0);
    if (sum > floor) { start = Math.max(0, i - w + 1); break; }
  }
  sum = 0;
  for (let i = p.length - 1; i >= 0; i--) {
    sum += p[i] - (i + w < p.length ? p[i + w] : 0);
    if (sum > floor) { end = Math.min(p.length, i + w); break; }
  }
  return {start, end};
}

// Look-ahead peak limiter (voice-post.mjs): every sample ends at or under `ceiling`, with the gain ramping into each
// reduction at most 0.5 dB/ms and recovering at most 0.05 dB/ms, so it never jumps.
function limitPeaks(x, ceiling) {
  const n = x.length, gain = new Float64Array(n);
  let over = false;
  for (let i = 0; i < n; i++) {
    const a = Math.abs(x[i]);
    if (a > ceiling) { gain[i] = 20 * Math.log10(ceiling / a); over = true; }
  }
  if (!over) return x;
  const attack = (0.5 * 1000) / RATE, release = (0.05 * 1000) / RATE;
  for (let i = 1; i < n; i++) gain[i] = Math.min(gain[i], gain[i - 1] + release);
  for (let i = n - 2; i >= 0; i--) gain[i] = Math.min(gain[i], gain[i + 1] + attack);
  return Float64Array.from(x, (v, i) => v * dbToGain(gain[i]));
}

const toInt16 = (x) => Int16Array.from(x, (v) => Math.max(-32768, Math.min(32767, Math.round(v))));
const peakDbfs = (x) => 20 * Math.log10(x.reduce((m, v) => Math.max(m, Math.abs(v)), 0) / 32767);

function encodeWav(samples /* Int16Array */) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) data.writeInt16LE(samples[i], i * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0, 'ascii'); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8, 'ascii');
  h.write('fmt ', 12, 'ascii'); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36, 'ascii'); h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

// ---------------------------------------------------------------------------------------------------- sounds

// A spoken turn: trimmed to its speech plus a short lead and tail, then levelled to the clip target, so all three
// voices sit at one loudness before the clip is mixed.
export function prepareTurn(raw /* Int16Array */) {
  const before = loudnessInSilence(raw);
  if (!Number.isFinite(before)) throw new Error('a take is silent');
  const gainDb = TARGET_LUFS - before;
  const {start, end} = audibleBounds(raw, SPEECH_DBFS - gainDb);
  const from = Math.max(0, start - ms(TURN.leadMs)), to = Math.min(raw.length, end + ms(TURN.tailMs));
  const g = dbToGain(gainDb);
  return {samples: Float64Array.from(raw.subarray(from, to), (s) => s * g), onset: start - from, end: end - from};
}

// The escalation chime: a soft rising two-note (A5 then E6), sine tones with a quick fade-in and an exponential
// decay, levelled well under the voices. Pure maths, so it is identical on every run.
export function makeChime() {
  const len = ms(900), x = new Float64Array(len);
  for (const {f, at} of [{f: 880, at: 0}, {f: 1318.51, at: 0.15}]) {
    for (let i = ms(at * 1000); i < len; i++) {
      const t = i / RATE - at;
      const env = Math.min(1, t / 0.006) * Math.exp(-t / 0.2);
      x[i] += env * (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.exp(-t / 0.05) * Math.sin(4 * Math.PI * f * t));
    }
  }
  const g = dbToGain(TARGET_LUFS - CHIME_UNDER_VOICE_LU - loudnessInSilence(x.map((v) => v * 8000))) * 8000;
  return {samples: x.map((v) => v * g), onset: 0, end: len};
}

// Lays the parts out with their gaps, then levels the clip to the target. Returns the samples and the timings.
export function mixClip(clip, sounds) {
  const placed = [];
  let cursor = ms(CLIP.leadMs), lastEnd = null;
  clip.parts.forEach((part, i) => {
    const s = sounds[i];
    const at = lastEnd === null ? cursor - s.onset : lastEnd + ms(part.gapMs ?? 400) - s.onset;
    placed.push({part, s, at});
    lastEnd = at + s.end;
  });
  const total = Math.max(...placed.map((p) => p.at + p.s.samples.length), lastEnd + ms(CLIP.tailMs));
  const mix = new Float64Array(total);
  for (const {s, at} of placed) for (let i = 0; i < s.samples.length; i++) mix[at + i] += s.samples[i];
  const timings = {
    src: `/audio/${clip.name}.m4a`,
    durationMs: toMs(total),
    turns: placed.filter((p) => !p.part.chime).map((p) => ({who: p.part.who, startMs: toMs(p.at + p.s.onset), endMs: toMs(p.at + p.s.end)})),
  };
  const chime = placed.find((p) => p.part.chime);
  if (chime) timings.escalationMs = toMs(chime.at);
  return {mix, timings};
}

function level(mix, ceilingDbfs) {
  const ceiling = Math.floor(32767 * dbToGain(ceilingDbfs));
  let gainDb = TARGET_LUFS - loudness(mix), out = mix;
  for (let round = 0; round < 6; round++) {
    const g = dbToGain(gainDb);
    out = limitPeaks(mix.map((v) => v * g), ceiling);
    const miss = TARGET_LUFS - loudness(out);
    if (Math.abs(miss) < 0.01) break;
    gainDb += miss;
  }
  return toInt16(out);
}

// ---------------------------------------------------------------------------------------------------- Cartesia

function headers(apiKey, extra = {}) {
  return {'X-API-Key': apiKey, 'Cartesia-Version': CARTESIA.version, ...extra};
}

// One request. On failure it reports the HTTP status (or the error's class) and nothing else, so neither the key nor
// a response body can reach the console.
async function request(url, init, what) {
  let res;
  try {
    res = await fetch(url, {...init, redirect: 'error'});
  } catch (err) {
    throw new Error(`${what}: request failed (${err?.name ?? 'error'})`);
  }
  if (!res.ok) throw new Error(`${what}: HTTP ${res.status}`);
  return res;
}

async function synthesise(transcript, voiceId, apiKey) {
  const res = await request(`${CARTESIA.base}/tts/bytes`, {
    method: 'POST',
    headers: headers(apiKey, {'Content-Type': 'application/json', Accept: 'audio/*', 'Accept-Encoding': 'identity'}),
    body: JSON.stringify({
      model_id: CARTESIA.model, transcript, voice: {mode: 'id', id: voiceId}, language: 'ar',
      output_format: {container: 'raw', encoding: 'pcm_s16le', sample_rate: RATE},
    }),
  }, 'tts');
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2 || buf.length % 2) throw new Error(`tts: ${buf.length} bytes is not 16-bit PCM`);
  return new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
}

async function listVoices(apiKey) {
  const all = [];
  let after;
  for (let page = 0; page < 40; page++) {
    const url = new URL(`${CARTESIA.base}/voices`);
    url.searchParams.set('limit', '100');
    if (after) url.searchParams.set('starting_after', after);
    const body = await (await request(url, {headers: headers(apiKey)}, 'voices')).json();
    const items = Array.isArray(body) ? body : body.data ?? [];
    all.push(...items);
    if (Array.isArray(body) || !body.has_more || !items.length) break;
    after = items.at(-1).id;
  }
  const ar = all.filter((v) => v.language === 'ar');
  console.log(`${ar.length} Arabic voices (of ${all.length}):`);
  for (const v of ar) {
    const desc = String(v.description ?? '').replace(/\s+/g, ' ').slice(0, 150);
    console.log(`${v.id}  ${(v.gender ?? '-').padEnd(10)} ${v.name} | ${desc}`);
  }
}

// ---------------------------------------------------------------------------------------------------- ffmpeg

function ffmpegPath() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const candidates = [
    path.join(ROOT, 'node_modules/@remotion/compositor-win32-x64-msvc', exe),
    path.resolve(ROOT, '../../../booth-video-ghe-2026/node_modules/@remotion/compositor-win32-x64-msvc', exe),
    path.resolve(ROOT, '../../booth-video-ghe-2026/node_modules/@remotion/compositor-win32-x64-msvc', exe),
    path.resolve(ROOT, '../booth-video-ghe-2026/node_modules/@remotion/compositor-win32-x64-msvc', exe),
  ];
  const found = candidates.find((c) => existsSync(c));
  if (!found) throw new Error('no ffmpeg found: set FFMPEG to an ffmpeg with an AAC encoder and the loudnorm filter');
  return found;
}

// ffmpeg never needs the key, so its process does not inherit it (defence in depth).
function childEnv() {
  const env = {...process.env};
  delete env.CARTESIA_API_KEY;
  return env;
}

function ff(args) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegPath(), args, {env: childEnv()});
    let err = '';
    p.stderr.on('data', (d) => { err += d; });
    p.on('error', reject);
    p.on('close', (code) => resolve({code, stderr: err}));
  });
}

async function encodeAac(wavFile, outFile) {
  const common = ['-hide_banner', '-loglevel', 'error', '-y', '-i', wavFile, '-map_metadata', '-1', '-fflags', '+bitexact',
    '-flags:a', '+bitexact', '-ac', '1', '-ar', String(RATE), '-b:a', BITRATE, '-movflags', '+faststart', '-f', 'mp4'];
  for (const codec of ['libfdk_aac', 'aac']) {
    const {code} = await ff([...common.slice(0, 6), '-c:a', codec, ...common.slice(6), outFile]);
    if (code === 0) return codec;
  }
  throw new Error(`no AAC encoder worked for ${path.basename(outFile)}`);
}

// EBU R128 as ffmpeg's loudnorm measures it: integrated loudness and true peak of the encoded file.
async function measure(file) {
  const {code, stderr} = await ff(['-hide_banner', '-nostats', '-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-']);
  const json = /\{[^{}]*"input_i"[^{}]*\}/.exec(stderr);
  if (code !== 0 || !json) throw new Error(`loudnorm failed on ${path.basename(file)} (exit ${code})`);
  const m = JSON.parse(json[0]);
  return {lufs: Number(m.input_i), truePeak: Number(m.input_tp)};
}

// ---------------------------------------------------------------------------------------------------- run

function arg(argv, name) {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

async function main(argv) {
  const apiKey = (process.env.CARTESIA_API_KEY ?? '').trim();
  const offline = argv.includes('--offline'), fresh = argv.includes('--fresh');
  const cacheDir = path.resolve(arg(argv, '--cache') ?? path.join(os.tmpdir(), 'saut-najdi-home-voice'));

  if (argv.includes('--list-voices')) {
    if (!apiKey) { console.error('Set CARTESIA_API_KEY in this shell (never in a file).'); return 2; }
    await listVoices(apiKey);
    return 0;
  }

  const unset = Object.entries(VOICES).filter(([, v]) => !/^[0-9a-f-]{36}$/.test(v.id)).map(([k]) => k);
  if (unset.length) throw new Error(`pick a voice id for: ${unset.join(', ')} (run with --list-voices)`);

  mkdirSync(cacheDir, {recursive: true});
  mkdirSync(OUT_DIR, {recursive: true});
  let charsSent = 0, cached = 0;

  for (const clip of CLIPS) {
    checkAgainstSource(clip);
    const sounds = [];
    for (const part of clip.parts) {
      if (part.chime) { sounds.push(makeChime()); continue; }
      const voice = VOICES[part.who === 'ahmed' ? 'ahmed' : part.who];
      const transcript = spokenForm(part.text);
      const key = createHash('sha256').update([CARTESIA.model, CARTESIA.version, voice.id, RATE, transcript].join('\n')).digest('hex').slice(0, 24);
      const take = path.join(cacheDir, `${key}.pcm`);
      let raw;
      if (!fresh && existsSync(take)) {
        const buf = readFileSync(take);
        raw = new Int16Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
        cached++;
      } else {
        if (offline) throw new Error(`--offline: no cached take for «${transcript}»`);
        if (!apiKey) { console.error('Set CARTESIA_API_KEY in this shell (never in a file).'); return 2; }
        raw = await synthesise(transcript, voice.id, apiKey);
        charsSent += [...transcript].length;
        writeFileSync(take, Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength));
      }
      sounds.push(prepareTurn(raw));
    }

    await renderClip(clip, sounds, {outDir: OUT_DIR, workDir: cacheDir});
  }
  console.log(`characters sent to Cartesia this run: ${charsSent} (${cached} cached takes reused)`);
  return 0;
}

// Mixes one clip from its prepared sounds, levels it, encodes it (lowering the ceiling until the encoded file's true
// peak is in bounds), and writes <name>.m4a and <name>.json to outDir. Prints one summary line per clip.
export async function renderClip(clip, sounds, {outDir, workDir}) {
  const {mix, timings} = mixClip(clip, sounds);
  const wavFile = path.join(workDir, `${clip.name}.wav`);
  const outFile = path.join(outDir, `${clip.name}.m4a`);
  let ceiling = START_CEILING_DBFS, codec, m, samples;
  for (let round = 0; round < 4; round++) {
    samples = level(mix, ceiling);
    writeFileSync(wavFile, encodeWav(samples));
    codec = await encodeAac(wavFile, outFile);
    m = await measure(outFile);
    if (m.truePeak <= MAX_TRUE_PEAK) break;
    ceiling -= m.truePeak - MAX_TRUE_PEAK + 0.3;
  }
  if (m.truePeak > MAX_TRUE_PEAK) throw new Error(`${clip.name}: true peak ${m.truePeak} dBTP is over ${MAX_TRUE_PEAK}`);
  writeFileSync(path.join(outDir, `${clip.name}.json`), `${JSON.stringify(timings, null, 2)}\n`);

  const kb = statSync(outFile).size / 1024;
  console.log(`${clip.name}.m4a  ${(timings.durationMs / 1000).toFixed(2)} s  ${kb.toFixed(1)} KB  ${codec} ${BITRATE}  ` +
    `pcm ${loudness(samples).toFixed(1)} LUFS / ${peakDbfs(samples).toFixed(2)} dBFS  ` +
    `encoded ${m.lufs.toFixed(1)} LUFS / ${m.truePeak.toFixed(2)} dBTP`);
  console.log(`  turns ${timings.turns.map((t) => `${t.who}@${t.startMs}-${t.endMs}`).join(' ')}` +
    (timings.escalationMs !== undefined ? `  escalation@${timings.escalationMs}` : ''));
  return {timings, kb, lufs: m.lufs, truePeak: m.truePeak, codec};
}

if (import.meta.main) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (err) {
    console.error(`make-home-voice: ${err.message}`);
    process.exitCode = 1;
  }
}
