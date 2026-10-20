// Resolve the site's TypeScript the way Next does, so Node 24 can import the
// figure's own modules unchanged: extensionless specifiers try .ts/.tsx, and
// .ts files load as ES modules with their types stripped.
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, next) {
  if ((specifier.startsWith(".") || specifier.startsWith("/")) && !/\.[cm]?[jt]sx?$/.test(specifier) && context.parentURL?.startsWith("file:")) {
    for (const ext of [".ts", ".tsx", "/index.ts"]) {
      const url = new URL(specifier + ext, context.parentURL);
      if (existsSync(fileURLToPath(url))) return next(url.href, context);
    }
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.endsWith(".ts")) return next(url, { ...context, format: "module-typescript" });
  return next(url, context);
}

export const here = pathToFileURL(import.meta.filename).href;
