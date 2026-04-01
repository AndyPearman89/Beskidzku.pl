import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { checkRateLimit, getClientIp } from "@/core/api/rateLimiter";

// Generate a unique key prefix per test run to avoid cross-test contamination
// of the module-level store (which is private and cannot be cleared directly).
let keyCounter = 0;
function uniqueKey(base: string): string {
  return `${base}-${Date.now()}-${++keyCounter}`;
}

// ---------------------------------------------------------------------------
// checkRateLimit
// ---------------------------------------------------------------------------
describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows the first request within a new window", () => {
    const key = uniqueKey("first");
    expect(checkRateLimit(key, 5)).toBe(true);
  });

  it("allows subsequent requests up to the limit", () => {
    const key = uniqueKey("up-to-limit");
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5)).toBe(true);
    }
  });

  it("blocks the request that exceeds the limit", () => {
    const key = uniqueKey("exceed");
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5);
    }
    expect(checkRateLimit(key, 5)).toBe(false);
  });

  it("continues blocking after the limit is exceeded", () => {
    const key = uniqueKey("keep-blocking");
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5);
    }
    expect(checkRateLimit(key, 5)).toBe(false);
    expect(checkRateLimit(key, 5)).toBe(false);
  });

  it("resets the counter after the window expires", () => {
    const key = uniqueKey("window-reset");
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60_000);
    }
    expect(checkRateLimit(key, 5, 60_000)).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(60_001);

    expect(checkRateLimit(key, 5, 60_000)).toBe(true);
  });

  it("uses a limit of 1 correctly", () => {
    const key = uniqueKey("limit-one");
    expect(checkRateLimit(key, 1)).toBe(true);
    expect(checkRateLimit(key, 1)).toBe(false);
  });

  it("isolates different keys from each other", () => {
    const key1 = uniqueKey("iso-a");
    const key2 = uniqueKey("iso-b");

    // Exhaust key1
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key1, 3);
    }
    expect(checkRateLimit(key1, 3)).toBe(false);

    // key2 should still be unaffected
    expect(checkRateLimit(key2, 3)).toBe(true);
  });

  it("respects a custom windowMs", () => {
    const key = uniqueKey("custom-window");
    checkRateLimit(key, 1, 5_000);
    expect(checkRateLimit(key, 1, 5_000)).toBe(false);

    vi.advanceTimersByTime(5_001);
    expect(checkRateLimit(key, 1, 5_000)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// getClientIp
// ---------------------------------------------------------------------------
describe("getClientIp", () => {
  function makeRequest(headers: Record<string, string>): Request {
    return new Request("http://localhost/", { headers });
  }

  it("extracts the first IP from x-forwarded-for when it has a single value", () => {
    const req = makeRequest({ "x-forwarded-for": "1.2.3.4" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("extracts only the first IP from a comma-separated x-forwarded-for header", () => {
    const req = makeRequest({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12" });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("trims whitespace from the extracted x-forwarded-for IP", () => {
    const req = makeRequest({ "x-forwarded-for": "  10.0.0.1  , 10.0.0.2" });
    expect(getClientIp(req)).toBe("10.0.0.1");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const req = makeRequest({ "x-real-ip": "192.168.1.1" });
    expect(getClientIp(req)).toBe("192.168.1.1");
  });

  it("returns 'unknown' when no IP headers are present", () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBe("unknown");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const req = makeRequest({
      "x-forwarded-for": "1.2.3.4",
      "x-real-ip": "9.9.9.9",
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });
});
