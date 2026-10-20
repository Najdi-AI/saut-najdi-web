import { timingSafeEqual } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DraftPost, PendingDraft } from "@/lib/draftStore";
import type { CollectResult } from "@/lib/newsDraft";
import { GET as draftCron } from "@/app/api/cron/draft-post/route";
import { GET as probeCron } from "@/app/api/cron/batch-probe/route";

const boundary = vi.hoisted(() => ({
  jobs: [] as { name: string; displayName: string; createTime: string }[],
  client: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
  create: vi.fn(),
  submit: vi.fn(),
  collect: vi.fn<(pending: PendingDraft) => Promise<CollectResult>>(),
  store: {
    addPending: vi.fn(async () => undefined),
    listPending: vi.fn<() => Promise<PendingDraft[]>>(),
    clearPending: vi.fn(async () => undefined),
    saveDraft: vi.fn(async () => undefined),
    saveFailure: vi.fn(async () => undefined),
    setLastRun: vi.fn(async () => undefined),
    listDrafts: vi.fn<() => Promise<DraftPost[]>>(),
    deleteDraft: vi.fn(async () => undefined),
    isRenderable: vi.fn(() => null),
  },
}));

vi.mock("node:crypto", async () => {
  const actual = await vi.importActual<typeof import("node:crypto")>("node:crypto");
  // Spy calls through to Node's real primitive; no timing benchmark or fake
  // equality function substitutes for the security implementation.
  return { ...actual, timingSafeEqual: vi.fn(actual.timingSafeEqual) };
});
vi.mock("@/lib/newsDraft", () => ({
  DRAFT_SCHEMA: {}, MODEL: "synthetic-model", RESEARCH_PROMPT: "synthetic research",
  submitDraftBatch: boundary.submit, collectDraftBatch: boundary.collect,
}));
vi.mock("@/lib/draftStore", () => boundary.store);
vi.mock("@google/genai", () => ({
  ThinkingLevel: { HIGH: "HIGH" },
  GoogleGenAI: class {
    constructor(options: { apiKey: string }) { boundary.client(options); }
    batches = { list: boundary.list, get: boundary.get, create: boundary.create };
  },
}));

const SECRET = "security-test-cron-key";
const NOW = new Date("2026-09-14T12:00:00.000Z");

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  vi.stubEnv("CRON_SECRET", SECRET);
  // An auth bypass must reach the SDK spy, never hide behind a missing API key.
  vi.stubEnv("GEMINI_API_KEY", "security-test-provider-key");
  boundary.jobs = [];
  boundary.list.mockImplementation(async function* () { yield* boundary.jobs; });
  boundary.get.mockResolvedValue({ state: "JOB_STATE_SUCCEEDED", dest: { inlinedResponses: [] } });
  boundary.create.mockResolvedValue({ name: "synthetic-probe" });
  boundary.submit.mockResolvedValue("synthetic-draft-batch");
  boundary.collect.mockResolvedValue({ status: "pending" });
  boundary.store.listPending.mockResolvedValue([]);
  boundary.store.listDrafts.mockResolvedValue([]);
  vi.spyOn(console, "log").mockImplementation(() => undefined);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.mocked(console.log).mockRestore();
});

function request(path: string, authorization?: string) {
  return new Request(`https://security.example.invalid${path}`, { headers: authorization === undefined ? {} : { authorization } });
}
function expectNoWork() {
  for (const mock of [boundary.client, boundary.list, boundary.get, boundary.create, boundary.submit, boundary.collect, ...Object.values(boundary.store)]) {
    expect(mock).not.toHaveBeenCalled();
  }
}

