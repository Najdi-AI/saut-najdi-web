// Loader for ssr.mjs: .css imports become empty modules, .ts/.tsx are
// transpiled with the project's own TypeScript (JSX as react-jsx), and
// extensionless relative specifiers resolve to .ts/.tsx like Next does.
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

export async function resolve(specifier, context, next) {
  if (specifier.endsWith(".css")) return { url: `vault-css:${specifier}`, shortCircuit: true };
  if ((specifier.startsWith(".") || specifier.startsWith("/")) && !/\.[cm]?[jt]sx?$/.test(specifier) && context.parentURL?.startsWith("file:")) {
    for (const ext of [".ts", ".tsx"]) {
      const url = new URL(specifier + ext, context.parentURL);
      if (existsSync(fileURLToPath(url))) return next(url.href, context);
    }
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.startsWith("vault-css:")) return { format: "module", source: "export default {};", shortCircuit: true };
  if (url.endsWith(".tsx") || url.endsWith(".ts")) {
    const source = readFileSync(fileURLToPath(url), "utf8");
    const out = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
    return { format: "module", source: out.outputText, shortCircuit: true };
  }
  return next(url, context);
}
