import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** The login form exchanges ADMIN_KEY for an authenticated bearer cookie. */
export const ADMIN_COOKIE = "sn_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

// Bound parsing and require one canonical spelling of every signed component.
const MAX_TOKEN_LENGTH = 150;
const TOKEN_PATTERN = /^v1\.([1-9]\d{0,15})\.([0-9a-f]{64})\.([0-9a-f]{64})$/;

function sessionMac(payload: string, key: string): Buffer {
  return createHmac("sha256", key).update(`sn-admin-session:${payload}`).digest();
}

/** Fresh nonce and server-enforced 30-day expiry; the key never enters the cookie. */
export function sessionToken(key: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_COOKIE_MAX_AGE;
  const payload = `v1.${expiresAt}.${randomBytes(32).toString("hex")}`;
  return `${payload}.${sessionMac(payload, key).toString("hex")}`;
}

/** Legacy cookies are rejected. Rotating the current key invalidates all sessions. */
export function isValidSession(cookieValue: string | undefined): boolean {
  const key = process.env.ADMIN_KEY;
  if (!key || !cookieValue || cookieValue.length > MAX_TOKEN_LENGTH) return false;

  const match = TOKEN_PATTERN.exec(cookieValue);
  if (!match || match[0] !== cookieValue) return false;
  const expiresAt = Number(match[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;

  const payload = `v1.${match[1]}.${match[2]}`;
  const suppliedMac = Buffer.from(match[3], "hex");
  return timingSafeEqual(suppliedMac, sessionMac(payload, key));
}