for (const [name, path, handler] of [
  ["weekly draft", "/api/cron/draft-post", draftCron],
  ["batch probe", "/api/cron/batch-probe", probeCron],
] as const) {
  describe(`${name} real GET authentication`, () => {
    it.each([
      { label: "unset secret", secret: undefined, authorization: `Bearer ${SECRET}` },
      { label: "empty secret", secret: "", authorization: `Bearer ${SECRET}` },
      { label: "missing header", secret: SECRET, authorization: undefined },
      { label: "empty header", secret: SECRET, authorization: "" },
      { label: "wrong scheme", secret: SECRET, authorization: `bearer ${SECRET}` },
      { label: "short value", secret: SECRET, authorization: "Bearer short" },
      { label: "same length wrong value", secret: SECRET, authorization: `Bearer ${SECRET.slice(0, -1)}x` },
    ])("rejects $label before SDK/storage work", async ({ secret, authorization }) => {
      vi.stubEnv("CRON_SECRET", secret);
      const response = await handler(request(path, authorization));
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "unauthorized" });
      expectNoWork();
    });

    it("uses real timingSafeEqual for an equal-length invalid bearer", async () => {
      const response = await handler(request(path, `Bearer ${SECRET.slice(0, -1)}x`));
      expect(response.status).toBe(401);
      expect(timingSafeEqual).toHaveBeenCalledOnce();
      expectNoWork();
    });

    it("rejects a different byte length without throwing from timingSafeEqual", async () => {
      const response = await handler(request(path, "Bearer short"));
      expect(response.status).toBe(401);
      expect(timingSafeEqual).not.toHaveBeenCalled();
      expectNoWork();
    });

    it("rereads CRON_SECRET so the old bearer stops working after rotation", async () => {
      vi.stubEnv("CRON_SECRET", "security-test-rotated-cron-key");
      const response = await handler(request(path, `Bearer ${SECRET}`));
      expect(response.status).toBe(401);
      expectNoWork();
    });
  });
}

describe("authorized weekly draft behavior", () => {
  it("keeps one submission for an empty queue and records the synthetic pending job", async () => {
    const response = await draftCron(request("/api/cron/draft-post", `Bearer ${SECRET}`));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, submitted: "synthetic-draft-batch", stillRunning: 0 });
    expect(boundary.submit).toHaveBeenCalledOnce();
    expect(boundary.store.addPending).toHaveBeenCalledExactlyOnceWith({ batchId: "synthetic-draft-batch", submittedAt: NOW.toISOString() });
    expect(boundary.store.setLastRun).toHaveBeenCalledExactlyOnceWith({ at: NOW.toISOString(), submitted: "synthetic-draft-batch", collected: 0 });
    expect(boundary.client).not.toHaveBeenCalled();
    expect(timingSafeEqual).toHaveBeenCalledOnce();
  });

  it("does not stack a duplicate when a pending draft is still running", async () => {
    const pending = { batchId: "synthetic-existing", submittedAt: NOW.toISOString() };
    boundary.store.listPending.mockResolvedValue([pending]);
    const response = await draftCron(request("/api/cron/draft-post", `Bearer ${SECRET}`));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, submitted: null, stillRunning: 1 });
    expect(boundary.collect).toHaveBeenCalledExactlyOnceWith(pending);
    expect(boundary.submit).not.toHaveBeenCalled();
    expect(boundary.store.addPending).not.toHaveBeenCalled();
    expect(boundary.store.clearPending).not.toHaveBeenCalled();
  });
});

describe("authenticated probe reports without submitting new paid jobs", () => {
  it.each(["empty", "stale", "fresh", "unrelated"])("does not create a batch with a %s provider job list", async (kind) => {
    if (kind !== "empty") {
      boundary.jobs = [{
        name: "batches/synthetic-job",
        displayName: kind === "unrelated" ? "unrelated-job" : "probe8-synthetic-job",
        createTime: new Date(NOW.getTime() - (kind === "fresh" ? 1000 : 60 * 60 * 1000)).toISOString(),
      }];
    }
    const response = await probeCron(request("/api/cron/batch-probe", `Bearer ${SECRET}`));
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.submitted).toBe(0);
    expect(boundary.create).not.toHaveBeenCalled();
    expect(boundary.client).toHaveBeenCalledExactlyOnceWith({ apiKey: "security-test-provider-key" });
    expect(boundary.list).toHaveBeenCalledOnce();
    expect(boundary.get).toHaveBeenCalledTimes(kind === "stale" || kind === "fresh" ? 1 : 0);
    expect(result.report).toHaveLength(kind === "stale" || kind === "fresh" ? 1 : 0);
    expect(timingSafeEqual).toHaveBeenCalledOnce();
    expect(boundary.submit).not.toHaveBeenCalled();
    for (const mock of Object.values(boundary.store)) expect(mock).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("[batch-probe]", "probe submissions disabled, reporting only");
  });
});
