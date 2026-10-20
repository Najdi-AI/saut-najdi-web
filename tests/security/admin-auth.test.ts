import { createHash, createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, isValidSession, sessionToken } from "@/lib/adminAuth";
import { POST as login } from "@/app/(admin)/admin/login/submit/route";
import { POST as logout } from "@/app/(admin)/admin/logout/route";
import { GET as exportSubscribers } from "@/app/(admin)/admin/subscribers/export/route";

const boundary = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  listSubscribers: vi.fn(async () => []),
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => name === "sn_admin" && boundary.cookie ? { value: boundary.cookie } : undefined }),
}));
vi.mock("@/lib/newsletterStore", () => ({ listSubscribers: boundary.listSubscribers }));

const KEY = "security-test-admin-key";
const NOW = new Date("2026-09-14T12:00:00.000Z");

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  vi.stubEnv("ADMIN_KEY", KEY);
  boundary.cookie = undefined;
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

function loginRequest(key?: string) {
  const body = new FormData();
  if (key !== undefined) body.set("key", key);
  return new Request("https://security.example.invalid/admin/login/submit", { method: "POST", body });
}
function tokenFrom(response: Response): string {
  const value = response.headers.get("set-cookie");
  expect(value).toBeTruthy();
  return value!.split(";")[0].slice(`${ADMIN_COOKIE}=`.length);
}
function signedPayload(payload: string) {
  return `${payload}.${createHmac("sha256", KEY).update(`sn-admin-session:${payload}`).digest("hex")}`;
}

describe("real marketing login and session verifier", () => {
  it("issues different authenticated cookies on two real successful logins", async () => {
    const first = await login(loginRequest(KEY));
    const second = await login(loginRequest(KEY));
    expect(first.status).toBe(303);
    expect(first.headers.get("location")).toBe("/admin/blog");
    const firstToken = tokenFrom(first);
    const secondToken = tokenFrom(second);
    expect(firstToken === secondToken).toBe(false);
    expect(isValidSession(firstToken)).toBe(true);
    expect(isValidSession(secondToken)).toBe(true);
    for (const response of [first, second]) {
      const cookie = response.headers.get("set-cookie")!;
      expect(cookie.includes(KEY)).toBe(false);
      for (const attribute of ["HttpOnly", "Secure", "SameSite=Strict", "Path=/admin", "Max-Age=2592000"]) {
        expect(cookie.split("; ")).toContain(attribute);
      }
      expect(await response.text()).toBe("");
    }
  });

  it.each([undefined, "", "wrong", "security-test-admin-kex"])("rejects a missing or incorrect login key (%s)", async (supplied) => {
    const response = await login(loginRequest(supplied));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/login?error=1");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it.each([undefined, ""])("fails closed when the current ADMIN_KEY is unset or empty (%s)", async (key) => {
    const token = sessionToken(KEY);
    vi.stubEnv("ADMIN_KEY", key);
    expect(isValidSession(token)).toBe(false);
    const response = await login(loginRequest(KEY));
    expect(response.headers.get("location")).toBe("/admin/login?error=1");
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("checks the server expiry at exactly 30 days, independently of browser Max-Age", async () => {
    const token = tokenFrom(await login(loginRequest(KEY)));
    vi.setSystemTime(NOW.getTime() + ADMIN_COOKIE_MAX_AGE * 1000 - 1);
    expect(isValidSession(token)).toBe(true);
    vi.setSystemTime(NOW.getTime() + ADMIN_COOKIE_MAX_AGE * 1000);
    expect(isValidSession(token)).toBe(false);
    vi.setSystemTime(NOW.getTime() + (ADMIN_COOKIE_MAX_AGE + 1) * 1000);
    expect(isValidSession(token)).toBe(false);
  });

  it("rejects old deterministic bearer cookies even before the key rotates", () => {
    const legacy = createHash("sha256").update(`sn-admin:${KEY}`).digest("hex");
    expect(isValidSession(legacy)).toBe(false);
  });

  it("uses the current key so rotation invalidates prior sessions", () => {
    const previous = sessionToken(KEY);
    vi.stubEnv("ADMIN_KEY", "security-test-rotated-admin-key");
    expect(isValidSession(previous)).toBe(false);
    expect(isValidSession(sessionToken("security-test-rotated-admin-key"))).toBe(true);
  });

  it.each([
    ["missing", undefined], ["empty", ""], ["unstructured", "invalid"],
    ["separator only", "."], ["incomplete", "v1.1"], ["oversized", "x".repeat(4096)],
  ])("rejects malformed or oversized input: %s", (_name, value) => {
    expect(isValidSession(value)).toBe(false);
  });

  it.each(["version", "expiry", "nonce", "mac"] as const)("authenticates the %s component", (component) => {
    const parts = sessionToken(KEY).split(".");
    expect(parts.length).toBe(4);
    const index = { version: 0, expiry: 1, nonce: 2, mac: 3 }[component];
    parts[index] = component === "version" ? "v2" : component === "expiry" ? String(Number(parts[index]) + 1) : (parts[index][0] === "a" ? "b" : "a") + parts[index].slice(1);
    expect(isValidSession(parts.join("."))).toBe(false);
  });

  it.each([
    ["line feed", "\n"], ["carriage return", "\r"], ["CRLF", "\r\n"],
    ["space", " "], ["extra component", ".extra"],
  ])("rejects a valid token with a noncanonical suffix: %s", (_name, suffix) => {
    expect(isValidSession(sessionToken(KEY) + suffix)).toBe(false);
  });

  it.each([
    ["leading-zero expiry", "v1.02000000000." + "a".repeat(64)],
    ["unsafe integer expiry", "v1.9007199254740992." + "a".repeat(64)],
    ["fractional expiry", "v1.2000000000.5." + "a".repeat(64)],
    ["uppercase nonce", "v1.2000000000." + "A".repeat(64)],
    ["short nonce", "v1.2000000000." + "a".repeat(62)],
    ["expired signed payload", "v1.1." + "a".repeat(64)],
    ["unsupported version", "v2.2000000000." + "a".repeat(64)],
  ])("rejects a correctly MACed but invalid payload: %s", (_name, payload) => {
    expect(isValidSession(signedPayload(payload))).toBe(false);
  });

  it("logout clears only the browser cookie and does not claim individual server revocation", async () => {
    const token = sessionToken(KEY);
    const response = await logout();
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/login");
    expect(response.headers.get("set-cookie")).toBe(`${ADMIN_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0`);
    expect(isValidSession(token)).toBe(true);
  });
});

describe("unchanged protected newsletter export consumes the real verifier", () => {
  it.each(["missing", "invalid", "expired", "tampered"])("rejects %s session before reading subscribers", async (kind) => {
    if (kind === "invalid") boundary.cookie = "invalid";
    if (kind === "expired") {
      boundary.cookie = sessionToken(KEY);
      vi.setSystemTime(NOW.getTime() + ADMIN_COOKIE_MAX_AGE * 1000);
    }
    if (kind === "tampered") boundary.cookie = sessionToken(KEY).slice(0, -1) + "!";
    const response = await exportSubscribers();
    expect(response.status).toBe(404);
    expect(boundary.listSubscribers).not.toHaveBeenCalled();
  });

  it("allows a valid session to export only the synthetic empty list", async () => {
    boundary.cookie = sessionToken(KEY);
    const response = await exportSubscribers();
    expect(response.status).toBe(200);
    expect(boundary.listSubscribers).toHaveBeenCalledOnce();
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(await response.text()).toBe("email,locale,source,subscribed_at");
  });
});
