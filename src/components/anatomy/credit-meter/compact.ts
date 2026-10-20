/**
 * Lossless path compaction for the finished drawing. The kit writes every
 * path as absolute M/L/H/V/Z commands rounded to 0.1; the same points written
 * as relative moves in tenths are about 40% shorter, and the page carries the
 * drawing twice (as HTML and in the React server payload). A path with any
 * coordinate finer than 0.1, or any other command, is left exactly as written.
 */
const TOKEN = /[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g;

/** A whole number of tenths, written as short as SVG allows: 12, 1.2, .2, -.2. */
function tenths(value: number) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const whole = Math.floor(abs / 10);
  const tenth = abs % 10;
  if (!tenth) return `${sign}${whole}`;
  return `${sign}${whole || ""}.${tenth}`;
}

function serialise(parts: string[]) {
  let out = "";
  let previous = "";
  for (const part of parts) {
    const number = !/^[A-Za-z]$/.test(part);
    const after = previous && !/^[A-Za-z]$/.test(previous);
    if (number && after && !(part.startsWith("-") || (previous.includes(".") && part.startsWith(".")))) out += " ";
    out += part;
    previous = part;
  }
  return out;
}

export function compactPath(d: string): string {
  const tokens = d.match(TOKEN);
  if (!tokens) return d;
  for (const token of tokens) {
    if (/^[A-Za-z]$/.test(token) ? !/^[MLHVZ]$/.test(token) : /\.\d\d/.test(token)) return d;
  }
  const parts: string[] = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let command = "";
  let emitted = "";
  let index = 0;
  const num = () => Math.round(Number(tokens[index++]) * 10);
  const emit = (letter: string, values: number[]) => {
    const implicit = (letter === "l" && (emitted === "m" || emitted === "l")) || ((letter === "h" || letter === "v") && letter === emitted);
    if (!implicit) parts.push(letter);
    for (const value of values) parts.push(tenths(value));
    emitted = letter;
  };
  while (index < tokens.length) {
    const token = tokens[index]!;
    if (/^[A-Za-z]$/.test(token)) {
      command = token;
      index++;
      if (command === "Z") {
        parts.push("z");
        emitted = "z";
        x = sx;
        y = sy;
      }
      continue;
    }
    if (command === "M") {
      const nx = num();
      const ny = num();
      if (!parts.length) emit("M", [nx, ny]);
      else emit("m", [nx - x, ny - y]);
      x = sx = nx;
      y = sy = ny;
      command = "L";
    } else if (command === "L") {
      const nx = num();
      const ny = num();
      emit("l", [nx - x, ny - y]);
      x = nx;
      y = ny;
    } else if (command === "H") {
      const nx = num();
      emit("h", [nx - x]);
      x = nx;
    } else if (command === "V") {
      const ny = num();
      emit("v", [ny - y]);
      y = ny;
    } else return d;
  }
  return serialise(parts);
}

export const compactSvg = (svg: string) => svg.replace(/ d="([^"]*)"/g, (_, d: string) => ` d="${compactPath(d)}"`);
