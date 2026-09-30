import { afterEach, expect, vi } from "vitest";

// Never invoke Next's dotenv loader or inherit a developer's real credentials.
process.env.ADMIN_KEY = "security-test-admin-key";
process.env.CRON_SECRET = "security-test-cron-key";
process.env.GEMINI_API_KEY = "security-test-provider-key";
process.env.GOOGLE_API_KEY = "";
process.env.BLOB_READ_WRITE_TOKEN = "";
process.env.NEXT_PUBLIC_SITE_URL = "https://security.example.invalid";

const unexpectedFetch = vi.fn(() => {
  throw new Error("Unexpected network call in offline security tests");
});
vi.stubGlobal("fetch", unexpectedFetch);

afterEach(() => {
  expect(unexpectedFetch).not.toHaveBeenCalled();
});
