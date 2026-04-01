import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { hasListingsAdminAccess, canManageListing } from "@/core/api/listingAccess";

/** Builds a minimal Request object with the given headers. */
function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/listings", { headers });
}

/** A valid 32-character admin key. */
const VALID_KEY = "a".repeat(32);

/** A shorter-than-minimum key (31 chars). */
const SHORT_KEY = "a".repeat(31);

beforeEach(() => {
  process.env.LISTINGS_ADMIN_KEY = VALID_KEY;
});

afterEach(() => {
  delete process.env.LISTINGS_ADMIN_KEY;
});

// ---------------------------------------------------------------------------
// hasListingsAdminAccess
// ---------------------------------------------------------------------------
describe("hasListingsAdminAccess", () => {
  it("returns true when x-listings-admin-key matches the env var", () => {
    const req = makeRequest({ "x-listings-admin-key": VALID_KEY });
    expect(hasListingsAdminAccess(req)).toBe(true);
  });

  it("returns true when x-admin-key is used as the fallback header", () => {
    const req = makeRequest({ "x-admin-key": VALID_KEY });
    expect(hasListingsAdminAccess(req)).toBe(true);
  });

  it("prefers x-listings-admin-key over x-admin-key", () => {
    // Correct primary header, wrong fallback — should still pass
    const req = makeRequest({
      "x-listings-admin-key": VALID_KEY,
      "x-admin-key": "wrong-key-but-same-length!!!!!", // same length as VALID_KEY but wrong
    });
    expect(hasListingsAdminAccess(req)).toBe(true);
  });

  it("returns false when no auth header is present", () => {
    const req = makeRequest();
    expect(hasListingsAdminAccess(req)).toBe(false);
  });

  it("returns false when LISTINGS_ADMIN_KEY env var is not set", () => {
    delete process.env.LISTINGS_ADMIN_KEY;
    const req = makeRequest({ "x-listings-admin-key": VALID_KEY });
    expect(hasListingsAdminAccess(req)).toBe(false);
  });

  it("returns false when the env var is shorter than 32 characters", () => {
    process.env.LISTINGS_ADMIN_KEY = SHORT_KEY;
    const req = makeRequest({ "x-listings-admin-key": SHORT_KEY });
    expect(hasListingsAdminAccess(req)).toBe(false);
  });

  it("returns false when provided key has different length than expected", () => {
    const req = makeRequest({ "x-listings-admin-key": VALID_KEY.slice(0, -1) }); // 31 chars
    expect(hasListingsAdminAccess(req)).toBe(false);
  });

  it("returns false when keys are the same length but have different content", () => {
    const wrongKey = "b".repeat(32); // same length, different value
    const req = makeRequest({ "x-listings-admin-key": wrongKey });
    expect(hasListingsAdminAccess(req)).toBe(false);
  });

  it("returns false for an empty string header value", () => {
    const req = makeRequest({ "x-listings-admin-key": "" });
    expect(hasListingsAdminAccess(req)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// canManageListing
// ---------------------------------------------------------------------------
describe("canManageListing", () => {
  it("returns true when admin access is valid", () => {
    const req = makeRequest({ "x-listings-admin-key": VALID_KEY });
    expect(canManageListing(req, "listing-id-123")).toBe(true);
  });

  it("returns false when admin access is invalid", () => {
    const req = makeRequest({ "x-listings-admin-key": "wrong-key-wrong-key-wrong-key!!!" });
    expect(canManageListing(req, "listing-id-123")).toBe(false);
  });

  it("returns false when no auth header is provided", () => {
    const req = makeRequest();
    expect(canManageListing(req, "listing-id-123")).toBe(false);
  });
});
